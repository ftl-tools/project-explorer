# Apply design-doc updates: extension id and title icon asset

- [x] Update extension identifier to `ftl-project-explorer` in the extension manifest so the published id is `ftl-tools.ftl-project-explorer`. This reflects the spec change noted in the Project Explorer doc. See: /design_docs/project_explorer.md#project-explorer
- [x] Ensure the "Open Brainstorming Doc" title action uses the lightbulb PNG icon (not SVG) in the extension resources, consistent with the spec update. See: /design_docs/project_explorer.md#title-action-icons

## Notes
- The design docs removed older SVG lightbulb assets and now reference a PNG. Our extension already ships PNG light/dark icons under resources/icons/, so this is a verification-only step.
- No other behavioral or API changes were introduced by the diff.
