import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { DocNode, ParserSections } from './parser';

const ensureDir = (p: string) => { try { fs.mkdirSync(p, { recursive: true }); } catch {} };
const writeJsonAtomic = (file: string, obj: unknown) => {
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2), 'utf8');
  fs.renameSync(tmp, file);
};

export function activateBuilder(ctx: vscode.ExtensionContext): { dispose(): void } {
  const ws = vscode.workspace.workspaceFolders?.[0];
  if (!ws) return { dispose() {} };
  const root = ws.uri.fsPath;
  const outDir = path.join(root, '.vscode', 'project_explorer');
  const parserFile = path.join(outDir, 'parser_output.json');
  const treeFile = path.join(outDir, 'tree_items.json');
  ensureDir(outDir);

  const pattern = new vscode.RelativePattern(ws, '.vscode/project_explorer/parser_output.json');
  const w = vscode.workspace.createFileSystemWatcher(pattern);

  const build = () => {
    let parsed: ParserSections | undefined;
    try {
      const txt = fs.readFileSync(parserFile, 'utf8');
      parsed = JSON.parse(txt);
    } catch { return; }
    if (!parsed) return;

    const items: any[] = [];
    const seen = new Set<string>();

    // userDefined pass-through
    if (Array.isArray(parsed.userDefined)) {
      for (const it of parsed.userDefined) {
        if (!it || typeof it !== 'object') continue;
        if (typeof it.id !== 'string' || !it.id) continue;
        if (seen.has(it.id)) continue;
        seen.add(it.id);
        items.push({ id: it.id, typeAndPath: it.typeAndPath, icon: it.icon, label: it.label, parentId: it.parentId, cwd: it.cwd, env: it.env });
      }
    }

    // docs builder
    const docs = parsed.docs || {};
    const pushDocTree = (node: DocNode, parentId: string | null) => {
      const basename = path.basename(node.path);
      if (node.type === 'folder') {
        // find promotion document
        const readme = node.children.find(c => c.type === 'doc' && /README\.md$/i.test(c.path));
        const baseDoc = node.children.find(c => c.type === 'doc' && path.basename(path.dirname(c.path)).replace(/\.[^/.]+$/, '') === path.basename(node.path));
        const promote = readme || baseDoc;
        if (promote) {
          const pid = idFromDoc(promote);
          addDocItem(promote, parentId);
          for (const child of node.children) {
            if (child === promote) continue;
            pushDocTree(child, pid);
          }
          return;
        }
        // regular folder item
        const id = basename;
        addItem({ id, typeAndPath: `folder:${node.path}`, icon: undefined, label: titleCase(basename), parentId });
        for (const child of node.children) pushDocTree(child, id);
        return;
      }
      if (node.type === 'doc') {
        addDocItem(node, parentId);
        return;
      }
      // resource
      const id = basename;
      addItem({ id, typeAndPath: `file:${node.path}`, icon: undefined, label: titleCase(basename.replace(/\.[^.]+$/, '')), parentId });
    };

    const addDocItem = (n: DocNode, parentId: string | null) => {
      const id = idFromDoc(n);
      const label = n.title && n.title.trim() ? n.title.trim() : titleCase(path.basename(n.path, '.md'));
      addItem({ id, typeAndPath: `file:${n.path}`, icon: undefined, label, parentId });
    };

    const idFromDoc = (n: DocNode) => path.basename(n.path, '.md');

    const addItem = (it: { id: string; typeAndPath: string; icon?: string; label: string; parentId: string | null }) => {
      if (!it.id || seen.has(it.id)) return;
      seen.add(it.id);
      items.push({ id: it.id, typeAndPath: it.typeAndPath, icon: it.icon, label: it.label, parentId: it.parentId || undefined });
    };

    for (const key of Object.keys(docs)) pushDocTree(docs[key], null);

    writeJsonAtomic(treeFile, items);
  };

  w.onDidCreate(build, null, ctx.subscriptions);
  w.onDidChange(build, null, ctx.subscriptions);
  w.onDidDelete(() => {}, null, ctx.subscriptions);

  if (fs.existsSync(parserFile)) build();

  return { dispose() { w.dispose(); } };
}

function titleCase(s: string): string {
  const tokens = s
    .replace(/[._-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/(\d)([A-Za-z])/g, '$1 $2')
    .replace(/([A-Za-z])(\d)/g, '$1 $2')
    .split(/\s+/)
    .filter(Boolean);
  return tokens.map(tok => /^[0-9]+$/.test(tok) ? tok.toUpperCase() : tok[0].toUpperCase() + tok.slice(1).toLowerCase()).join(' ');
}
