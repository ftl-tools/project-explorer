import * as vscode from "vscode";
import { ProjectExplorerProvider } from "./ProjectExplorerProvider";

import { activateParser } from "./parser";
import { activateBuilder } from "./builder";

export async function activate(context: vscode.ExtensionContext) {
  const provider = new ProjectExplorerProvider(context);

  // Ensure workspace .vscode/project_explorer exists and start parser/builder
  const ws = vscode.workspace.workspaceFolders?.[0];
  if (ws) {
    const dir = vscode.Uri.joinPath(ws.uri, ".vscode", "project_explorer");
    await vscode.workspace.fs.createDirectory(dir);
  }
  const parser = activateParser(context);
  const builder = activateBuilder(context);

  vscode.window.registerTreeDataProvider("projectExplorer", provider);

  // Watch for theme changes to update icons immediately
  const themeSub = vscode.window.onDidChangeActiveColorTheme(() => {
    provider.retheme();
  });
  context.subscriptions.push(themeSub);

  const settings = await import('./utils/settingsUtil');
  const updateBrainstormingContext = () => {
    const raw = settings.get<string>('ftl-tools.project-explorer.brainstormingDocPath') || '';
    const has = typeof raw === 'string' && raw.trim().length > 0;
    void vscode.commands.executeCommand('setContext','projectExplorer.hasBrainstorming',has);
  };
  settings.watch<string>('ftl-tools.project-explorer.brainstormingDocPath' as any, () => updateBrainstormingContext());
  updateBrainstormingContext();

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "projectExplorer.openBrainstormingDoc",
      async () => {
        const settings = await import('./utils/settingsUtil');
        const pathSetting = (settings.get<string>('ftl-tools.project-explorer.brainstormingDocPath') || '').trim();
        if (!pathSetting) {
          vscode.window.showWarningMessage(
            "No brainstormingDocPath is configured.",
          );
          return;
        }

        try {
          let targetUri: vscode.Uri | undefined;
          const isAbsolute =
            pathSetting.startsWith("/") ||
            /^[a-zA-Z]:\\/.test(pathSetting) ||
            pathSetting.startsWith("~");
          if (isAbsolute) {
            // expand ~ if present
            const expanded =
              pathSetting.startsWith("~") && process.env.HOME
                ? pathSetting.replace("~", process.env.HOME)
                : pathSetting;
            targetUri = vscode.Uri.file(expanded);
          } else {
            const ws = vscode.workspace.workspaceFolders?.[0];
            if (!ws) {
              vscode.window.showErrorMessage(
                "No workspace is open to resolve a relative brainstormingDocPath.",
              );
              return;
            }
            targetUri = vscode.Uri.joinPath(ws.uri, pathSetting);
          }

          const doc = await vscode.workspace.openTextDocument(targetUri);
          await vscode.window.showTextDocument(doc, { preview: false });
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          vscode.window.showErrorMessage(
            `Unable to open brainstorming document: ${msg}`,
          );
        }
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "projectExplorer.openExternal",
      async (url: string) => {
        try {
          const uri = vscode.Uri.parse(url);
          await vscode.env.openExternal(uri);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          vscode.window.showErrorMessage(`Unable to open URL: ${msg}`);
        }
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "projectExplorer.runScript",
      async (id: string) => {
        await provider.runScriptById(id);
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "projectExplorer.showInExplorer",
      async (item: any) => {
        try {
          if (
            item &&
            item.command &&
            item.command.arguments &&
            item.command.arguments[0]
          ) {
            const uri = item.command.arguments[0];

            // Use the workbench command to reveal files/folders in Explorer without opening them
            await vscode.commands.executeCommand("revealInExplorer", uri);
          } else {
            vscode.window.showErrorMessage(
              "No valid item found to reveal in Explorer",
            );
          }
        } catch (error) {
          const msg = error instanceof Error ? error.message : String(error);
          vscode.window.showErrorMessage(`Failed to show in Explorer: ${msg}`);
        }
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "projectExplorer.openInBrowser",
      async (item: any) => {
        if (
          item &&
          item.command &&
          item.command.command === "projectExplorer.openExternal"
        ) {
          const url = item.command.arguments[0];
          await vscode.commands.executeCommand(
            "projectExplorer.openExternal",
            url,
          );
        }
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "projectExplorer.openDocInPreview",
      async (item: any) => {
        try {
          if (
            item &&
            item.command &&
            item.command.arguments &&
            item.command.arguments[0]
          ) {
            const uri = item.command.arguments[0];
            await vscode.commands.executeCommand("markdown.showPreview", uri);
          }
        } catch (error) {
          const msg = error instanceof Error ? error.message : String(error);
          vscode.window.showErrorMessage(`Failed to open in preview: ${msg}`);
        }
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "projectExplorer.openDocInEditor",
      async (item: any) => {
        try {
          if (
            item &&
            item.command &&
            item.command.arguments &&
            item.command.arguments[0]
          ) {
            const uri = item.command.arguments[0];
            await vscode.commands.executeCommand("vscode.open", uri);
          }
        } catch (error) {
          const msg = error instanceof Error ? error.message : String(error);
          vscode.window.showErrorMessage(`Failed to open in editor: ${msg}`);
        }
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("projectExplorer.openHelp", async () => {
      const id = context.extension.id;
      const uri = vscode.Uri.parse(`vscode:extension/${id}`);
      await vscode.commands.executeCommand("vscode.open", uri);
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "projectExplorer.openSettings",
      async () => {
        const settings = await import("./utils/settingsUtil");
        const { openedUri, firstKey } = await settings.format();
        const doc = await vscode.workspace.openTextDocument(openedUri);
        const editor = await vscode.window.showTextDocument(doc, { preview: false });
        if (firstKey) {
          const text = doc.getText();
          const idx = text.indexOf(`"${firstKey}"`);
          if (idx >= 0) {
            const pos = doc.positionAt(idx + 1);
            editor.revealRange(new vscode.Range(pos, pos), vscode.TextEditorRevealType.InCenter);
            editor.selection = new vscode.Selection(pos, pos);
          }
        }
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "projectExplorer.configureTreeItems",
      async () => {
        await vscode.commands.executeCommand(
          "workbench.action.openSettings",
          "project-explorer.treeItems",
        );
      },
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("projectExplorer.collapseAll", async () => {
      await vscode.commands.executeCommand(
        "workbench.actions.treeView.projectExplorer.collapseAll",
      );
    }),
  );
}

export function deactivate() {}
