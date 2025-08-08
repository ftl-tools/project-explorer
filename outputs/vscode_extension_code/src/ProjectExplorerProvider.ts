import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as https from 'https';
import * as http from 'http';

class FaviconCache {
    private cacheDir: string;
    private indexPath: string;
    private index: Record<string, { path?: string; expiresAt?: number; negativeUntil?: number }>; // keyed by origin
    private inflight: Map<string, Promise<vscode.Uri | undefined>> = new Map();

    constructor(private context: vscode.ExtensionContext) {
        this.cacheDir = path.join(context.globalStorageUri.fsPath, 'favicons');
        this.indexPath = path.join(this.cacheDir, 'index.json');
        try { fs.mkdirSync(this.cacheDir, { recursive: true }); } catch {}
        this.index = this.readIndex();
    }

    async getIconForUrl(urlStr: string): Promise<vscode.Uri | undefined> {
        let origin: string;
        try {
            const u = new URL(urlStr);
            if (u.protocol !== 'http:' && u.protocol !== 'https:') return undefined;
            origin = `${u.protocol}//${u.host}`;
        } catch { return undefined; }

        // de-dupe concurrent fetches per origin
        const existing = this.inflight.get(origin);
        if (existing) return existing;

        const promise = this.resolve(origin, urlStr).finally(() => this.inflight.delete(origin));
        this.inflight.set(origin, promise);
        return promise;
    }

    private async resolve(origin: string, fullUrl: string): Promise<vscode.Uri | undefined> {
        const now = Date.now();
        const entry = this.index[origin];
        if (entry) {
            if (entry.expiresAt && entry.expiresAt > now && entry.path && fs.existsSync(entry.path)) {
                return vscode.Uri.file(entry.path);
            }
            if (entry.negativeUntil && entry.negativeUntil > now) return undefined;
        }

        // Try /favicon.ico first
        const icoUrl = `${origin}/favicon.ico`;
        const icoBuf = await this.tryFetchBuffer(icoUrl, 5000).catch(() => undefined);
        if (icoBuf) {
            const file = this.saveIcon(origin, icoBuf, 'ico');
            this.index[origin] = { path: file, expiresAt: now + 7 * 24 * 60 * 60 * 1000 };
            this.writeIndex();
            return vscode.Uri.file(file);
        }

        // Fallback: parse HTML for <link rel="icon"> etc
        const html = await this.tryFetchText(fullUrl, 5000).catch(() => undefined);
        if (html) {
            const href = this.findIconHref(html);
            if (href) {
                try {
                    const base = new URL(fullUrl);
                    const resolved = new URL(href, base);
                    const buf = await this.tryFetchBuffer(resolved.toString(), 7000).catch(() => undefined);
                    if (buf) {
                        const ext = this.guessExtFromUrlOrMime(resolved.toString());
                        const file = this.saveIcon(origin, buf, ext);
                        this.index[origin] = { path: file, expiresAt: now + 7 * 24 * 60 * 60 * 1000 };
                        this.writeIndex();
                        return vscode.Uri.file(file);
                    }
                } catch {}
            }
        }

        // Negative cache
        this.index[origin] = { negativeUntil: now + 24 * 60 * 60 * 1000 };
        this.writeIndex();
        return undefined;
    }

    private readIndex(): Record<string, { path?: string; expiresAt?: number; negativeUntil?: number }> {
        try {
            if (fs.existsSync(this.indexPath)) {
                const txt = fs.readFileSync(this.indexPath, 'utf8');
                return JSON.parse(txt) || {};
            }
        } catch {}
        return {};
    }

    private writeIndex(): void {
        try { fs.writeFileSync(this.indexPath, JSON.stringify(this.index, null, 2), 'utf8'); } catch {}
    }

    private saveIcon(origin: string, buf: Buffer, ext: string): string {
        const safe = origin.replace(/[^a-z0-9]/gi, '_');
        const file = path.join(this.cacheDir, `${safe}.${ext}`);
        fs.writeFileSync(file, buf);
        return file;
    }

    private guessExtFromUrlOrMime(u: string): string {
        const lower = u.toLowerCase();
        if (lower.endsWith('.png')) return 'png';
        if (lower.endsWith('.svg') || lower.includes('image/svg')) return 'svg';
        if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'jpg';
        if (lower.endsWith('.ico')) return 'ico';
        return 'png';
    }

    private async tryFetchText(urlStr: string, timeoutMs: number): Promise<string> {
        const buf = await this.tryFetchBuffer(urlStr, timeoutMs);
        return buf.toString('utf8');
    }

    private async tryFetchBuffer(urlStr: string, timeoutMs: number): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            let timedOut = false;
            const to = setTimeout(() => { timedOut = true; req?.destroy(new Error('timeout')); reject(new Error('timeout')); }, timeoutMs);
            const u = new URL(urlStr);
            const lib = u.protocol === 'https:' ? https : http;
            const req = lib.get(urlStr, res => {
                const status = res.statusCode || 0;
                // Handle redirects
                if ([301, 302, 303, 307, 308].includes(status) && res.headers.location) {
                    clearTimeout(to);
                    this.tryFetchBuffer(new URL(res.headers.location, urlStr).toString(), timeoutMs).then(resolve, reject);
                    res.resume();
                    return;
                }
                if (status < 200 || status >= 300) {
                    clearTimeout(to);
                    reject(new Error(`HTTP ${status}`));
                    res.resume();
                    return;
                }
                const chunks: Buffer[] = [];
                res.on('data', d => chunks.push(Buffer.isBuffer(d) ? d : Buffer.from(d)));
                res.on('end', () => { if (!timedOut) { clearTimeout(to); resolve(Buffer.concat(chunks)); } });
                res.on('error', err => { if (!timedOut) { clearTimeout(to); reject(err); } });
            });
            req.on('error', err => { if (!timedOut) { clearTimeout(to); reject(err); } });
        });
    }

    private findIconHref(html: string): string | undefined {
        // Very small heuristic: look for rel containing 'icon' and grab href
        const re = /<link\s+[^>]*rel=["']([^"']*)["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
        let m: RegExpExecArray | null;
        const candidates: string[] = [];
        while ((m = re.exec(html))) {
            const rel = m[1].toLowerCase();
            const href = m[2];
            if (rel.includes('icon')) candidates.push(href);
        }
        return candidates[0];
    }
}

export class ProjectExplorerProvider implements vscode.TreeDataProvider<ProjectExplorerItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<ProjectExplorerItem | undefined | null | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    private items: Map<string, ProjectExplorerItem> = new Map();
    private parentById: Map<string, string | undefined> = new Map();
    private childrenById: Map<string, string[]> = new Map();
    private roots: string[] = [];

    private favicons: FaviconCache;

    constructor(context: vscode.ExtensionContext) {
        this.favicons = new FaviconCache(context);
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('project-explorer.treeItems') || e.affectsConfiguration('project-explorer')) {
                this.refresh();
            }
        });
    }

    refresh(): void {
        this.rebuild();
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ProjectExplorerItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: ProjectExplorerItem): Promise<ProjectExplorerItem[]> {
        if (this.items.size === 0 && this.roots.length === 0) this.rebuild();
        if (!element) return this.roots.map(id => this.items.get(id)!).filter(Boolean);
        const ids = this.childrenById.get(element.id || '') || [];
        return ids.map(id => this.items.get(id)!).filter(Boolean);
    }

    private rebuild() {
        const warnings = new Set<string>();
        const cfg = vscode.workspace.getConfiguration('project-explorer');
        const raw = cfg.get<unknown>('treeItems');

        this.items.clear();
        this.parentById.clear();
        this.childrenById.clear();
        this.roots = [];

        const arr = Array.isArray(raw) ? raw : [];
        if (!Array.isArray(raw)) warnings.add('`project-explorer.treeItems` is not an array. Ignoring.');

        type UserItem = {
            id?: unknown;
            typeAndPath?: unknown; // new name
            type_plus_path?: unknown; // deprecated, supported for backward compatibility
            icon?: unknown;
            label?: unknown;
            parentId?: unknown;
        };

        type ValidItem = { id: string; type?: 'file' | 'folder' | 'url'; target?: string; icon?: string; label: string; parentId?: string; };
        const valid: Array<ValidItem> = [];

        for (const entry of arr as UserItem[]) {
            if (!entry || typeof entry !== 'object') {
                warnings.add('Ignored non-object entry in `project-explorer.treeItems`.');
                continue;
            }
            const id = typeof entry.id === 'string' && entry.id.trim() ? entry.id.trim() : '';
            if (!id) {
                warnings.add('Ignored item with missing `id`.');
                continue;
            }
            if (this.items.has(id) || valid.find(v => v.id === id)) {
                warnings.add(`Duplicate id '${id}' found. Only the first occurrence will be used.`);
                continue;
            }

            const parentId = typeof entry.parentId === 'string' && entry.parentId.trim() ? entry.parentId.trim() : undefined;
            const labelRaw = typeof entry.label === 'string' && entry.label.trim() ? entry.label.trim() : undefined;
            const icon = typeof entry.icon === 'string' && entry.icon.trim() ? entry.icon.trim() : undefined;

            let type: 'file' | 'folder' | 'url' | undefined;
            let target: string | undefined;

            const newRaw = (entry as any).typeAndPath;
            const oldRaw = (entry as any).type_plus_path;
            const tpp = typeof newRaw === 'string' && newRaw.trim() ? newRaw.trim() : (typeof oldRaw === 'string' && oldRaw.trim() ? oldRaw.trim() : '');
            if (!tpp && typeof oldRaw === 'string' && oldRaw.trim()) {
                warnings.add(`Item '${id}' uses deprecated 'type_plus_path'. Please rename to 'typeAndPath'.`);
            }
            if (tpp) {
                const colon = tpp.indexOf(':');
                if (colon > 0 && colon < tpp.length - 1) {
                    const t = tpp.slice(0, colon) as 'file' | 'folder' | 'url';
                    const tgt = tpp.slice(colon + 1);
                    if (['file', 'folder', 'url'].includes(t)) {
                        type = t;
                        target = tgt;
                    } else {
                        warnings.add(`Item '${id}' has unknown type '${t}'. Treating as label-only item.`);
                    }
                } else {
                    warnings.add(`Item '${id}' has invalid typeAndPath '${tpp}'. Treating as label-only item.`);
                }
            }

            // Determine label fallback behavior
            let label = labelRaw;
            if (!label) {
                if (type && target) {
                    if (type === 'url') {
                        try {
                            const u = new URL(target);
                            const segs = u.pathname.split('/').filter(Boolean);
                            label = segs.length > 0 ? decodeURIComponent(segs[segs.length - 1]) : u.hostname;
                        } catch {
                            label = target;
                        }
                    } else {
                        label = path.basename(this.resolveFsPath(target));
                    }
                } else {
                    // No type/target and no label provided; fall back to id
                    label = id;
                }
            }

            valid.push({ id, type, target, label, icon, parentId });
        }

        // Build nodes
        for (const v of valid) {
            const node = this.makeNode(v);
            this.items.set(v.id, node);
            this.parentById.set(v.id, v.parentId);
        }

        // Detect cycles
        const visited = new Set<string>();
        const stack = new Set<string>();
        const cyc = new Set<string>();
        const dfs = (id: string) => {
            if (stack.has(id)) {
                cyc.add(id);
                return;
            }
            if (visited.has(id)) return;
            visited.add(id);
            stack.add(id);
            const p = this.parentById.get(id);
            if (p && this.items.has(p)) dfs(p);
            stack.delete(id);
        };
        for (const id of this.items.keys()) dfs(id);
        if (cyc.size > 0) warnings.add('Detected cyclical parent relationships. Items in cycles will be rendered at top level.');
        for (const id of cyc) this.parentById.delete(id);

        // Build children and roots
        for (const id of this.items.keys()) this.childrenById.set(id, []);
        for (const [id, pid] of this.parentById) {
            if (pid && this.items.has(pid)) this.childrenById.get(pid)!.push(id);
        }
        // Any with no valid parent are roots
        for (const id of this.items.keys()) {
            const pid = this.parentById.get(id);
            if (!pid || !this.items.has(pid)) {
                if (pid && !this.items.has(pid)) warnings.add(`Parent '${pid}' not found for item '${id}'. Rendering as top-level.`);
                this.roots.push(id);
            }
        }

        // Set collapsible state based on children
        for (const [id, node] of this.items) {
            const hasChildren = (this.childrenById.get(id) || []).length > 0;
            node.collapsibleState = hasChildren ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;
            // For label-only items without explicit icon, use folder icon to hint grouping
            if (!node.command && !node.iconPath) {
                node.iconPath = new vscode.ThemeIcon('folder');
            }
        }

        // Surface warnings (non-blocking)
        if (warnings.size > 0) {
            vscode.window.showWarningMessage(Array.from(warnings).join(' '));
        }
    }

    private makeNode(v: { id: string; type?: 'file' | 'folder' | 'url'; target?: string; icon?: string; label: string; parentId?: string; }): ProjectExplorerItem {
        const { id } = v;
        const type = v.type;
        const target = v.target;
        let label = v.label;
        let iconPath: vscode.ThemeIcon | vscode.Uri | undefined;
        const tooltip = new vscode.MarkdownString();
        if (type && target) tooltip.appendText(`${type}:${target}`); else tooltip.appendText(label);
        tooltip.isTrusted = true;

        // icon resolution
        if (v.icon) {
            const codicon = this.parseCodicon(v.icon);
            if (codicon) iconPath = new vscode.ThemeIcon(codicon);
            else {
                const p = this.resolveFsPath(v.icon);
                if (fs.existsSync(p)) iconPath = vscode.Uri.file(p);
                else vscode.window.showWarningMessage(`Icon path not found for item '${id}': ${v.icon}. Falling back to default icon.`);
            }
        } else if (type === 'url') {
            iconPath = new vscode.ThemeIcon('globe');
        }

        const node = new ProjectExplorerItem(label, vscode.TreeItemCollapsibleState.None);
        node.id = id;
        node.tooltip = tooltip;
        node.iconPath = iconPath;

        // command behavior
        if (type === 'file' && target) {
            const uri = vscode.Uri.file(this.resolveFsPath(target));
            node.command = { command: 'vscode.open', title: 'Open File', arguments: [uri] };
        } else if (type === 'folder' && target) {
            const uri = vscode.Uri.file(this.resolveFsPath(target));
            node.command = { command: 'revealInExplorer', title: 'Reveal in Explorer', arguments: [uri] } as any;
        } else if (type === 'url' && target) {
            node.command = { command: 'projectExplorer.openExternal', title: 'Open in Browser', arguments: [target] };
            // Attempt async favicon resolution when user hasn't set a custom icon
            if (!v.icon) {
                this.favicons.getIconForUrl(target).then(uri => {
                    if (uri) {
                        const n = this.items.get(id);
                        if (n) {
                            n.iconPath = uri;
                            this._onDidChangeTreeData.fire(n);
                        }
                    }
                }).catch(() => {/*ignore*/});
            }
        }

        return node;
    }

    private parseCodicon(s: string): string | null {
        const m = /^\$\(([^)]+)\)$/.exec(s.trim());
        return m ? m[1] : null;
    }

    private resolveFsPath(p: string): string {
        let s = p.trim();
        if (s.startsWith('~') && process.env.HOME) s = s.replace('~', process.env.HOME);
        if (path.isAbsolute(s)) return s;
        const ws = vscode.workspace.workspaceFolders?.[0];
        if (ws) return path.join(ws.uri.fsPath, s);
        return s; // fall back
    }
}

export class ProjectExplorerItem extends vscode.TreeItem {
    constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState) {
        super(label, collapsibleState);
    }
}
