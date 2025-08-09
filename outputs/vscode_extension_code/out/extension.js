"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const ProjectExplorerProvider_1 = require("./ProjectExplorerProvider");
function activate(context) {
    const provider = new ProjectExplorerProvider_1.ProjectExplorerProvider(context);
    vscode.window.registerTreeDataProvider('projectExplorer', provider);
    // Watch for theme changes to update icons
    vscode.window.onDidChangeActiveColorTheme(() => {
        provider.refresh();
    });
    const updateBrainstormingContext = () => {
        const cfg = vscode.workspace.getConfiguration('project-explorer');
        const raw = cfg.get('brainstormingDocPath') || '';
        const has = typeof raw === 'string' && raw.trim().length > 0;
        void vscode.commands.executeCommand('setContext', 'projectExplorer.hasBrainstorming', has);
    };
    updateBrainstormingContext();
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('project-explorer.brainstormingDocPath') || e.affectsConfiguration('project-explorer')) {
            updateBrainstormingContext();
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('projectExplorer.openBrainstormingDoc', async () => {
        const cfg = vscode.workspace.getConfiguration('project-explorer');
        const pathSetting = (cfg.get('brainstormingDocPath') || '').trim();
        if (!pathSetting) {
            vscode.window.showWarningMessage('No brainstormingDocPath is configured.');
            return;
        }
        try {
            let targetUri;
            const isAbsolute = pathSetting.startsWith('/') || /^[a-zA-Z]:\\/.test(pathSetting) || pathSetting.startsWith('~');
            if (isAbsolute) {
                // expand ~ if present
                const expanded = pathSetting.startsWith('~') && process.env.HOME
                    ? pathSetting.replace('~', process.env.HOME)
                    : pathSetting;
                targetUri = vscode.Uri.file(expanded);
            }
            else {
                const ws = vscode.workspace.workspaceFolders?.[0];
                if (!ws) {
                    vscode.window.showErrorMessage('No workspace is open to resolve a relative brainstormingDocPath.');
                    return;
                }
                targetUri = vscode.Uri.joinPath(ws.uri, pathSetting);
            }
            const doc = await vscode.workspace.openTextDocument(targetUri);
            await vscode.window.showTextDocument(doc, { preview: false });
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            vscode.window.showErrorMessage(`Unable to open brainstorming document: ${msg}`);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('projectExplorer.openExternal', async (url) => {
        try {
            const uri = vscode.Uri.parse(url);
            await vscode.env.openExternal(uri);
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            vscode.window.showErrorMessage(`Unable to open URL: ${msg}`);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('projectExplorer.openHelp', async () => {
        const id = context.extension.id;
        let opened = false;
        try {
            opened = await vscode.env.openExternal(vscode.Uri.parse(`vscode:extension/${id}`));
        }
        catch {
            opened = false;
        }
        if (!opened) {
            await vscode.commands.executeCommand('workbench.extensions.search', `@id:${id}`);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('projectExplorer.openSettings', async () => {
        const hasWs = (vscode.workspace.workspaceFolders?.length || 0) > 0;
        if (hasWs) {
            await vscode.commands.executeCommand('workbench.action.openWorkspaceSettings');
            await vscode.commands.executeCommand('workbench.action.openSettings', '@ext:ftl-tools.project-explorer');
        }
        else {
            vscode.window.showInformationMessage('Workspace settings are unavailable. Opening User settings.');
            await vscode.commands.executeCommand('workbench.action.openSettings', '@ext:ftl-tools.project-explorer');
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('projectExplorer.configureTreeItems', async () => {
        await vscode.commands.executeCommand('workbench.action.openSettings', 'project-explorer.treeItems');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('projectExplorer.collapseAll', async () => {
        await vscode.commands.executeCommand('workbench.actions.treeView.projectExplorer.collapseAll');
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map