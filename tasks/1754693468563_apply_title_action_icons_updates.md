# Apply design updates: Title Action Icons

This task implements the design changes introduced in the Title Action Icons section of the Project Explorer design doc.

## Checklist of spec changes to implement

- [x] Add a "Collapse All" title action to the Project Explorer view that invokes the built-in command `workbench.actions.treeView.projectExplorer.collapseAll`. It should display the collapse-all icon and have tooltip "Collapse All"; keep focus in the view and perform no-ops when already collapsed. See: /design_docs/project_explorer.md#title-action-icons
- [x] Ensure title action icon order in the Project Explorer view title bar is: Brainstorming, Settings, Collapse All. See: /design_docs/project_explorer.md#title-action-icons
- [x] Brainstorming title action: verify it is visible only when `project-explorer.brainstormingDocPath` is non-empty, reacts immediately to setting changes, opens absolute, `~`, or workspace-relative paths, and surfaces an error for invalid paths. Also ensure the icon uses theme-specific light/dark assets. See: /design_docs/project_explorer.md#title-action-icons
- [x] Settings title action: verify it always shows, uses the gear codicon, opens Settings UI filtered by `@ext:ftl-tools.project-explorer`; when a workspace is open, open Workspace settings, otherwise show info and open User settings. See: /design_docs/project_explorer.md#title-action-icons

## Notes
- Organizational text changes in the design doc were ignored for this task as they do not affect behavior.
