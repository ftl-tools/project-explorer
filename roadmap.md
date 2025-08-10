# Project Explorer Roadmap

## Pre-Launch

- [x] Add an empty project explorer tree view
- [x] Add the brainstorming action icon (Add basic workspace config for the path of this doc. We need to react as soon as this config changes. Start the example project for testing)
- [x] Research testing vscode extensions and see if we can test if the right action icons are showing up
- [x] Add the settings action icon (See if we can show config in the visual settings)
- [x] Add config for user-defined items
- [x] Render user-defined items in the tree view
- [x] For url items, try to use the favicon as the icon, and if that fails, use the globe icon
- [x] Rename "type_plus_path" to "typeAndPath" and make it not be a required field for user-defined items
- [x] Test out configuring user-defined items in a sample workspace
- [x] Add a collapse all action icon to the tree view
- [x] Move the code to a new repo called `project-explorer` under the `ftl-tools` github org. Make it public and give it an MIT license.
- [x] Generate a README.md for the extension.
- [x] Publish the extension to the VSCode marketplace
- [x] Add the help action icon (show the extension readme in the marketplace)

## Script Type Items

- [x] Support configuring working directory and environment for script items, and add script items to the tree view.
  - The config for script type items looks like `"typeAndPath": "script:bash script --flags"`. Script items have vscode's run icon by default, cannot have children, and tapping on them runs the script headlessly. Append an `...` to the label while the script is running, and prevent it from being run again until it finishes.

## Doc Items

- [ ] Update the architecture to parse files and settings, write them to a cache json file, have a tree builder watch that file and then write a tree view json file, and then watch that tree view file and render it in the project explorer.
- [ ] Add the doc watching paths to the workspace config
- [ ] Add the docs watcher and parser, and test that it saves a json, detects changes, and re-writes the json (no vscode dependencies)
- [ ] See if we can easily add a graphic interface for watched paths
- [ ] Add the doc tree builder logic and test that it builds a tree view, detects changes, and re-builds (no vscode dependencies)
  - _Note:_ Every doc should have a unique id. This way we can add custom tree items that are children of discovered tree items. We might even be able to use this id to look up components, pages, stores, etc... in future if we have a clear way to id them.
- [ ] Render the tree view in the project explorer view and test that it renders, detects changes, and re-renders
- [ ] Test out configuring docs in a sample workspace
- [ ] Publish an update to the VSCode marketplace with the new features

## Doc Editor

- [ ] Go back through my research and remember which text editor I though would work the best. I want a clean UI, markdown shortcuts, a way to preview git diffs, and perhaps a way to add comments or any other nice features.
- [ ] Define a new extension in a new design doc that replaces the default md editor with the new doc editor.
- [ ] Add a setting to the project explorer to open docs in the default editor or preview.
