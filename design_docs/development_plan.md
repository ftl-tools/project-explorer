# Development Plan

- [ ] **Parser and parser_output.json:** Implement a file-watching parser that reads the extension settings, parses configured watch paths for all tree item types, and atomically writes a structured `.vscode/project_explorer/parser_output.json`, with unit tests covering parsing, incremental updates, error handling, and atomic-write behavior.

- [ ] **Tree builder and tree_items.json:** Implement the builder that watches `parser_output.json`, produces a stable, minimally-changing `.vscode/project_explorer/tree_items.json` array of tree item objects (stable ids, parent relationships, graceful failure on malformed input), and include unit tests validating minimal churn and id stability.

- [ ] **Project Explorer view and title actions:** Add the "Project Explorer" tree view in the Explorer panel with the Help, Brainstorming (runtime-reactive), Settings, and Collapse All actions; ensure icons react to light/dark mode and add ExTester UI tests verifying action visibility, tooltips, and behavior.

- [ ] **Doc and user-defined tree item handlers:** Implement docs and user-defined item parsing/building rules (markdown title extraction, README/basename promotion, resources, userDefined settings passthrough) and test cases for promotion rules, preview vs editor open setting, and resource/icon fallbacks.

- [ ] **Script/url/file/folder behaviors and context menus:** Implement default behaviors for typeAndPath variants (file, folder, url with favicon fallback, script with single-run semantics, icons, and additional context menu items), with unit and UI tests for execution, error reporting, and correct context menu entries.

- [ ] **Testing, build, and CI integration:** Add test scripts (unit + UI), a build script that runs typecheck/lint, bundles, produces a VSIX, and updates README per the spec, and wire tests and build into CI so all changes are validated automatically.
