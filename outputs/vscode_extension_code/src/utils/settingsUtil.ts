import * as vscode from 'vscode';

export type Scope = 'workspace' | 'user';

type Defaults = Record<string, unknown>;

const defaults: Defaults = {
  'ftl-tools.project-explorer.watchThese': [],
  'ftl-tools.project-explorer.userDefinedTreeItems': [],
  'ftl-tools.project-explorer.openDocsInPreview': true,
  'ftl-tools.project-explorer.brainstormingDocPath': '',
};

const scopeFor = (scope?: Scope): vscode.ConfigurationTarget => {
  if (scope === 'user') return vscode.ConfigurationTarget.Global;
  if (scope === 'workspace') return vscode.ConfigurationTarget.Workspace;
  const hasWs = (vscode.workspace.workspaceFolders?.length || 0) > 0;
  return hasWs
    ? vscode.ConfigurationTarget.Workspace
    : vscode.ConfigurationTarget.Global;
};

export const get = <T>(key: string, _scope?: Scope): T | undefined => {
  const parts = key.split('.');
  const section = parts.shift() || '';
  const cfg = vscode.workspace.getConfiguration(section);
  const k = parts.join('.');
  return cfg.get<T>(k);
};

export const update = async <T>(key: string, value: T, scope?: Scope): Promise<void> => {
  const parts = key.split('.');
  const section = parts.shift() || '';
  const cfg = vscode.workspace.getConfiguration(section);
  const k = parts.join('.');
  await cfg.update(k, value, scopeFor(scope));
};

export const watch = <T>(keys: string[] | RegExp, handler: (k: string, v: T | undefined) => void, _scope?: Scope): vscode.Disposable => {
  const asArray = Array.isArray(keys) ? keys : null;
  const rex = asArray ? null : (keys as RegExp);

  const invokeNow = () => {
    const all: string[] = asArray || [];
    if (!asArray && rex) {
      // scan known defaults and current config for matches
      const candidates = new Set<string>([...Object.keys(defaults)]);
      const cfgAll = [
        'project-explorer.watchThese',
        'project-explorer.userDefinedTreeItems',
        'project-explorer.treeItems',
        'project-explorer.openDocsInPreview',
        'project-explorer.brainstormingDocPath',
      ];
      for (const c of cfgAll) candidates.add(`ftl-tools.${c}`);
      for (const k of candidates) if (rex.test(k)) handler(k, get<T>(k));
      return;
    }
    for (const k of all) handler(k, get<T>(k));
  };

  invokeNow();

  const sub = vscode.workspace.onDidChangeConfiguration(e => {
    const test = (fullKey: string) => {
      const parts = fullKey.split('.');
      const section = parts.shift() || '';
      const k = parts.join('.');
      return e.affectsConfiguration(`${section}.${k}`) || e.affectsConfiguration(section);
    };
    if (asArray) {
      for (const k of asArray) if (test(k)) handler(k, get<T>(k));
      return;
    }
    if (rex) {
      // on any change, re-evaluate candidates and emit those matching regex
      const candidates = new Set<string>([...Object.keys(defaults)]);
      const cfgAll = [
        'project-explorer.watchThese',
        'project-explorer.userDefinedTreeItems',
        'project-explorer.treeItems',
        'project-explorer.openDocsInPreview',
        'project-explorer.brainstormingDocPath',
      ];
      for (const c of cfgAll) candidates.add(`ftl-tools.${c}`);
      for (const k of candidates) if (rex.test(k) && test(k)) handler(k, get<T>(k));
    }
  });

  return { dispose() { sub.dispose(); } };
};

const settingsUri = async (): Promise<vscode.Uri> => {
  const ws = vscode.workspace.workspaceFolders?.[0];
  if (ws) return vscode.Uri.joinPath(ws.uri, '.vscode', 'settings.json');
  // fallback to user settings.json
  // Use VS Code API to get user settings location is not provided; approximate common path
  // Open untitled if not known; but we will create a JSON file in workspace or show user settings via command when needed
  const home = process.env.HOME || process.env.USERPROFILE || '';
  return vscode.Uri.file(home ? `${home}/Library/Application Support/Code/User/settings.json` : '');
};

export const format = async (): Promise<{ openedUri: vscode.Uri; firstKey: string | null }> => {
  const uri = await settingsUri();
  let json: Record<string, unknown> = {};
  let exists = true;
  try {
    const buf = await vscode.workspace.fs.readFile(uri);
    const txt = Buffer.from(buf).toString('utf8').trim();
    json = txt ? JSON.parse(txt) : {};
  } catch {
    exists = false;
  }

  if (!exists) json = {};

  // collect ftl-tools.* keys, inject defaults for known ones
  const allKeys = new Set<string>(Object.keys(json));
  for (const k of Object.keys(defaults)) if (!allKeys.has(k)) json[k] = defaults[k];

  // Grouping: ensure ftl-tools.* keys are together by reconstructing object with grouped keys first among their first occurrence
  const ftlKeys = Object.keys(json).filter(k => k.startsWith('ftl-tools.')).sort();
  const nonFtl = Object.keys(json).filter(k => !k.startsWith('ftl-tools.'));
  const ordered: Record<string, unknown> = {};
  for (const k of ftlKeys) ordered[k] = json[k];
  for (const k of nonFtl) ordered[k] = json[k];

  const content = JSON.stringify(ordered, null, 2);
  await vscode.workspace.fs.createDirectory(vscode.Uri.joinPath(uri, '..'));
  await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf8'));

  const firstKey = ftlKeys[0] || null;
  return { openedUri: uri, firstKey };
};
