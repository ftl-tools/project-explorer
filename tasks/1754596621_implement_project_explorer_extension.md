# Implement Project Explorer Extension

This task implements the design docs as actual VSCode extension code.

## Task Checklist

### VSCode Extension Infrastructure
- [x] Create VSCode extension project structure using TypeScript. Related docs: [VSCode Extensions - Tech Stack](design_docs/vscode_extensions.md#tech-stack)
- [x] Set up extension with team name `ftl-tools` and id `project-explorer`. Related docs: [Project Explorer - Project Explorer](design_docs/project_explorer.md#project-explorer)
- [x] Configure MIT license. Related docs: [Project Explorer - Project Explorer](design_docs/project_explorer.md#project-explorer)
- [x] Create build script that increments version, runs type checking/linting, bundles with esbuild, creates VSIX package. Related docs: [VSCode Extensions - Build Script](design_docs/vscode_extensions.md#build-script)
- [x] Set up build script to update README.md with latest build version. Related docs: [VSCode Extensions - Build Script](design_docs/vscode_extensions.md#build-script)
- [x] Configure build script to remove old VSIX packages. Related docs: [VSCode Extensions - Build Script](design_docs/vscode_extensions.md#build-script)

### Project Explorer Views
- [x] Add empty tree view named "Project Explorer" to file explorer panel. Related docs: [Project Explorer - Project Explorer View](design_docs/project_explorer.md#project-explorer-view)

### Light/Dark Mode Support
- [x] Implement light and dark mode detection and icon switching. Related docs: [VSCode Extensions - Reacting to Light and Dark Mode](design_docs/vscode_extensions.md#reacting-to-light-and-dark-mode)
- [x] Set up icon naming convention (my_icon.svg, my_icon.light_mode.svg, my_icon.dark_mode.svg). Related docs: [VSCode Extensions - Reacting to Light and Dark Mode](design_docs/vscode_extensions.md#reacting-to-light-and-dark-mode)

## Additional Implementation Requirements

### Project Structure
- [x] Create outputs/vscode_extension_code/ folder structure. Related docs: [Project Explorer - Project Explorer](design_docs/project_explorer.md#project-explorer)
- [x] Set up proper TypeScript configuration. Related docs: [VSCode Extensions - Tech Stack](design_docs/vscode_extensions.md#tech-stack)
- [x] Configure package.json with proper extension metadata. Related docs: [Project Explorer - Project Explorer](design_docs/project_explorer.md#project-explorer)
- [x] Set up extension manifest (package.json) with contributes section for tree view. Related docs: [Project Explorer - Project Explorer View](design_docs/project_explorer.md#project-explorer-view)

### Development Setup
- [x] Install necessary dependencies (vscode, esbuild, typescript, etc.). Related docs: [VSCode Extensions - Tech Stack](design_docs/vscode_extensions.md#tech-stack)
- [x] Configure tsconfig.json for VSCode extension development. Related docs: [VSCode Extensions - Tech Stack](design_docs/vscode_extensions.md#tech-stack)
- [x] Set up proper entry point and activation events. Related docs: [Project Explorer - Project Explorer](design_docs/project_explorer.md#project-explorer)

### Testing and Build
- [x] Run any existing tests. Related docs: [VSCode Extensions - Testing](design_docs/vscode_extensions.md#testing)
- [x] Execute build script to create VSIX package. Related docs: [VSCode Extensions - Build Script](design_docs/vscode_extensions.md#build-script)
- [x] Verify extension loads properly in VSCode. Related docs: [Project Explorer - Project Explorer View](design_docs/project_explorer.md#project-explorer-view)