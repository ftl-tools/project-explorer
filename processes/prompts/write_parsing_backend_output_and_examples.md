Please write the `## Output JSON Format` and `## Examples` section of the @design_docs/project_parser/parsing_flask_backend_files.md doc, use @design_docs/project_parser/parsing_root_vuex_store_files.md and @design_docs/project_parser/parsing_vue_router_files.md as reference.


The @design_docs/title_action_icons/title_action_icons.md design
docs specifies that the setting action icon should open the
settings UI. Instead I want it to open the workspace's settings
json. It should first find all settings for this extension in
the json, and, if they are spread apart, it should move them
together near the first setting for this extension. It should
then add any missing settings for this extension, giving them
their default value. It should then to open the settings json to
the first "ftl-tools.*" setting.