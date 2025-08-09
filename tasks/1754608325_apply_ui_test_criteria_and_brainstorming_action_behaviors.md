# Apply doc changes: UI test criteria and brainstorming action behaviors

This task applies the latest design-doc updates to the Project Explorer extension code and build/test setup.

- [x] Project Explorer view acceptance criteria: Ensure a view with id `projectExplorer` titled "Project Explorer" appears under the Explorer container, is focusable, and renders no items (empty state) when loaded. See: /design_docs/project_explorer.md#project-explorer-views
- [x] Title action behaviors and acceptance: When `projectExplorer.brainstormingDocPath` is non-empty the "Brainstorming" title action is visible with a lightbulb icon and tooltip "Brainstorming"; when empty it is hidden; changing the setting during a session updates visibility immediately; clicking opens the configured document supporting absolute paths, `~` expansion, and paths relative to the first workspace; invalid paths surface an error without opening an editor. See: /design_docs/project_explorer.md#title-action-icons
- [x] UI testing setup (infrastructure only, no tests yet): Add npm devDependencies and scripts to enable running UI tests with vscode-extension-tester per guidance. See: /design_docs/vscode_extensions.md#ui-tests

Notes and implications to watch:

- The docs reference a custom lightbulb icon at /design_docs/lightbulb.light_mode.png. We currently use the built-in codicon `$(light-bulb)`, which satisfies the "lightbulb icon" requirement without bundling assets. No change needed unless the design later requires a custom image asset in the extension package.
