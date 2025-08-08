# Apply design updates: Brainstorming doc setting and title action

- [x] Add workspace setting: projectExplorer.brainstormingDocPath (string) to point to brainstorming document and watch it for changes. See: /design_docs/project_explorer.md#brainstorming-document-path
- [x] Add "Open Brainstorming Doc" title action icon to Project Explorer view, visible only when the setting is defined; tooltip "Brainstorming". See: /design_docs/project_explorer.md#title-action-icons
- [x] Wire the action to open the configured file in the editor; react immediately to setting changes so the icon appears/disappears and opens the current file. See: /design_docs/project_explorer.md#title-action-icons
- [x] Ensure icon usage consistent with design; use the lightbulb action icon in the view title bar.

## Notes and implications
- We will contribute a configuration schema under `projectExplorer.brainstormingDocPath` and read it via `workspace.getConfiguration('projectExplorer').get('brainstormingDocPath')`.
- VS Code when-clause `config.*` keys only evaluate boolean settings; since this setting is a string path, we will manage a custom context key `projectExplorer.hasBrainstorming` that is updated on activation and on configuration changes, and use that in the `view/title` menu `when` condition.
- We'll contribute a command `projectExplorer.openBrainstormingDoc` with a lightbulb icon and tooltip "Brainstorming"; the menu item will be shown in the Project Explorer view title with group `navigation`.
- The command will handle absolute paths and, if a relative path is provided, resolve against the first workspace folder.
