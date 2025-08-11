# Apply design doc updates: actions, parser/builder, docs items

## Checklist

- [ ] Project Explorer view: ensure view id/title and activation behaviors match updated spec. See /design_docs/project_explorer.md#project-explorer-view
- [ ] Title actions wired and ordered: Help, Brainstorming (conditional), Settings, Collapse All with correct tooltips/icons and theme reaction. See /design_docs/project_explorer.md#project-explorer-view-action-icons and /design_docs/title_action_icons/title_action_icons.md
- [ ] Settings: introduce projectExplorer.watchThese for parser watch paths/types. React to runtime changes. See /design_docs/project_explorer.md#tree-item-settings
- [ ] Parser: watch settings + files; emit .vscode/project_explorer/parser_output.json with per-type sections; incremental updates; robust writes. See design_docs/project_explorer.md#parser
- [ ] Builder: read parser_output.json; write .vscode/project_explorer/tree_items.json flat array; minimal churn; handle malformed input gracefully. See design_docs/project_explorer.md#tree-builder
- [ ] Rendering: watch tree_items.json and render in order; preserve expansion/selection; default behaviors per tree_items spec. See design_docs/project_explorer.md#rendering-tree-items and design_docs/tree_items/tree_items.md
- [ ] User-defined items: settings schema userDefinedTreeItems -> parser userDefined -> builder passthrough. See design_docs/tree_items/user_defined_tree_items.md
- [ ] Docs items parsing: recurse folders/files; classify doc/folder/resource; capture first H1 title; ignore .git/node_modules. See design_docs/tree_items/doc_tree_items/doc_tree_items.md#parsing
- [ ] Docs items building: promotion rule for folders with README.md or basename.md; id/label/icon rules. See design_docs/tree_items/doc_tree_items/doc_tree_items.md#tree-building
- [ ] Docs interaction: setting openDocsInPreview toggles preview vs editor for doc items. See design_docs/tree_items/doc_tree_items/doc_tree_items.md#custom-interactions
- [ ] Title action assets: use moved icons from design_docs/title_action_icons/*.png and extension resources wired. See design_docs/title_action_icons/title_action_icons.md
- [ ] Build script expectations in vscode_extensions.md are satisfied by outputs/vscode_extension_code/build.js behavior. See design_docs/vscode_extensions.md#automate-builds

## Progress

- [x] Created task plan with checklist linked to spec sections.

## Notes

- Pure organizational changes: image files moved under design_docs/title_action_icons/; split of title-action details into dedicated doc; introduction of consolidated tree_items docs. These don’t change behavior beyond asset paths.
