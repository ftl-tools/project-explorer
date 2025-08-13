import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const ensureDir = (p: string) => { try { fs.mkdirSync(p, { recursive: true }); } catch {} };
const writeJsonAtomic = (file: string, obj: unknown) => {
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2), 'utf8');
  fs.renameSync(tmp, file);
};

export type ParserSections = {
  userDefined?: any[];
  docs?: Record<string, DocNode>;
};

export type DocNode = { path: string; type: 'doc' | 'folder' | 'resource'; title: string; children: DocNode[] };

export function activateParser(ctx: vscode.ExtensionContext): { dispose(): void } {
  const ws = vscode.workspace.workspaceFolders?.[0];
  const outDir = path.join(ws?.uri.fsPath || '', '.vscode', 'project_explorer');
  if (ws) ensureDir(outDir);
  const outFile = ws ? path.join(outDir, 'parser_output.json') : '';

  let timer: NodeJS.Timeout | undefined;
  const debouncedRun = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(run, 150);
  };

  const cfgListener = vscode.workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration('project-explorer.watchThese') || e.affectsConfiguration('project-explorer.userDefinedTreeItems') || e.affectsConfiguration('project-explorer.treeItems')) debouncedRun();
  });

  const fsWatchers: vscode.FileSystemWatcher[] = [];

  const watchPath = (relOrAbs: string) => {
    if (!ws) return;
    const abs = path.isAbsolute(relOrAbs) ? relOrAbs : path.join(ws.uri.fsPath, relOrAbs);
    const pat = abs.replace(/\\/g, '/');
    const glob = new vscode.RelativePattern(ws, path.relative(ws.uri.fsPath, pat) + '/**');
    const w = vscode.workspace.createFileSystemWatcher(glob);
    fsWatchers.push(w);
    w.onDidChange(debouncedRun);
    w.onDidCreate(debouncedRun);
    w.onDidDelete(debouncedRun);
  };

  const readFirstH1 = (file: string): string => {
    try {
      const txt = fs.readFileSync(file, 'utf8');
      const m = /^#\s+(.+)$/m.exec(txt);
      return m ? m[1].trim() : '';
    } catch { return ''; }
  };

  const buildDocs = (p: string): DocNode => {
    const stat = fs.existsSync(p) ? fs.statSync(p) : undefined;
    if (!stat) return { path: rel(p), type: 'resource', title: '', children: [] };
    if (stat.isDirectory()) {
      const children: DocNode[] = [];
      for (const name of fs.readdirSync(p)) {
        // Skip common hidden/system folders and files
        if (name.startsWith('.') || 
            name === 'node_modules' || 
            name === '__pycache__' || 
            name === '.DS_Store' ||
            name === 'Thumbs.db' ||
            name === 'desktop.ini' ||
            name.endsWith('.tmp') ||
            name.endsWith('.temp')) continue;
        const child = path.join(p, name);
        children.push(buildDocs(child));
      }
      return { path: rel(p), type: 'folder', title: '', children };
    }
    if (p.toLowerCase().endsWith('.md')) {
      return { path: rel(p), type: 'doc', title: readFirstH1(p), children: [] };
    }
    return { path: rel(p), type: 'resource', title: '', children: [] };
  };

  const rel = (abs: string) => ws ? path.relative(ws.uri.fsPath, abs) : abs;

  const run = () => {
    const cfg = vscode.workspace.getConfiguration('project-explorer');
    const watch = cfg.get<any[]>('watchThese') || [];
    const userDefined = (cfg.get<any[]>('userDefinedTreeItems') || cfg.get<any[]>('treeItems') || []).filter(Boolean);

    const out: ParserSections = {};
    if (userDefined.length > 0) out.userDefined = userDefined;

    if (ws) {
      // reset watchers
      while (fsWatchers.length) fsWatchers.pop()?.dispose();
      const docsSection: Record<string, DocNode> = {};
      for (const entry of watch) {
        if (!entry || typeof entry !== 'object') continue;
        if (entry.type === 'docs' && typeof entry.path === 'string' && entry.path.trim()) {
          const abs = path.isAbsolute(entry.path) ? entry.path : path.join(ws.uri.fsPath, entry.path);
          watchPath(entry.path);
          docsSection[entry.path] = buildDocs(abs);
        }
      }
      if (Object.keys(docsSection).length > 0) out.docs = docsSection;
      ensureDir(outDir);
      writeJsonAtomic(outFile, out);
    }
  };

  if (ws) run();

  ctx.subscriptions.push(cfgListener);
  return { dispose() { while (fsWatchers.length) fsWatchers.pop()?.dispose(); if (timer) clearTimeout(timer); } };
}
