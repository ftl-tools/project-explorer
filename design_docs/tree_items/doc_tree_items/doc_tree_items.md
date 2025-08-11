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

- Adding/removing a docs watch path at runtime updates watches and triggers parsing without reload.
- Both folder and single-file paths are accepted; invalid paths are ignored with a warning and do not crash the parser.
- Relative paths resolve from the workspace root; if no workspace is open, the setting is ignored with an info message.

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

- parser_output.json contains a docs object keyed by each configured search path, each entry with path, type, title, and children.
- Markdown files: first level-1 header is captured as title; no level-1 header yields empty title; non-markdown entries have empty title.
- Non-Markdown files are typed as resource; directories are typed as folder; recursion discovers nested items.
- Parser ignores hidden/system folders like .git and node_modules by default unless explicitly included.

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

- Regular folder without special doc produces a folder item with correct id, typeAndPath, icon, label, and parentId.
- Folder containing README.md or a doc matching the folder basename suppresses the folder item and promotes that doc as the node; siblings become children of the doc.
- Case-insensitive README.md matching is honored; nested README files only affect their own folder.
- If both README.md and basename.md exist, prefer README.md as the promoted doc.

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

- id is filename without extension; typeAndPath starts with file: and points to the doc; icon uses the doc asset with theme variants.
- Label prefers first H1; if absent, Title Case of filename without extension; empty or whitespace H1 is treated as absent.
- ParentId reflects folder structure or special promotion rule from the folders section.

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

- id equals filename with extension; label is Title Case without extension; icon is VS Code default for the file’s extension.
- Non-markdown files under docs folders are included as resources and appear under their containing doc/folder per structure.
- Large binary resources do not block parsing; metadata is recorded without reading full file contents.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

## Custom Interactions

There should be an optional vscode setting called `openDocsInPreview` if this is false tapping on doc tree items should open them in the default editor, if true or not set, then tapping on doc tree items should open them using VSCode's markdown preview.

<details>
<summary>Test that</summary>

- With openDocsInPreview unset or true, clicking a doc opens Markdown Preview; with false, opens the markdown text editor.
- Toggling the setting at runtime changes the behavior for subsequent clicks without reload.
- Preview opens beside existing editor when appropriate and does not steal focus unexpectedly.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>
