# Title Action Icons

The Project Explorer title bar shows actions on the right. These provide quick access to common actions:

<details>
<summary>Test that</summary>

- The action icons appear in the Project Explorer view title bar in the order below.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

## Help

Always visible and appears first. Uses the [help icon](/design_docs/title_action_icons/help.light_mode.png). Tooltip: "Help". Clicking opens this extension’s overview page in the Extensions view so users can read the README.

Implementation notes: Determine this extension’s identifier from `publisher.name` in its `package.json` and open the Extensions view directly to that extension’s details page. If direct navigation is unavailable, fall back to opening the Extensions view filtered to the extension id so the details page is shown.

<details>
<summary>Test that</summary>

- TODO...

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

## Open Brainstorming Doc

If the [brainstormingDocPath](#brainstorming-document-path) setting is defined, then show this action icon. It uses the [lightbulb icon](/design_docs/title_action_icons/lightbulb.light_mode.png). Tapping on this icon should open in the editor the file at the path defined in the settings. The tool tip should say "Brainstorming". This should react to changes in the setting immediately. That is to say that if the [brainstormingDocPath](#brainstorming-document-path) changes even after the extension is loaded, the icon should appear or disappear accordingly, and always open the correct file.

The extension should watch a vscode workspace setting named `brainstormingDocPath` that points to the brainstorming document for the project.

<details>
<summary>Test that</summary>

- TODO...

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

## Settings

Always visible. Uses the built-in gear codicon (`$(gear)`). Tooltip: "Project Explorer Settings". Clicking opens the VS Code Settings UI filtered to this extension's settings using the query `@ext:ftl-tools.project-explorer`. If at least one workspace folder is open, open the Workspace settings view; otherwise open the User settings view and show a small info notification that workspace settings are unavailable. Never open JSON settings files; always use the Settings UI.

<details>
<summary>Test that</summary>

- TODO...

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

## Collapse All

Uses the built-in collapse-all codicon (`$(collapse-all)`). Tooltip: "Collapse All". Invoking it runs `workbench.actions.treeView.projectExplorer.collapseAll` and collapses all expanded nodes in this view without opening editors or changing the active view.

<details>
<summary>Test that</summary>

- TODO...

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>
