# Add Settings Title Action for Project Explorer

This task implements a Settings action icon on the Project Explorer view that opens the extension’s settings in the Settings UI, per the updated design.

## Checklist

- [x] Add a "Settings" title action icon to the Project Explorer view. It is always visible, uses the gear codicon `$(gear)`, has tooltip "Project Explorer Settings", and opens the Settings UI filtered to this extension using `@ext:ftl-tools.project-explorer`. See: /design_docs/project_explorer.md#title-action-icons
- [x] When a workspace is open, prefer opening the Workspace Settings tab before applying the filter; when no workspace is open, open the User Settings tab and show an informational message that workspace settings are unavailable. See: /design_docs/project_explorer.md#title-action-icons
- [x] Implement a new command `projectExplorer.openSettings` that performs the above behavior. Contribute it in `package.json` with the correct title, category, and icon. See: /design_docs/project_explorer.md#title-action-icons
- [x] Contribute a `view/title` menu item so the Settings action appears on the `projectExplorer` view title at all times. See: /design_docs/project_explorer.md#title-action-icons
- [x] Ensure only the Settings UI is used; do not open JSON settings files. See: /design_docs/project_explorer.md#title-action-icons
- [x] Update activation events to include invoking the new command. See: /design_docs/project_explorer.md#title-action-icons
- [x] Validate that publisher/id in the filter `@ext:ftl-tools.project-explorer` matches the extension’s `publisher` and `name`. See: /design_docs/project_explorer.md#title-action-icons
- [x] (Docs structure) The Brainstorming action behavior remains unchanged; its test spec was re-indented as a sub-bullet with no functional change. No code change required. See: /design_docs/project_explorer.md#title-action-icons

## Notes / Implications

- Using codicon `$(gear)` requires no asset files and works with theme changes automatically.
- To bias the Settings UI to the Workspace tab, call `workbench.action.openWorkspaceSettings` before applying the filter query; then call `workbench.action.openSettings` with the filter string. When no workspace is present, call `workbench.action.openSettings` with the filter and show an information message.
- The extension already sets up the Project Explorer view and the Brainstorming action; this task should not alter that behavior.

## Implementation Log

- As you complete each checklist item, check it off here to signal progress.
