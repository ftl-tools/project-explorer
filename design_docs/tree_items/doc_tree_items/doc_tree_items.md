# Doc Tree Items

Doc tree items allow users to traverse documentation in their workspace. This doc outlines how this should work.

## Settings

Users can add zero or more doc watch paths to the [watch path settings](/design_docs/project_explorer.md#tree-item-settings). Note that the search path can be a folder or a single document.

```json
{
  "type": "docs",
  "path": "path/from/workspace/root/to/folder/or/doc.md"
}
```

<details>
<summary>Test that</summary>

- TODO...

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

## Parsing

We want a [tree item parser](/design_docs/project_explorer.md#parser) that iterates recursively through each search path defined in the [settings](#settings). We want to record every folder, markdown document, and any other resource files. Docs have an entry in the [parser output JSON file](/design_docs/project_explorer.md#parser). This object will contain entries for every search path defined in the [settings](#setting) above. It should be formatted like:

```json
{
  ... // Other Tree Item Type Sections
  "docs": {
    ... // Other doc search paths
    "<search-path>": {
      "path": "<file-or-folder-path-from-workspace-root>",
      "type": "doc",
      "title": "<title>" // Might be an empty string
      "children": [ // Might be an empty list
        ... // Child parsed objects
      ]
    },
    ... // More doc search paths
  },
  ... // More other Tree Item Type Sections
}
```

Lets break these properties down:

- `path`: The file or folder path from the workspace root.
- `type`: The type of the entry, which can be "doc", "folder", or "resource". Resources are any files in the search path that are not folders or markdown documents.
- `title`: If this entry is a document, and the document has at-least one `# Header` with a single `#`, then the first one of these should go in this property. If this can not be found or the entry is not a document, then this property should just be an empty string.
- `children`: A list of child entries, which can be nested folders, documents, or resources in this same object format.

<details>
<summary>Test that</summary>

- TODO...

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

## Tree Building

We want a [tree item builder](/design_docs/project_explorer.md#tree-builder) that analyzes the [parsed output above](#parsing) and creates a [tree item](/design_docs/tree_items/tree_items.md) for every doc, resource, and folder.

### Building tree items for folders

**_IMPORTANT: If a folder contains a document with the same base file name (file name without the extension) as the folder or a document named `README.md` (case insensitive), then instead of creating a tree item for this folder, give that document's tree item what would have been this folder's parent, and make the parent of all other children of this folder be that document's tree item._**

- `id`: The folder name with out the path.
- `typeAndPath`: The folder path with a `folder:` prefix.
- `icon`: Use vscode's folder icon.
- `label`: The folder name in [Title Case](/design_docs/utils/name_casing.md#title-case)
- `parentId`: The id of the parent item, or `null` if it is a top-level item.

<details>
<summary>Test that</summary>

- TODO...

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

### Building tree items for docs

- `id`: The document file name without the path or `.md` extension.
- `typeAndPath`: The document path with a `file:` prefix.
- `icon`: Use the [doc icon](/design_docs/tree_items/doc_tree_items/doc.light_mode.png).
- `label`: The docs title if it has one, otherwise use the file name in [Title Case](/design_docs/utils/name_casing.md#title-case) without the `.md` extension.
- `parentId`: The id of the parent item, or `null` if it is a top-level item.

<details>
<summary>Test that</summary>

- TODO...

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

### Building tree items for resources

- `id`: The resource file name without the path but with the file extension.
- `typeAndPath`: The document path with a `file:` prefix.
- `icon`: Use VSCode's default icon for this file type.
- `label`: The file name in [Title Case](/design_docs/utils/name_casing.md#title-case) without the file extension.
- `parentId`: The id of the parent item, or `null` if it is a top-level item.

<details>
<summary>Test that</summary>

- TODO...

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

## Custom Interactions

There should be an optional vscode setting called `openDocsInPreview` if this is false tapping on doc tree items should open them in the default editor, if true or not set, then tapping on doc tree items should open them using VSCode's markdown preview.

<details>
<summary>Test that</summary>

- TODO...

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>
