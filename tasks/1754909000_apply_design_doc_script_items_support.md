# Apply design updates: script items, cwd/env, schema, and parenting rules

- [x] Add support for `script:<command and args>` in `typeAndPath` with headless execution, default `$(run)` icon, disabled state while running, and label appending `...` during execution. See: /design_docs/project_explorer.md#user-defined-tree-items
- [x] Enforce that items cannot use a `script:` item as `parentId`; such children are treated as top-level and surface a warning. See: /design_docs/project_explorer.md#user-defined-tree-items
- [x] Implement optional `cwd` (supports absolute, `~`, and workspace-relative) and `env` (string key/value) fields for `script:` items; invalidate start and show error on invalid `cwd`. See: /design_docs/project_explorer.md#user-defined-tree-items
- [x] Update contributes.configuration schema in package.json: include `script:<command and args>` in `typeAndPath` description, and add `cwd` and `env` properties so IntelliSense offers `id`, `typeAndPath`, `icon`, `label`, `parentId`, `cwd`, and `env`. See: /design_docs/project_explorer.md#configuration-contribution-packagejson and /design_docs/project_explorer.md#editing-tree-items-in-vs-code-settings
- [x] Example in docs shows a `build-app` `script:` item; ensure behavior matches example (no code change needed beyond above). See: /design_docs/project_explorer.md#example-settingsjson

Notes:
- Organizational changes not impacting code were ignored.
