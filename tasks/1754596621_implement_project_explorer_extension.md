# Implement Project Explorer Extension

This task implements the design docs as actual VSCode extension code.

## Task Checklist

### VSCode Extension Infrastructure
- [x] Create VSCode extension project structure using TypeScript - [VSCode Extensions: Tech Stack](/design_docs/vscode_extensions.md#tech-stack)
- [x] Set up extension with team name `ftl-tools` and id `project-explorer` - [Project Explorer: Overview](/design_docs/project_explorer.md)
- [x] Configure MIT license - [Project Explorer: Overview](/design_docs/project_explorer.md)
- [x] Create build script that increments version, runs type checking/linting, bundles with esbuild, creates VSIX package - [VSCode Extensions: Build Script](/design_docs/vscode_extensions.md#build-script)
- [x] Set up build script to update README.md with latest build version - [VSCode Extensions: Build Script](/design_docs/vscode_extensions.md#build-script)
- [x] Configure build script to remove old VSIX packages - [VSCode Extensions: Build Script](/design_docs/vscode_extensions.md#build-script)

### Project Explorer Views
- [x] Add empty tree view named "Project Explorer" to file explorer panel - [Project Explorer: Project Explorer Views](/design_docs/project_explorer.md#project-explorer-views)

### Light/Dark Mode Support
- [x] Implement light and dark mode detection and icon switching - [VSCode Extensions: Reacting to Light and Dark Mode](/design_docs/vscode_extensions.md#reacting-to-light-and-dark-mode)
- [x] Set up icon naming convention (my_icon.svg, my_icon.light_mode.svg, my_icon.dark_mode.svg) - [VSCode Extensions: Reacting to Light and Dark Mode](/design_docs/vscode_extensions.md#reacting-to-light-and-dark-mode)

## Additional Implementation Requirements

### Project Structure
- [x] Create outputs/vscode_extension_code/ folder structure
- [x] Set up proper TypeScript configuration
- [x] Configure package.json with proper extension metadata
- [x] Set up extension manifest (package.json) with contributes section for tree view

### Development Setup
- [x] Install necessary dependencies (vscode, esbuild, typescript, etc.)
- [x] Configure tsconfig.json for VSCode extension development
- [x] Set up proper entry point and activation events

### Testing and Build
- [x] Run any existing tests
- [x] Execute build script to create VSIX package
- [x] Verify extension loads properly in VSCode