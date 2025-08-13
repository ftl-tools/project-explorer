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

<details>
<summary>Test that</summary>

- Build script bumps version, runs type check/lint, bundles, and outputs a single VSIX in repo root; old VSIX files are removed.
- README latest build link updates to the new version and file name.
- Build fails early with a clear error if type check/lint fails; no VSIX is produced.

[How to Test](#testing)

</details><br>

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

### Settings and Settings Utility

Create a small settings utility to read, write, watch, and format VS Code settings for the extension. This centralizes all settings behavior so commands and views do not duplicate logic.

- Provide helpers to get and update settings at the correct scope (workspace when available, otherwise user).
- Provide a watch function that lets callers subscribe to changes for specific keys and receive current value immediately.
- Provide a format function that organizes all keys that start with `ftl-tools.` and injects defaults when missing (see below).

Recommended API shape (conceptual, not prescriptive to implementation details):

- get<T>(key: string, scope?: 'workspace' | 'user'): T | undefined
- update<T>(key: string, value: T, scope?: 'workspace' | 'user'): Promise<void>
- watch<T>(keys: string[] | RegExp, handler: (k: string, v: T) => void, scope?: 'workspace' | 'user'): Disposable
- format(options?): Promise<{ openedUri: Uri, firstKey: string | null }>

Formatting behavior for ftl-tools.* settings:
- Operate on the JSON settings file (workspace settings.json when a workspace exists; otherwise the user settings.json).
- Find all existing keys beginning with `ftl-tools.` (including `ftl-tools.project-explorer.*`). If keys are scattered, group them contiguously near the first existing `ftl-tools.*` key encountered, preserving user values and retaining adjacent comments when possible.
- Add any known missing settings for this extension with their default values. Do not overwrite existing user values.
- If the settings file does not exist, create it as an object and inject the default `ftl-tools.*` keys.
- Return information so callers can reveal the first `ftl-tools.*` key in the editor.

Notes:
- This utility should encapsulate VS Code APIs like workspace.getConfiguration, workspace.onDidChangeConfiguration, workspace.getConfiguration().update, and reading/writing the settings.json file via the text document APIs when formatting.
- Consumers (actions, views, parsers) should depend on this utility instead of accessing VS Code configuration directly.

<details>
<summary>Test that</summary>

- Calling watch with a key immediately invokes handler with the current value and again on subsequent changes; disposing the return stops updates.
- get/update read and write to workspace scope when a workspace is open; fallback to user scope when none is open.
- format creates settings.json if missing, groups all `ftl-tools.*` keys together, and adds missing defaults without changing existing values.
- format returns the first grouped key and a URI suitable for opening in an editor where the selection can be revealed.

[How to Test](#testing)

</details><br>

### Reacting to Light and Dark Mode

Some icons work in both light and dark modes, and some need to be different for each mode. When writing an extension always have it watch for light vs dark mode and refresh icons right away. Generally it is best to name icons that work in both modes `my_icon.svg` and icons that only work in one mode `my_icon.light_mode.svg` or `my_icon.dark_mode.svg`. When adding icons specified in the design docs to the actual extension code, the design docs might only reference the light icon or the dark icon, but always check the file extension and see if this icon has a copy for each mode. If it does, copy both versions of the icon to the extension, and have them react to light and dark mode changes immediately.
