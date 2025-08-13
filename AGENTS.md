## IMPORTANT

- Try to keep things in one function unless composable or reusable
- DO NOT do unnecessary destructuring of variables
- DO NOT use `else` statements unless necessary
- DO NOT use `try`/`catch` if it can be avoided
- DO NOT define `class`s unless necessary
- AVOID `try`/`catch` where possible
- AVOID `else` statements
- AVOID using `any` type
- AVOID using `class` statements
- AVOID `let` statements
- PREFER single word variable names where possible
- Use as many bun apis as possible like Bun.file()

## Repo Folder Structure

This repo takes a design docs first approach to development. This means that before writing any code, you should first write a design doc that outlines the feature or change you want to make. Always refer to related docs before writing or editing code to ensure that you are following the spec.

Below you will find an overview of some of the important folders in this repository.

- `design_docs/`: Here you will find the plans and high-level design for the project and its various outputs. Reference this whenever you work on the code to make sure you are implementing things to spec.
- `outputs/`: This repository is a monorepo, the code for all related project can be found in this folder.
  - `vscode_extension_code/`: The extension code can be found here. This is the code that will be bundled and published to the VSCode marketplace.
- `processes/`: In here you'll find docs explaining how we write code, prompts that are useful when working with AI, and anything else that explains how to work on this project.
  - `tools/`: Any custom scripts or tools we write to help with this project can be found here.
- `references/`: Any external resources that we think might helpful to the project can be found in here.
- `tasks/`: This is where we track tasks being worked on, or that we plan to work on. If you are working on a task outlined in this folder, please check things off as you go along, and add any helpful notes to the task file as you work on it. Task files are named like `<milliseconds_since_epoch>_<task_name>.md`.

## Design Docs Overview

Below is an overview of the design docs for this project. Please refer to these docs when writing code or planning features. If you're spec-ing out a new feature, please put it in the appropriate doc or create a new doc if one doesn't exist, also please check any docs that might reference or need to reference your new feature, and update those docs as well.

**[Project Explorer](/design_docs/project_explorer.md)**: The project explorer is a [VSCode extension](/design_docs/vscode_extensions.md) that helps developers navigate and manage their projects more effectively. The extension is developed by team `ftl-tools` and has id `ftl-project-explorer`. The extension is released under the MIT license. For now we'll leave the repository blank. The code for the extension can be found in the `outputs/vscode_extension_code/` folder. This document outlines the major parts of the extension and how they work together.

- **[VSCode Extensions](/design_docs/vscode_extensions.md)**: VSCode extensions add extra functionality to the Visual Studio Code editor. This document provides what we think are a good set of defaults and patterns to follow when building VSCode extensions.
- **[lightbulb.dark_mode.png](/design_docs/lightbulb.dark_mode.png)**
- **[lightbulb.light_mode.png](/design_docs/lightbulb.light_mode.png)**
