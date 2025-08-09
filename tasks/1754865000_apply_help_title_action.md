# Apply Design Doc Changes: Help Title Action

## Checklist

- [ ] Add a new Help title action as the first action in the Project Explorer view title bar. See: design_docs/project_explorer.md#title-action-icons
  - [x] Contribute a command `projectExplorer.openHelp` with:
    - [x] Icon: resources/icons/help.light_mode.png (light), resources/icons/help.dark_mode.png (dark)
    - [x] Title: "Help"
    - [x] Category: "Project Explorer"
  - [x] Add a `view/title` menu entry for `projectExplorer.openHelp` with `when: view == projectExplorer` and group `navigation@05` so it appears first. Tooltip should be "Help".
  - [x] Implement command behavior to open this extension’s overview/details page in the Extensions view, falling back to a filtered search if direct navigation is not supported. Determine the extension identifier from publisher.name (i.e., `publisher.name`) or via `context.extension.id`.
- [x] Ensure action order is: Help, Brainstorming (conditional), Settings, Collapse All. See: design_docs/project_explorer.md#title-action-icons
- [x] Include the new SVG icons in the extension under `resources/icons/`.
- [x] Build the extension and verify:
  - [x] The Help icon appears first with tooltip "Help".
  - [x] Clicking Help opens the extension overview (README) in the Extensions view.

## Notes

- Per spec: If direct navigation to the details page is unavailable, open the Extensions view with a search filtered to `@id:<publisher>.<name>` to show the details page.
- Use `vscode.env.openExternal(vscode.Uri.parse('vscode:extension/<publisher>.<name>'))` when possible. Fallback to `workbench.extensions.search` with `@id:<publisher>.<name>`.

