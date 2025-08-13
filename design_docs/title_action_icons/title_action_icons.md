# Title Action Icons

The Project Explorer title bar shows actions on the right. These provide quick access to common actions:

<details>
<summary>Test that</summary>

- The action icons appear in the Project Explorer view title bar in the order: Help, Brainstorming (when configured), Settings, Collapse All.
- Icons use correct light/dark variants and update on theme change without reload.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

## Help

Always visible and appears first. Uses the [help icon](/design_docs/title_action_icons/help.light_mode.png). Tooltip: "Help". Clicking opens this extension’s overview page in the Extensions view so users can read the README.

Implementation notes: Determine this extension’s identifier from `publisher.name` in its `package.json` and open the Extensions view directly to that extension’s details page. If direct navigation is unavailable, fall back to opening the Extensions view filtered to the extension id so the details page is shown.

<details>
<summary>Test that</summary>

- The Help icon is visible as the leftmost title action and uses the provided help icon assets in light/dark themes.
- Tooltip reads "Help" and clicking opens the extension’s details page; if deep link fails, the Extensions view opens filtered to the extension id showing details.
- Command does not change active editor or leave dirty files; errors display a non-blocking notification.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

## Open Brainstorming Doc

If the [brainstormingDocPath](#brainstorming-document-path) setting is defined, then show this action icon. It uses the [lightbulb icon](/design_docs/title_action_icons/lightbulb.light_mode.png). Tapping on this icon should open in the editor the file at the path defined in the settings. The tool tip should say "Brainstorming". This should react to changes in the setting immediately. That is to say that if the [brainstormingDocPath](#brainstorming-document-path) changes even after the extension is loaded, the icon should appear or disappear accordingly, and always open the correct file.

The extension should watch a vscode workspace setting named `brainstormingDocPath` that points to the brainstorming document for the project.

<details>
<summary>Test that</summary>

- When brainstormingDocPath is unset, the lightbulb action is hidden; when set to a valid file, it appears with tooltip "Brainstorming".
- Clicking the lightbulb opens the configured file in an editor; updating the setting at runtime switches the target without reload.
- If the setting points to a missing file, clicking shows a non-blocking error notification and does not create a file; relative vs absolute paths resolve from workspace root.
- Icon reacts to theme changes; command is disabled if no workspace is open and path is relative.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

## Settings

Always visible. Uses the built-in gear codicon (`$(gear)`). Tooltip: "Project Explorer Settings".

Clicking opens the workspace settings JSON (settings.json) when a workspace is open; with no workspace, open the user settings JSON.

Implementation notes: Delegate all organization and default injection to the [Settings Utility](/design_docs/vscode_extensions.md#settings-and-settings-utility). The action should:
- Call [settingsUtil.format()](/design_docs/vscode_extensions.md#settings-and-settings-utility) to group `ftl-tools.*` keys and add missing defaults without overwriting existing values.
- Open the returned URI in an editor and reveal the first `ftl-tools.*` key position if provided.

Notes:
- Operate only on JSON, not the Settings UI.
- If multiple workspaces are open, the Settings Utility should target the first workspace folder’s settings.json.

<details>
<summary>Test that</summary>

- The Settings action is always visible with gear codicon and tooltip "Project Explorer Settings".
- With a workspace open, clicking opens .vscode/settings.json (or the workspace settings.json) in an editor; with no workspace, opens the user settings.json.
- In the opened JSON, all keys starting with `ftl-tools.` are grouped contiguously near the first such key; existing values are preserved; comments adjacent to moved keys remain when feasible.
- Any known missing settings for this extension are added with default values; existing user-defined values are not overwritten.
- The cursor/selection jumps to the first `ftl-tools.*` setting in the file.
- If settings.json does not exist, it is created as a valid JSON object containing the default `ftl-tools.*` settings.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

## Collapse All

Uses the built-in collapse-all codicon (`$(collapse-all)`). Tooltip: "Collapse All". Invoking it runs `workbench.actions.treeView.projectExplorer.collapseAll` and collapses all expanded nodes in this view without opening editors or changing the active view.

<details>
<summary>Test that</summary>

- The Collapse All action is visible with the correct codicon and tooltip.
- Expanding multiple nodes then invoking the action collapses only the Project Explorer view nodes and does not focus or open any editors.
- Invoking via command palette has the same effect and does not affect other views’ trees.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>
