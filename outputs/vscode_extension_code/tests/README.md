# Project Explorer Extension Tests

This directory contains UI tests for the Project Explorer VSCode extension using the vscode-extension-tester framework.

## Test Structure

- `tests/ui/suite/` - Test files (*.test.ts)
- `tests/ui/workspace/` - Sample workspace files used by tests

## Test Categories

### Extension Tests (`extension.test.ts`)
Tests basic extension functionality:
- Extension activation with correct identifier (ftl-tools.project-explorer)
- Project Explorer view appears in Explorer panel
- .vscode/project_explorer folder creation
- Extension enable/disable behavior
- Color theme change handling

### Title Action Tests (`title-actions.test.ts`)
Tests the title action icons:
- Four actions render in correct order: Help, Brainstorming, Settings, Collapse All
- Correct tooltips for each action
- Brainstorming action shows/hides based on brainstormingDocPath setting
- Icons update correctly on theme changes
- Action functionality (clicking behaviors)

### Parser Tests (`parser.test.ts`)
Tests the file parsing system:
- parser_output.json creation and structure
- File watching and incremental updates
- Settings changes triggering re-parsing
- Error handling for missing/invalid files
- JSON validity under rapid changes

### Tree Builder Tests (`tree-builder.test.ts`)
Tests the tree building system:
- tree_items.json generation from parser_output.json
- Minimal updates when only some sections change
- Error handling for invalid parser output
- Integration with tree item type builder logic

### Tree Rendering Tests (`tree-rendering.test.ts`)
Tests the tree view rendering:
- Items render in correct order from tree_items.json
- Live updates when tree_items.json changes
- Expansion state preservation
- Click behaviors for different typeAndPath items
- Icon handling and theme changes

## Running Tests

```bash
# Install dependencies
npm install

# Compile and run all UI tests (headless)
npm test

# Run UI tests with visible browser (for debugging)
npm run test:ui:headed

# Just compile tests
npm run test:compile
```

## Test Environment

The tests use a sample workspace in `tests/ui/workspace/` with:
- Sample markdown files
- VSCode settings configured for Project Explorer
- Test tree items and watch paths

## Notes

- Tests use ExTester (vscode-extension-tester) with Selenium WebDriver
- Mocha is used as the test framework
- Tests are designed to be deterministic and avoid sleeps where possible
- Each test suite focuses on a specific aspect of the extension functionality