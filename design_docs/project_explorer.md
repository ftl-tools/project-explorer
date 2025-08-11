# Project Explorer

The project explorer is a [VSCode extension](/design_docs/vscode_extensions.md) that helps developers navigate and manage their projects more effectively. The extension is developed by team `ftl-tools` and has id `ftl-project-explorer`. The extension is released under the MIT license, it's repository field is this repository. The code for the extension can be found in the `outputs/vscode_extension_code/` folder. This document outlines the major parts of the extension and how they work together.

<details>
<summary>Test that</summary>

- TODO...

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

- TODO...

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

### Project Explorer View Content

The project explorer will analyze files in the users workspace, assemble tree data based on it, and render this in the [project explorer view](#project-explorer-view)

#### Tree Item Settings

The user can define settings in the VSCode settings that determine what files get watched, so they can be parsed and added to the tree. Some tree items will define their own settings, but most will use the a default setting with a list of watch paths and parser types like:

```json
{
  ... // Other VSCode settings
  "projectExplorer.watchThese": [
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

- TODO...

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

- TODO...

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

[//]: # "{ TODO: In future, autogenerate this list }"

- [Building user-defined tree items](/design_docs/tree_items/user_defined_tree_items.md#tree-building)
- [Building doc tree items](/design_docs/tree_items/doc_tree_items/doc_tree_items.md#tree-building)

#### Rendering Tree Items

To create the tree content for this tree view, we watch the output file from the [tree builder](#tree-builder) and render those [tree items](/design_docs/tree_items/tree_items.md). See [tree items](/design_docs/tree_items/tree_items.md) for more details on how individual tree items are rendered in the tree view. Unless specified otherwise tree items are always rendered in the order they appear in the [tree items JSON](#tree-builder). Any changes to the tree items JSON file should immediately trigger a re-rendering of the tree view.

<details>
<summary>Test that</summary>

- TODO...

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

[//]: # "{ TODO: In future, autogenerate this list }"

- [Rendering user-defined tree items](/design_docs/tree_items/user_defined_tree_items.md)
- [Rendering doc tree items](/design_docs/tree_items/doc_tree_items/doc_tree_items.md)
