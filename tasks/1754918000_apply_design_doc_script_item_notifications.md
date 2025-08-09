# Apply design updates: script item notifications and run behavior

- [x] Show an information pop-up with process output when a script item succeeds (exit code 0). See: design_docs/project_explorer.md#user-defined-tree-items
- [x] Show an error pop-up with the error message or standard error when a script item fails (non-zero exit or spawn error). See: design_docs/project_explorer.md#user-defined-tree-items
- [x] Enforce only one active run per script item at a time; clicking while running must not start another run or open additional pop-ups. See: design_docs/project_explorer.md#user-defined-tree-items
- [x] Allow different script items to run concurrently, each with its own disabled state and ... suffix, and each showing its own completion notification. See: design_docs/project_explorer.md#user-defined-tree-items
- [x] After completion, clicking a script item starts a new run and shows a new completion notification. See: design_docs/project_explorer.md#user-defined-tree-items

## Notes
- Organizational changes in the doc were not detected; the functional change is the addition of completion notifications for script items and clarifications about concurrent behavior.
