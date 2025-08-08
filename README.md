# Project Explorer

**Latest Build:** [Project Explorer 0.1.22](./project-explorer-0.1.22.vsix)

A Visual Studio Code extension by ftl-tools that adds a Project Explorer view to the Explorer sidebar. It lets you pin files, folders, and URLs into a custom tree, open a brainstorming document from the title bar, and quickly access the extension’s settings. This README explains what it does, how to use it, and how to configure it.

## Features

- Project Explorer view under Explorer (id: `projectExplorer`).
- User-defined tree items via settings; supports:
  - file:path → opens file in editor
  - folder:path → reveals folder in Explorer
  - url:https://... → opens in system browser (tries to show site favicon; falls back to globe; cached for 7 days)
- Title bar actions:
  - Brainstorming (visible when a brainstorming document is configured)
  - Project Explorer Settings (opens Settings UI filtered to this extension)
  - Collapse All
- Reacts to light/dark theme changes.

## Install

- Download the VSIX above.
- In VS Code: Extensions panel → … menu → Install from VSIX… → select the file.

## Use

- Open the Explorer sidebar and locate the "Project Explorer" view.
- Click items to open files, reveal folders, or launch URLs.
- Use the title bar:
  - Lightbulb icon opens your brainstorming document (when configured).
  - Gear icon opens the extension’s settings.
  - Collapse-all icon collapses all nodes in this view.

## Configuration

Settings are available in the Settings UI (search for @ext:ftl-tools.project-explorer) or in settings.json.

- project-explorer.brainstormingDocPath (string)
  - Absolute path, ~ expansion, or path relative to the first workspace folder, pointing to your brainstorming document.
- project-explorer.treeItems (array)
  - Define items shown in the Project Explorer. Each object supports:
    - id (string, required): unique across all items
    - typeAndPath (string): one of file:..., folder:..., url:https://...
    - icon (string, optional): VS Code codicon like $(rocket) or image path (.svg/.png)
    - label (string, optional): custom label (defaults to last path segment or hostname for URLs)
    - parentId (string, optional): id of parent item to create nesting

Example (Workspace settings):

```jsonc
{
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
    { "id": "scripts", "typeAndPath": "folder:scripts", "parentId": "readme" }
  ]
}
```

## Commands

- Project Explorer: Configure Tree Items… (projectExplorer.configureTreeItems)
- Project Explorer Settings (projectExplorer.openSettings)
- Brainstorming (projectExplorer.openBrainstormingDoc)
- Collapse All (projectExplorer.collapseAll)

## Requirements

- VS Code 1.74.0 or newer.

## Notes

- URL favicons for url tree items are fetched over HTTP/HTTPS and cached in global storage. Positive cache TTL: 7 days; negative results are not retried for 24 hours.
