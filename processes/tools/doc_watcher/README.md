# Doc Watcher

We'll use the doc watcher script to maintain an index of the documentation files in the repository so both humans and AIs can see at a glance where everything is and know where to find or put documentation. This index will contain a bulleted list of all the documentation files in the repository along with a brief description of each file.

The watcher script will be written in typescript and will be located in the `.meta/doc_watcher/` directory. It is meant to be started in the terminal and will run continuously in the background.

## Watching for Changes

The doc watcher script will find all files in the `design_docs/` directory and its subdirectories. If a file is added or removed, or if the title or first paragraph of a doc changes, the script should update the index content accordingly.

## Creating the Index

The index will start with an paragraph that introduces the design docs and gives some suggestions about how to use them. Refer to the [example index](#index-example) below for the exact text to use.

Following that we will have a paragraph for the root design doc, which is `design_docs/project_explorer.md`. This paragraph should be formatted like `**[Doc Title](/design_docs/path/from/root/to/doc.md)**: First paragraph of the doc.`. This paragraph will be very similar to [doc bullet points](#doc-bullets) below, but will not have the bullet dash(`-`) and will sit above the bulleted list of docs.

### Creating the Bulleted List

Right below the intro paragraphs we will have a bulleted list of the docs in the design_docs directory. This list should follow these guidelines...

#### Doc Bullets

Each doc bullet will be formatted like `- **[Doc Title](/design_docs/path/from/root/to/doc.md)**: First paragraph of the doc.`

- The doc title should be the document header at the top of the doc like `# Doc Title`. Skip any leading whitespace. A doc might not have a title, in this case use the filename as the title.
- The link should be relative to the root of the repository, so it should start with `/design_docs/`.
- The first paragraph of the doc should be the first paragraph after the title. If there is no text after the title, omit the `: First paragraph of the doc.` part.
- A doc bullet will only have children if the doc has the same name as its parent directory. In this case the doc bullet will be used in place of the parent directory bullet, and the directory children will be the children of the doc bullet.

#### Directory Bullets

**_Important: If a directory contains a doc with the same name as the directory, then instead of a directory entry we should use a doc entry, and have the children of the directory be children of that doc entry._**

If the bullet is for a directory, then it should be formatted like `- **[directory_name/](/design_docs/path/from/root/to/directory/)**`

- The directory name should be the name of the directory, with a trailing slash.
- The link should be relative to the root of the repository, so it should start with `/design_docs/`.
- The directory bullet should not have a description.
- Directory bullets should only be used for directories that contain documentation files. If a directory does not contain any documentation files, it should not be included in the index.
- All docs and directories within the directory should be listed as children of the directory bullet.

#### Misc File Bullets

If a file is not a directory or a doc, it should be formatted like `- **[file_name.ext](/design_docs/path/from/root/to/file.ext)**`

- The file name should be the name of the file, including the extension.
- The link should be relative to the root of the repository, so it should start with `/design_docs/`.
- The file bullet should not have a description.

### Index Example

The following file system...

```
design_docs/
├── project_explorer.md
├── utils.md
├── project_parser/
│   ├── project_parser.md
│   └── parsing_json_files/
│       └── parsing_json_files.md
└── tree_view_renderer/
    └── endpoint_tree_item/
        ├── endpoint_tree_item.md
        ├── endpoint_utils.md
        └── endpoint.png
```

...should produce the following index content:

```
Below is an overview of the design docs for this project. Please refer to these docs when writing code or planning features. If you're spec-ing out a new feature, please put it in the appropriate doc or create a new doc if one doesn't exist, also please check any docs that might reference or need to reference your new feature, and update those docs as well.

**[Project Explorer](/design_docs/project_explorer.md)**: First paragraph of project_explorer.md

- **[Utils](/design_docs/utils.md)**: First paragraph of utils.md
- **[Project Parser](/design_docs/project_parser/project_parser.md)**: First paragraph of project_parser.md
  - **[Parsing JSON Files](/design_docs/project_parser/parsing_json_files/parsing_json_files.md)**: First paragraph of parsing_json_files.md
- **[tree_view_renderer/](/design_docs/tree_view_renderer/)**
  - **[Endpoint Tree Item](/design_docs/tree_view_renderer/endpoint_tree_item/endpoint_tree_item.md)**: First paragraph of endpoint_tree_item.md
    - **[Endpoint Utils](/design_docs/tree_view_renderer/endpoint_tree_item/endpoint_utils.md)**: First paragraph of endpoint_utils.md
    - **[endpoint.png](/design_docs/tree_view_renderer/endpoint_tree_item/endpoint.png)**
```

## Emitting the Doc Index

The contents of the index should be written to the bottom of the `/AGENTS.md` file at the bottom in the `## Design Docs Overview` section. The contents of this section should be replaced with the new index contents each time the doc watcher script runs.

## Future Plans

- Auto-populate anywhere with a comment tag like - [//]: # 'The following list is auto-generated from `docs in "/design_docs/project_parser/" non-recursive`. Do not edit this list manually.'
