# Project Explorer

The project explorer is a [VSCode extension](/design_docs/vscode_extensions.md) that helps developers navigate and manage their projects more effectively. The extension is developed by team `ftl-tools` and has id `ftl-project-explorer`. The extension is released under the MIT license, it's repository field is this repository. The code for the extension can be found in the `outputs/vscode_extension_code/` folder. This document outlines the major parts of the extension and how they work together.

## Project Explorer Views

We want to add a tree view named "Project Explorer" to the file explorer panel in VSCode.

<details>
<summary>Test that</summary>

- A view with id `projectExplorer` and title "Project Explorer" appears under the Explorer container and is focusable.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

### Title Action Icons

The Project Explorer title bar shows actions on the right. These provide quick access to common actions:

- **Help**: Always visible and appears first. Uses the [help icon](/design_docs/help.light_mode.png). Tooltip: "Help". Clicking opens this extension’s overview page in the Extensions view so users can read the README.

  - Implementation notes: Determine this extension’s identifier from `publisher.name` in its `package.json` and open the Extensions view directly to that extension’s details page. If direct navigation is unavailable, fall back to opening the Extensions view filtered to the extension id so the details page is shown.
  <details>
  <summary>Test that</summary>

  - The "Help" title action is always visible on the `projectExplorer` view and is the left-most action among navigation actions.
  - It shows the help icon and tooltip "Help".
  - Invoking it opens the Extensions view focused on this extension’s details page, displaying the README.

  [How to Test](/design_docs/vscode_extensions.md#testing)

  </details><br>

- **Open Brainstorming Doc**: If the [brainstormingDocPath](#brainstorming-document-path) setting is defined, then show this action icon. It uses the [lightbulb icon](/design_docs/lightbulb.light_mode.png). Tapping on this icon should open in the editor the file at the path defined in the settings. The tool tip should say "Brainstorming". This should react to changes in the setting immediately. That is to say that if the [brainstormingDocPath](#brainstorming-document-path) changes even after the extension is loaded, the icon should appear or disappear accordingly, and always open the correct file.

  - The extension should watch a vscode workspace setting named `brainstormingDocPath` that points to the brainstorming document for the project.
  <details>
  <summary>Test that</summary>

  - When `brainstormingDocPath` is non-empty, the "Brainstorming" title action is visible with the lightbulb icon and tooltip "Brainstorming".
  - When `brainstormingDocPath` is empty, the action is hidden.
  - Changing `brainstormingDocPath` during a session updates the action’s visibility immediately.
  - Clicking the action opens the configured document for absolute paths, `~` expansion, and paths relative to the first workspace folder.
  - Invalid paths surface an error without opening an editor.

  [How to Test](/design_docs/vscode_extensions.md#testing)

  </details><br>

- **Settings**: Always visible. Uses the built-in gear codicon (`$(gear)`). Tooltip: "Project Explorer Settings". Clicking opens the VS Code Settings UI filtered to this extension's settings using the query `@ext:ftl-tools.project-explorer`. If at least one workspace folder is open, open the Workspace settings view; otherwise open the User settings view and show a small info notification that workspace settings are unavailable. Never open JSON settings files; always use the Settings UI.
  <details>
  <summary>Test that</summary>

  - The "Project Explorer Settings" title action is always visible on the `projectExplorer` view.
  - It shows the gear icon and tooltip "Project Explorer Settings".
  - Invoking it opens the Settings UI filtered to `@ext:ftl-tools.project-explorer`.
  - With a workspace open, the Workspace tab is active and JSON settings files do not open.
  - Without a workspace, the User tab is active and an informational message explains that workspace settings are unavailable; JSON settings files do not open.

  [How to Test](/design_docs/vscode_extensions.md#testing)

  </details><br>

- **Collapse All**: Uses the built-in collapse-all codicon (`$(collapse-all)`). Tooltip: "Collapse All". Invoking it runs `workbench.actions.treeView.projectExplorer.collapseAll` and collapses all expanded nodes in this view without opening editors or changing the active view.
  <details>
  <summary>Test that</summary>

  - The "Collapse All" title action is visible on the `projectExplorer` view title bar and appears on the right side among navigation actions.
  - It shows the collapse-all icon and tooltip "Collapse All".
  - Clicking it collapses all expanded nodes (including nested levels) so that only top-level nodes remain collapsed; clicking again when already collapsed is a no-op.
  - Focus remains in the Project Explorer and no editors are opened; no errors are shown.

  [How to Test](/design_docs/vscode_extensions.md#testing)

  </details><br>

<details>
<summary>Test that</summary>

- The action icons appear in the Project Explorer view title bar in this order: Help, Brainstorming (when visible), Settings, Collapse All.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

## Tree Items

### User-Defined Tree Items

Users should be able to define what items show up in the tree via a vscode workspace setting named `treeItems`. Whenever this is changed the tree items should immediately update.

<details>
<summary>Test that</summary>

- Changing the `treeItems` workspace setting adds, removes, and updates items in the tree immediately without reloading the window; unaffected branches retain their expand/collapse state.
- When `treeItems` is not an array or contains non-object entries, those entries are ignored, a validation error is surfaced, and valid items continue to render.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

This tree items setting should be an array of objects. The objects should have the following format:

```json
{
  "id": "custom_item_id",
  "typeAndPath": "file:custom/file.txt",
  "icon": "resources/images/custom-icon.svg",
  "label": "Custom Item",
  "parentId": "parent_item_id"
}
```

Let's break these down in detail:

- `id`: A unique identifier for the custom item.
  <details>
  <summary>Test that</summary>

  - `id` values are unique across all items. When duplicates are present, the extension surfaces a warning and renders only the first occurrence; subsequent duplicates are ignored.
  - Each object renders a single tree node keyed by `id`, and editing that object's properties (`label`, `icon`, `typeAndPath`, `parentId`) updates the existing node in place (no duplicate nodes) across setting changes.

  [How to Test](/design_docs/vscode_extensions.md#testing)

  </details><br>

- `typeAndPath`: A string that specifies both the type and path of the item separated by a `:`. We combine these two into one property because usually they should both be defined or neither of them defined. The behavior of this item will change based on the type:

  - `file:path/to/file.txt`: When tapped open the file in the editor. When no icon is specified, use the default icon for this file type.
  - `folder:path/to/folder`: When tapped open the folder in the explorer. When no icon is specified, use the default icon for this file type.
  - `url:https://example.com`: When tapped open the URL in an external browser. When no icon is specified, attempt to fetch and use the site’s favicon; while loading show the VS Code globe codicon (`$(globe)`), and if favicon fetching fails, keep using the globe.

  <details>
  <summary>Test that</summary>

  - `typeAndPath` supports the forms `file:...`, `folder:...`, and `url:https://...`. Missing `:` separators, empty paths, or unknown types result in the item being ignored with a surfaced validation error while other valid items still render.
  - Clicking a `file:` item opens the target file in the editor; if the file does not exist, an error is shown and no editor is opened. When `icon` is omitted, the file’s default icon (from the current icon theme) is used.
  - Clicking a `folder:` item reveals the folder in the VS Code Explorer if it exists; if it does not exist, an error is shown and no action is taken. When `icon` is omitted, the default folder icon is used.
  - Clicking a `url:` item opens the URL in the system browser. When `icon` is omitted, the VS Code globe codicon is used.
  - File and folder paths support absolute paths, `~` expansion, and paths relative to the first workspace folder. Invalid paths surface an error and do not break other items.
  - With `typeAndPath: "url:https://example.com"` and no `icon`, the item initially shows `$(globe)`, then updates to the site favicon when available.
  - Sites with a valid `/favicon.ico` display that icon. If missing, but HTML contains `<link rel="icon" ...>`, that icon is used.
  - When no favicon can be resolved or fetch fails (timeout, non-HTTP(S) scheme), the globe remains.
  - Cached favicons persist across window reloads; subsequent openings do not re-fetch within the 7-day TTL. Negative results are not retried within 24 hours.
  - While the favicon is being fetched, the tree remains responsive; selection state is preserved when the icon updates.

  [How to Test](/design_docs/vscode_extensions.md#testing)

  </details><br>

- `icon`: Optionally specify a custom icon for this item. This can be a path to an image file or a VSCode codicon. If not specified, use the default icon for the type.
  <details>
  <summary>Test that</summary>

  - `icon` accepts either a VS Code codicon identifier (e.g., `$(rocket)`) or an image file path (e.g., `.svg`, `.png`). Valid codicons render correctly; valid image paths render the image. Invalid `icon` values fall back to the type’s default icon and surface a non-blocking warning.
  - Icon image paths support absolute paths, `~` expansion, and paths relative to the first workspace folder. Invalid paths surface an error and fall back to the default icon.

  [How to Test](/design_docs/vscode_extensions.md#testing)

  </details><br>

- `label`: Optionally specify a custom label for this item. If not specified, use the last part of the path (e.g., `file.txt` for `file:custom/file.txt`).
  <details>
  <summary>Test that</summary>

  - When `label` is omitted: for `file:` and `folder:` items the label defaults to the last path segment; for `url:` items it defaults to the last URL path segment without query/fragment, or to the hostname when the path segment is empty.

  [How to Test](/design_docs/vscode_extensions.md#testing)

  </details><br>

- `parentId`: Optionally specify the ID of the parent item. If not specified, the item will be a top-level item in the tree. If specified, the item will be nested under the parent item with that ID.
  <details>
  <summary>Test that</summary>

  - `parentId` creates nesting under the item with that `id`, supporting multiple levels of depth.
  - Items whose `parentId` does not resolve to an existing item are treated as top-level and surface a warning.
  - Cyclical parent relationships (e.g., A→B→A or longer cycles) are detected; items in the cycle are rendered as top-level to prevent infinite loops and a warning is surfaced.
  - Removing a parent item causes its former children (items whose `parentId` referenced it) to become top-level items and surfaces a warning.
  - Changing an item’s `parentId` moves the existing node to the new location without creating duplicates.

  [How to Test](/design_docs/vscode_extensions.md#testing)

  </details><br>

### Editing Tree Items in VS Code Settings

We want users to manage the list of custom tree items from the VS Code Settings UI. VS Code supports exposing complex settings via JSON schema. For arrays of objects, the Settings UI shows the setting with an “Edit in settings.json” link; users will edit the JSON with full IntelliSense based on our schema. No custom UI embedding into the Settings editor is supported by the API, so this is the recommended approach.

- Exact setting keys used by this extension:
  - `project-explorer.treeItems`
  - `project-explorer.brainstormingDocPath`

#### Configuration contribution (package.json)

Add these settings in `contributes.configuration` so they appear in the Settings UI and get IntelliSense in settings.json:

```json
{
  "contributes": {
    "configuration": {
      "title": "Project Explorer",
      "properties": {
        "project-explorer.brainstormingDocPath": {
          "type": "string",
          "scope": "resource",
          "markdownDescription": "Absolute path, `~` expansion, or path relative to the first workspace folder pointing to your brainstorming document."
        },
        "project-explorer.treeItems": {
          "type": "array",
          "scope": "resource",
          "default": [],
          "markdownDescription": "User-defined items that appear in the Project Explorer tree.",
          "items": {
            "type": "object",
            "required": ["id"],
            "properties": {
              "id": {
                "type": "string",
                "markdownDescription": "Unique identifier for the item. Must be unique across all items."
              },
              "typeAndPath": {
                "type": "string",
                "markdownDescription": "One of `file:path/to/file`, `folder:path/to/folder`, or `url:https://...`."
              },
              "icon": {
                "type": "string",
                "markdownDescription": "Optional codicon (e.g., `$(rocket)`) or image path (`.svg`, `.png`)."
              },
              "label": {
                "type": "string",
                "markdownDescription": "Optional label. Defaults to the last segment of the path or hostname for URLs."
              },
              "parentId": {
                "type": "string",
                "markdownDescription": "Optional parent item id for nesting."
              }
            }
          }
        }
      }
    }
  }
}
```

#### Implementation notes

- Read settings with `workspace.getConfiguration('project-explorer')` and keys `treeItems` and `brainstormingDocPath`.
- Listen for changes via `workspace.onDidChangeConfiguration(e => { if (e.affectsConfiguration('project-explorer.treeItems')) {...} })` and refresh the tree immediately while preserving expansion state.
- The Settings title bar gear action should open the Settings UI filtered to `@ext:ftl-tools.project-explorer`. Provide a secondary command “Project Explorer: Configure Tree Items…” that reveals the specific setting by executing `workbench.action.openSettings` with the query `project-explorer.treeItems`. Never open JSON files directly from this command; let the Settings UI handle that.
- Validation and error surfacing rules in this document apply when reading the setting. Ignore invalid entries but continue rendering valid ones.

<details>
<summary>Test that</summary>

- The settings `project-explorer.treeItems` and `project-explorer.brainstormingDocPath` are visible under the extension in the Settings UI.
- `project-explorer.treeItems` shows an “Edit in settings.json” affordance; clicking it opens the Workspace settings JSON when a workspace is open and the User settings JSON otherwise.
- While editing the JSON, IntelliSense offers `id`, `typeAndPath`, `icon`, `label`, and `parentId` for array entries as defined by the schema.
- Invoking “Project Explorer: Configure Tree Items…” reveals the `project-explorer.treeItems` setting in the Settings UI; no JSON files are opened directly.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

#### Example (settings.json)

```jsonc
{
  // Workspace or User settings
  "project-explorer.brainstormingDocPath": "docs/brainstorming.md",
  "project-explorer.treeItems": [
    {
      "id": "readme",
      "typeAndPath": "file:README.md",
      "icon": "$(book)",
      "label": "Read Me"
    },
    {
      "id": "repo",
      "typeAndPath": "url:https://github.com/ftl-tools/project-explorer",
      "label": "Repository"
    },
    {
      "id": "scripts",
      "typeAndPath": "folder:scripts",
      "parentId": "readme"
    }
  ]
}
```
