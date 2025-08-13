# Tree Items

Tree items are rendered in tree views.

## All Tree Items

The extension has the following tree item types/handlers:

[//]: # "{ TODO: In future, autogenerate this list }"

- **[User Defined](/design_docs/tree_items/user_defined_tree_items.md):** Users should be able to define custom items show up in the [tree view](/design_docs/project_explorer.md#rendering-tree-items). This doc outlines how this should work.
- **[Docs](/design_docs/tree_items/doc_tree_items/doc_tree_items.md):** Doc tree items allow users to traverse documentation in their workspace. This doc outlines how this should work.

## Tree Item JSON Format

They are tracked using the following format:

```json
{
  "id": "item-id",
  "typeAndPath": "itemType:item/path",
  "additionalContextMenuItems": {
    "<Menu Item Label>": "vscode.command"
  },
  "icon": "iconSource:icon/path/or/id.svg",
  "label": "Item Label",
  "parentId": "parent-item-id"
}
```

Let's break these down in detail:

- `id`: A unique identifier for the item.
  <details>
  <summary>Test that</summary>

  - IDs are unique across all items in tree_items.json; duplicates are rejected or de-duplicated deterministically with a clear warning.
  - IDs remain stable between rebuilds when inputs are unchanged, preserving expansion and selection state.
  - Changing only labels or icons does not change ids; changing path/type may change ids per generator rules.

  [How to Test](/design_docs/vscode_extensions.md#testing)

  </details><br>

- `typeAndPath`: A string that specifies both the type and path of the item separated by a `:`. We combine these two into one property because usually they should both be defined or neither of them defined. The behavior of this item will change based on the type:

  - `file:path/to/file.txt`: When tapped open the file in the editor. When no icon is specified, use the default icon for this file type. Right-clicking on file items should show a "Show in Editor's File Explorer" context menu option.
  - `folder:path/to/folder`: When tapped open the folder in the explorer. When no icon is specified, use the default icon for this file type. Right-clicking on folder items should show a "Show in Editor's File Explorer" context menu option.
  - `url:https://example.com`: When tapped open the URL in an external browser. When no icon is specified, attempt to fetch and use the site’s favicon; while loading show the VS Code globe codicon (`$(globe)`), and if favicon fetching fails, keep using the globe. Right-clicking on script items should show an "Open in Browser" context menu option.
  - `script:<command and args>`: When tapped run the command headlessly using the system shell. Script items have the VS Code run codicon (`$(run)`) by default, cannot have children, and are disabled while running. While running, append `...` to the label. Optional `cwd` and `env` fields control working directory and environment variables. If the script succeeds show a pop-up with the output, and if it fails show an error pop-up with the error message. Only one run per item may be active at a time. Right-clicking on script items should show a "Run" context menu option.
  - _Note: Some tree item types might override these default behaviors._

  <details>
  <summary>Test that</summary>

  - file: opens the file in the editor; default icon matches VS Code file icon when no custom icon is set; missing file shows error and does not create it.
  - folder: reveals the folder in the Explorer without opening an editor; default icon is the folder icon; missing folder shows warning.
  - url: opens in default external browser; shows globe while fetching favicon; if fetch fails or is slow, globe remains and UI stays responsive.
  - script: runs command headlessly; shows $(run) icon; disables item while running and appends "..." to label; shows output on success and error pop-up on failure; prevents concurrent runs per item; respects cwd and env when provided; long-running scripts can be triggered again only after completion.

  [How to Test](/design_docs/vscode_extensions.md#testing)

  </details><br>

- `additionalContextMenuItems`: Optionally specify additional context menu items for this item. This is a map of menu item labels to their corresponding VS Code commands.

  <details>
  <summary>Test that</summary>

  - TODO...

  [How to Test](/design_docs/vscode_extensions.md#testing)

  </details><br>

- `icon`: Optionally specify a custom icon for this item. This can take a few formats.

  - `local:path/to/icon.svg`: Use a local SVG located in the user's workspace.
  - `vscode:icon-id`: Use a built-in VS Code icon by its codicon ID (e.g., `vscode:globe`).
  - `projectExplorer:icon-id`: Use an icon defined in the Project Explorer extension's resources (e.g., `projectExplorer:lightbulb`).
  - `remote:https://example.com/icon.svg`: Use an icon from a remote URL.

  <details>
  <summary>Test that</summary>

  - All icon sources render: local workspace files, built-in codicons, extension resources by id, and remote SVGs.
  - When remote icon fails or returns non-SVG, item falls back to the type’s default icon without breaking rendering.
  - Light/dark theme variants are respected for extension-provided icons and update immediately on theme change.
  - Invalid icon spec (unknown scheme) is ignored with a warning and default icon is used.

  [How to Test](/design_docs/vscode_extensions.md#testing)

  </details><br>

- `label`: Optionally specify a custom label for this item. If not specified, use the last part of the path in [title case](/design_docs/utils/name_casing.md#title-case) without the file extension (e.g., `My File` for `file:custom/my-file.txt`).

  <details>
  <summary>Test that</summary>

  - When label is provided, it is displayed verbatim; when omitted, label is derived from path basename in Title Case without extension.
  - Title casing follows the documented rules (including numerics and separators) from the name casing spec.
  - Empty or whitespace-only labels are treated as missing and derived from the path.

  [How to Test](/design_docs/vscode_extensions.md#testing)

  </details><br>

- `parentId`: Optionally specify the ID of the parent item. If not specified, the item will be a top-level item in the tree. If specified, the item will be nested under the parent item with that ID.
  <details>
  <summary>Test that</summary>

  - Items with parentId appear nested under the correct parent; items without parentId appear at the root.
  - Missing or invalid parentId is handled gracefully (item becomes top-level or is skipped) without breaking the tree; a warning is logged.
  - Cycles in parent relationships are detected and broken deterministically to avoid infinite loops.

  [How to Test](/design_docs/vscode_extensions.md#testing)

  </details><br>
