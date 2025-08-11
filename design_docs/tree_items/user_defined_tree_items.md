# User-Defined Tree Items

Users should be able to define custom items show up in the [tree view](/design_docs/project_explorer.md#rendering-tree-items). This doc outlines how this should work.

## Settings

These items are defined as a list of [tree item objects](/design_docs/tree_items/tree_items.md#tree-item-json-format) in a vscode workspace setting, using the following format:

```json
{
  "userDefinedTreeItems": [
    ... // Other user-defined tree items
    {
      ... // Some tree item object
    },
    ... // More user-defined tree items
  ]
}
```

<details>
<summary>Test that</summary>

- TODO...

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

## Parsing

The parser should just read the [user-defined tree items settings](#settings) and write them to the [parser output JSON file](/design_docs/project_explorer.md#parser), using the following format:

```json
{
  ... // Other Tree Item Type Sections
  "userDefined": [
    ... // Other user-defined tree items
    {
      ... // Some user-defined tree item object
    },
    ... // More user-defined tree items
  ],
  ... // More other Tree Item Type Sections
}
```

<details>
<summary>Test that</summary>

- TODO...

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

## Tree Building

The tree builder for user-defined tree items should just read the [user-defined parser section](#parsing) from the [parser output JSON file](/design_docs/project_explorer.md#parser) and add them to the [tree view items file](/design_docs/project_explorer.md#tree-builder).

<details>
<summary>Test that</summary>

- TODO...

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>
