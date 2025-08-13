# Project Explorer

The project explorer is a [VSCode extension](/design_docs/vscode_extensions.md) that helps developers navigate and manage their projects more effectively. The extension is developed by team `ftl-tools` and has id `ftl-project-explorer`. The extension is released under the MIT license, it's repository field is this repository. The code for the extension can be found in the `outputs/vscode_extension_code/` folder. This document outlines the major parts of the extension and how they work together.

<details>
<summary>Test that</summary>

- The extension identifier is ftl-tools.project-explorer and the view appears in the Explorer panel titled "Project Explorer" on activation.
- The extension README opens from the marketplace entry; repository points to this repo; license is MIT.
- Enabling/disabling the extension shows/hides the view without errors; no orphaned commands or views remain.
- Activation creates the .vscode/project_explorer folder if missing without prompting; deactivation disposes file watchers.
- Switching color theme does not break icons or view rendering.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

## Project Explorer View

We want to add a tree view named "Project Explorer" to the file explorer panel in VSCode.

### Project Explorer View Action Icons

The [project explorer view](#project-explorer-view) will have a few title action icons.

[//]: # "{ TODO: In future, autogenerate this list }"

- [Help Action Icon](/design_docs/title_action_icons/title_action_icons.md#help)
- [Open Brainstorming Doc Action Icon](/design_docs/title_action_icons/title_action_icons.md#open-brainstorming-doc)
- [Settings Action Icon](/design_docs/title_action_icons/title_action_icons.md#settings)
- [Collapse All Action Icon](/design_docs/title_action_icons/title_action_icons.md#collapse-all)

<details>
<summary>Test that</summary>

- The four title actions render in this order: Help, Brainstorming (only when configured), Settings, Collapse All.
- Tooltips match: "Help", "Brainstorming", "Project Explorer Settings", "Collapse All".
- Toggling brainstormingDocPath at runtime adds/removes the Brainstorming action without reload; other actions persist.
- Actions use correct icons in light/dark themes and update on theme change without reload.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

### Project Explorer View Content

The project explorer will analyze files in the users workspace, assemble tree data based on it, and render this in the [project explorer view](#project-explorer-view)

#### Tree Item Settings

The user can define settings in the [VSCode settings](/design_docs/vscode_extensions.md#settings-and-settings-utility) that determine what files get watched, so they can be parsed and added to the tree. Some tree items will define their own settings, but most will use the a default setting with a list of watch paths and parser types like:

```json
{
  ... // Other VSCode settings
  "project-explorer.watchThese": [
    ... // Watch Paths
    {
      "type": "parserType",
      "path": "path/to/give/to/the/specified/parser"
    },
    ... // More Watch Paths
  ],
  ... // More other VSCode settings
}
```

#### Parser

The parser watches the settings associated with all [tree items](/design_docs/tree_items/tree_items.md), watches all files and folders specified by these settings, parses them, combines the result in to a json file, and saves it to an output JSON file at `.vscode/project_explorer/parser_output.json`. This file should have an entry for each type of tree item. Individual tree item types will specify how they populate their sections. The json should look something like this:

```json
{
  ... // Other Tree Item Type Sections
  "typeXs": {
    ... // Content defined by this Tree Item Type
  }
  "typeYs": {
    ... // Content defined by this Tree Item Type
  }
  ... // Other Tree Item Type Sections
}
```

Changes to the settings or to any watched files or folders should immediately trigger a re-parsing of the affected files and an update to the output JSON.

<details>
<summary>Test that</summary>

- The file .vscode/project_explorer/parser_output.json is created on activation and contains top-level sections per tree item type.
- Editing a watched file or adding/removing files updates only the affected section while preserving other sections; unchanged sections keep their content and order.
- Changing watch settings at runtime updates watches and causes a re-parse reflecting new/removed paths; removing a watch path prunes only that section.
- Output shape matches each item type spec and remains valid JSON under rapid edits; partial writes never leave corrupt JSON (last valid is preserved if needed).
- File permission errors or missing paths are logged with non-blocking warnings; parser continues processing remaining paths.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

[//]: # "{ TODO: In future, autogenerate this list }"

- [Parsing user-defined tree items](/design_docs/tree_items/user_defined_tree_items.md#parsing)
- [Parsing doc tree items](/design_docs/tree_items/doc_tree_items/doc_tree_items.md#parsing)

#### Tree Builder

The tree builder watches the output file from the [parser](#parser), builds a tree items JSON file using [the builder logic from each tree item type](/design_docs/tree_items/tree_items.md), and saves it to `.vscode/project_explorer/tree_items.json`. This JSON should contain a list of tree item JSON objects using the [tree item format](/design_docs/tree_items/tree_items.md). This JSON should look something like this:

```json
[
  ... // Previous tree Items
  {
    ... // Some tree item
  },
  {
    ... // Some other tree item
  },
  ... // More tree items
]
```

Changes to the parser's output json file should be detected immediately, and trigger a re-building of the tree items json.

<details>
<summary>Test that</summary>

- The file .vscode/project_explorer/tree_items.json is generated from parser_output.json and is a flat array of tree item objects.
- Updating only one section in parser_output.json yields minimal corresponding updates in tree_items.json (no unrelated churn or reordering).
- Invalid or missing sections fail gracefully: builder logs an error and keeps the last valid tree_items.json.
- On malformed parser_output.json, builder waits for a valid file rather than emitting corrupt output.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

[//]: # "{ TODO: In future, autogenerate this list }"

- [Building user-defined tree items](/design_docs/tree_items/user_defined_tree_items.md#tree-building)
- [Building doc tree items](/design_docs/tree_items/doc_tree_items/doc_tree_items.md#tree-building)

#### Rendering Tree Items

To create the tree content for this tree view, we watch the output file from the [tree builder](#tree-builder) and render those [tree items](/design_docs/tree_items/tree_items.md). See [tree items](/design_docs/tree_items/tree_items.md) for more details on how individual tree items are rendered in the tree view. Unless specified otherwise tree items are always rendered in the order they appear in the [tree items JSON](#tree-builder). Any changes to the tree items JSON file should immediately trigger a re-rendering of the tree view.

<details>
<summary>Test that</summary>

- Items render in the same order as in tree_items.json and update live when the file changes; expansion/selection state is preserved for unchanged ids.
- Adding/removing items in tree_items.json appears/disappears without reload; unrelated nodes keep their expansion state.
- Clicking different typeAndPath items routes to the expected default behaviors defined in the tree items spec.
- Icons react to theme changes immediately; broken icon paths fall back per spec without breaking rendering.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

[//]: # "{ TODO: In future, autogenerate this list }"

- [Rendering user-defined tree items](/design_docs/tree_items/user_defined_tree_items.md)
- [Rendering doc tree items](/design_docs/tree_items/doc_tree_items/doc_tree_items.md)
