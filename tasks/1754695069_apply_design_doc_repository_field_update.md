# Apply design doc changes: repository field for VSCode extension

## Summary
- This task applies the design update in design_docs/project_explorer.md indicating that the extension's repository field is this repository.

## Checklist
- [x] Add repository field to outputs/vscode_extension_code/package.json pointing to this repository.
  - Link: /design_docs/project_explorer.md#project-explorer

## Notes
- The diff indicates only a single behavioral/spec change; other changes are organizational and have no code impact.
- Expected repository URL (from `git remote -v`): https://github.com/ftl-tools/project-explorer.git
