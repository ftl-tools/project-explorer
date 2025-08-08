# Apply design changes: Tree Items and Settings namespace

This task applies the latest design updates in /design_docs/project_explorer.md to the VS Code extension implementation.

## Checklist of spec-impacting changes

- Add Project Explorer tree items driven by a workspace setting [project-explorer.treeItems](/design_docs/project_explorer.md#user-defined-tree-items). Items must update immediately on setting changes and preserve expand/collapse state of unaffected branches.
- Validate `treeItems` entries and ignore invalid ones with surfaced warnings [User-Defined Tree Items tests](/design_docs/project_explorer.md#user-defined-tree-items). Non-array or non-object entries are ignored; duplicates by `id` warn and only first occurrence renders.
- Implement item behaviors for `typeAndPath` [typeAndPath behavior](/design_docs/project_explorer.md#user-defined-tree-items):
  - `file:path` opens file in editor; default file icon when `icon` omitted; support absolute, `~`, and workspace-relative paths; invalid paths show error.
  - `folder:path` reveals folder in VS Code Explorer; default folder icon when `icon` omitted; same path resolution; invalid paths show error.
  - `url:https://...` opens in system browser; default globe icon when `icon` omitted.
- Support optional `icon`, `label`, and `parentId` for items [User-Defined Tree Items](/design_docs/project_explorer.md#user-defined-tree-items):
  - `icon` accepts codicon like `$(rocket)` or image path (absolute, `~`, workspace-relative). Invalid icon falls back to default and warns.
  - `label` defaults to last path segment (files/folders) or URL last segment/hostname for URLs.
  - `parentId` nests items; unresolved parents become top-level with warning; cycles detected and flattened to top-level with warning; removing a parent promotes children to top-level.
- Expose settings in package.json with the new namespace and schema [Configuration contribution](/design_docs/project_explorer.md#configuration-contribution-packagejson): add `project-explorer.treeItems` (array schema) and change `brainstormingDocPath` to `project-explorer.brainstormingDocPath`. Use `scope: resource` for both.
- Update implementation to read settings from the `project-explorer` section and react to `workspace.onDidChangeConfiguration` for both `treeItems` and `brainstormingDocPath` [Implementation notes](/design_docs/project_explorer.md#implementation-notes).
- Add a command "Project Explorer: Configure Tree Items…" that opens Settings UI focused on `project-explorer.treeItems` [Implementation notes](/design_docs/project_explorer.md#implementation-notes). Do not open JSON directly.
- Title action icon for "Open Brainstorming Doc" should use custom light/dark icons instead of a codicon [Title Action Icons](/design_docs/project_explorer.md#title-action-icons). Continue to show/hide based on `brainstormingDocPath` and open the configured document; reflect setting changes immediately.
- Note: The previous requirement that the view render no items has been removed; the tree now reflects user-defined items [Project Explorer Views](/design_docs/project_explorer.md#project-explorer-views).

## Implementation Plan

- Update package.json contributes.configuration, commands, menus, and activation events.
- Implement tree item provider to read, validate, and render `project-explorer.treeItems` with stable node ids to preserve expand state.
- Wire configuration change listeners to refresh tree and update brainstorming action context.
- Add resources for light/dark brainstorming icons and reference them from the command used in the title menu.
- Add the "Configure Tree Items…" command.

## Progress

- [x] Add configuration keys and schema in package.json
- [x] Switch code to `project-explorer` settings section and update listeners
- [x] Implement tree items rendering, behavior, and validation
- [x] Add themed icons for brainstorming action and reference them
- [x] Add "Configure Tree Items…" command
- [x] Build extension
- [x] Commit with doc-apply flag
