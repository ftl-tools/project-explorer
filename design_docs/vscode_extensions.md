# VSCode Extensions

VSCode extensions add extra functionality to the Visual Studio Code editor. This document provides what we think are a good set of defaults and patterns to follow when building VSCode extensions.

You'll need to pick a team name and and a unique identifier for your extension. Usually these names are in kebab-case.

## Infrastructure

### Tech Stack

When setting up a VSCode extensions project, use `yo code` to scaffold the initial project, with TypeScript as the preferred language.

### Build Script

Automate builds using a script that does the following steps:

1. Increment the version number in `package.json`.
2. Run type checking and linting.
3. Bundle the extension using esbuild.
4. If the bundling is successful, create a production-ready VSIX package in the repository's root directory.
5. Updates [README.md](/README.md) with the latest build version like `**Latest Build:** [Project Explorer x.x.x](logical-project-explorer-x.x.x.vsix)`.
6. Removes any old VSIX packages.

### Testing

#### UI Tests

Tech

- vscode-extension-tester (ExTester) + selenium-webdriver + Mocha
- ExTester Runner (VS Code extension) for running/debugging UI tests

Setup

1. Dev deps: npm i -D vscode-extension-tester selenium-webdriver mocha @types/mocha ts-node
2. Layout:
   - tests/ui/suite/\*.test.ts
   - tests/ui/workspace/ (sample workspace/files used by tests)
3. Compile tests to JS (out/test/ui) or use ts-node.
4. Scripts (examples):
   - "test:ui": "extest setup-and-run --workspace tests/ui/workspace --tests out/test/ui --disable-extensions"
   - "test:ui:headed": "extest setup-and-run --workspace tests/ui/workspace --tests out/test/ui --disable-extensions --headless=false"
5. Stability: pin a VS Code version if needed and avoid loading other extensions.

Adding tests

- Write Mocha specs in tests/ui/suite using ExTester page objects (SideBarView, ViewTitlePart, EditorView, Notification, SettingsEditor).
- Prefer explicit waits for UI state over sleeps. Keep tests small and deterministic.

Running

- Build tests, then run npm run test:ui (or the headed variant for debugging).
- You can also use the ExTester Runner extension to run/debug UI tests from VS Code.

## VSCode

### Reacting to Light and Dark Mode

Some icons work in both light and dark modes, and some need to be different for each mode. When writing an extension always have it watch for light vs dark mode and refresh icons right away. Generally it is best to name icons that work in both modes `my_icon.svg` and icons that only work in one mode `my_icon.light_mode.svg` or `my_icon.dark_mode.svg`. When adding icons specified in the design docs to the actual extension code, the design docs might only reference the light icon or the dark icon, but always check the file extension and see if this icon has a copy for each mode. If it does, copy both versions of the icon to the extension, and have them react to light and dark mode changes immediately.
