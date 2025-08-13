# User-Defined Tree Items

Users should be able to define custom items show up in the [tree view](/design_docs/project_explorer.md#rendering-tree-items). This doc outlines how this should work.

## Settings

These items are defined as a list of [tree item objects](/design_docs/tree_items/tree_items.md#tree-item-json-format) in a vscode workspace setting in the [VSCode settings](/design_docs/vscode_extensions.md#settings-and-settings-utility), using the following format:

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

- Adding, editing, and removing items in userDefinedTreeItems reflects in the tree without reload; order matches settings.
- Invalid item shapes are ignored with a clear warning and do not crash the extension; valid items still render.
- Settings schema validation highlights errors in the Settings UI where possible.

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

- The parser_output.json includes a userDefined array mirroring the settings order and content (for valid items).
- Changes in the settings update only the userDefined section and preserve other sections; removing an item removes it from the array.
- Malformed items are omitted with warnings; output remains valid JSON.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

## Tree Building

The tree builder for user-defined tree items should just read the [user-defined parser section](#parsing) from the [parser output JSON file](/design_docs/project_explorer.md#parser) and add them to the [tree view items file](/design_docs/project_explorer.md#tree-builder).

<details>
<summary>Test that</summary>

- All valid user-defined items are copied into tree_items.json unchanged, preserving order; invalid items are skipped with warnings.
- Parent-child relationships defined by parentId are realized correctly in the rendered tree; missing parents do not crash the builder.
- Duplicate ids across user-defined and other sources are reported and resolved per id rules without breaking the tree.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>
