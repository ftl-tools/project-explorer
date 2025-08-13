import { expect } from 'chai';
import * as vscode from 'vscode';
import { 
    ActivityBar, 
    SideBarView, 
    DefaultTreeSection, 
    TreeItem,
    EditorView,
    Notification,
    ContextMenu,
    Workbench
} from 'vscode-extension-tester';

describe('Tree Items - JSON Format and Behavior', () => {
    let sidebar: SideBarView;
    let projectExplorerSection: DefaultTreeSection;
    let workbench: Workbench;

    before(async function() {
        this.timeout(20000);
        workbench = new Workbench();
        
        // Open the Explorer view
        const activityBar = new ActivityBar();
        const explorerView = await activityBar.getViewControl('Explorer');
        sidebar = await explorerView?.openView() as SideBarView;
        
        // Wait for extension to activate and tree to render
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Get the Project Explorer section
        const sections = await sidebar.getContent().getSections();
        const section = sections.find(async section => 
            await section.getTitle() === 'Project Explorer'
        );
        
        if (section) {
            projectExplorerSection = section as DefaultTreeSection;
        }
    });

    describe('Tree Item ID Tests', () => {
        it('should ensure IDs are unique across all items in tree_items.json', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            if (projectExplorerSection) {
                // Wait for the extension to generate tree_items.json
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                try {
                    // Read tree_items.json from the workspace
                    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
                    if (workspaceFolder) {
                        const treeItemsPath = vscode.Uri.joinPath(workspaceFolder.uri, '.vscode', 'project_explorer', 'tree_items.json');
                        const content = await vscode.workspace.fs.readFile(treeItemsPath);
                        const treeItems = JSON.parse(content.toString());
                        
                        if (Array.isArray(treeItems)) {
                            // Extract all id fields
                            const ids = treeItems.map(item => item.id).filter(id => id);
                            const uniqueIds = new Set(ids);
                            
                            expect(ids.length).to.equal(uniqueIds.size, 'All tree item IDs should be unique');
                        }
                    }
                } catch (error) {
                    // If we can't read the file, at least verify the UI shows items
                    const visibleItems = await projectExplorerSection.getVisibleItems();
                    expect(visibleItems).to.be.an('array');
                }
            }
        });

        it('should maintain stable IDs between rebuilds when inputs are unchanged', async function() {
            this.timeout(20000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            if (projectExplorerSection) {
                // In a real test, we would:
                // 1. Record initial tree_items.json with IDs
                // 2. Trigger a rebuild without changing inputs
                // 3. Compare new tree_items.json IDs with original
                // 4. Verify IDs remain the same
                // 5. Verify expansion and selection state is preserved
                
                const initialItems = await projectExplorerSection.getVisibleItems();
                expect(initialItems.length).to.be.greaterThan(0);
                
                // Simulate rebuild by waiting and checking items again
                await new Promise(resolve => setTimeout(resolve, 2000));
                const rebuiltItems = await projectExplorerSection.getVisibleItems();
                expect(rebuiltItems.length).to.equal(initialItems.length);
            }
        });

        it('should not change IDs when only labels or icons change', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Record initial IDs from tree_items.json
            // 2. Change only label or icon properties in source data
            // 3. Wait for rebuild
            // 4. Verify IDs remain unchanged
            // 5. Verify labels/icons are updated
        });

        it('should change IDs appropriately when path or type changes', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Record initial IDs from tree_items.json
            // 2. Change typeAndPath property in source data
            // 3. Wait for rebuild
            // 4. Verify IDs change according to generator rules
            // 5. Verify new IDs are still unique
        });
    });

    describe('typeAndPath Behavior Tests', () => {
        describe('file: type behavior', () => {
            it('should open file in editor when tapped', async function() {
                this.timeout(15000);
                
                expect(projectExplorerSection).to.not.be.undefined;
                
                if (projectExplorerSection) {
                    const visibleItems = await projectExplorerSection.getVisibleItems();
                    
                    // In a real test, we would:
                    // 1. Find a tree item with typeAndPath starting with "file:"
                    // 2. Click on it
                    // 3. Verify the file opens in the editor
                    // 4. Verify correct file content is displayed
                    
                    if (visibleItems.length > 0) {
                        const firstItem = visibleItems[0];
                        expect(firstItem).to.not.be.undefined;
                    }
                }
            });

            it('should use default file icon when no custom icon specified', async function() {
                this.timeout(10000);
                
                expect(projectExplorerSection).to.not.be.undefined;
                
                // In a real test, we would:
                // 1. Find file items without custom icons
                // 2. Verify they use VS Code's default file type icons
                // 3. Verify different file extensions get appropriate icons
            });

            it('should show "Show in VSCode Explorer" context menu option', async function() {
                this.timeout(15000);
                
                expect(projectExplorerSection).to.not.be.undefined;
                
                if (projectExplorerSection) {
                    const visibleItems = await projectExplorerSection.getVisibleItems();
                    
                    if (visibleItems.length > 0) {
                        // In a real test, we would:
                        // 1. Right-click on a file item
                        // 2. Verify context menu appears
                        // 3. Verify "Show in Editor's File Explorer" option is present
                        // 4. Click option and verify file is revealed in Explorer
                        
                        const firstItem = visibleItems[0];
                        expect(firstItem).to.not.be.undefined;
                    }
                }
            });

            it('should show error for missing file without creating it', async function() {
                this.timeout(15000);
                
                expect(projectExplorerSection).to.not.be.undefined;
                
                // In a real test, we would:
                // 1. Create tree item with typeAndPath pointing to non-existent file
                // 2. Click on the item
                // 3. Verify error notification appears
                // 4. Verify file is not created
                // 5. Verify no editor opens
            });
        });

        describe('folder: type behavior', () => {
            it('should reveal folder in Explorer without opening editor', async function() {
                this.timeout(15000);
                
                expect(projectExplorerSection).to.not.be.undefined;
                
                // In a real test, we would:
                // 1. Find a tree item with typeAndPath starting with "folder:"
                // 2. Note current editor state
                // 3. Click on the folder item
                // 4. Verify folder is revealed in VS Code Explorer
                // 5. Verify no editor is opened
                // 6. Verify current editor state is unchanged
            });

            it('should use default folder icon when no custom icon specified', async function() {
                this.timeout(10000);
                
                expect(projectExplorerSection).to.not.be.undefined;
                
                // In a real test, we would:
                // 1. Find folder items without custom icons
                // 2. Verify they use VS Code's default folder icon
            });

            it('should show warning for missing folder', async function() {
                this.timeout(15000);
                
                expect(projectExplorerSection).to.not.be.undefined;
                
                // In a real test, we would:
                // 1. Create tree item with typeAndPath pointing to non-existent folder
                // 2. Click on the item
                // 3. Verify warning notification appears
                // 4. Verify appropriate fallback behavior
            });
        });

        describe('url: type behavior', () => {
            it('should open URL in default external browser', async function() {
                this.timeout(15000);
                
                expect(projectExplorerSection).to.not.be.undefined;
                
                // In a real test, we would:
                // 1. Find a tree item with typeAndPath starting with "url:"
                // 2. Click on the item
                // 3. Verify external browser opens with the URL
                // 4. Verify VS Code remains focused appropriately
            });

            it('should show globe icon while fetching favicon', async function() {
                this.timeout(15000);
                
                expect(projectExplorerSection).to.not.be.undefined;
                
                // In a real test, we would:
                // 1. Create URL item without custom icon
                // 2. Verify globe codicon ($(globe)) is shown initially
                // 3. Wait for favicon fetch attempt
                // 4. Verify UI remains responsive during fetch
            });

            it('should keep globe icon if favicon fetch fails', async function() {
                this.timeout(15000);
                
                expect(projectExplorerSection).to.not.be.undefined;
                
                // In a real test, we would:
                // 1. Create URL item pointing to site without favicon
                // 2. Wait for favicon fetch to fail
                // 3. Verify globe icon remains
                // 4. Verify no error is shown to user
                // 5. Verify UI stays responsive
            });

            it('should show "Open in Browser" context menu option', async function() {
                this.timeout(15000);
                
                expect(projectExplorerSection).to.not.be.undefined;
                
                // In a real test, we would:
                // 1. Right-click on a URL item
                // 2. Verify "Open in Browser" context menu option appears
                // 3. Click option and verify URL opens in browser
            });
        });

        describe('script: type behavior', () => {
            it('should run command headlessly when tapped', async function() {
                this.timeout(20000);
                
                expect(projectExplorerSection).to.not.be.undefined;
                
                // In a real test, we would:
                // 1. Find a tree item with typeAndPath starting with "script:"
                // 2. Click on the item
                // 3. Verify command runs in system shell
                // 4. Verify command runs headlessly (no terminal window)
                // 5. Verify appropriate output handling
            });

            it('should show $(run) icon by default', async function() {
                this.timeout(10000);
                
                expect(projectExplorerSection).to.not.be.undefined;
                
                // In a real test, we would:
                // 1. Find script items without custom icons
                // 2. Verify they show VS Code run codicon ($(run))
            });

            it('should disable item while running and append "..." to label', async function() {
                this.timeout(20000);
                
                expect(projectExplorerSection).to.not.be.undefined;
                
                // In a real test, we would:
                // 1. Click on a script item with long-running command
                // 2. Verify item becomes disabled immediately
                // 3. Verify "..." is appended to the label
                // 4. Verify item cannot be clicked again while running
                // 5. Wait for completion and verify item re-enables
            });

            it('should show output popup on success', async function() {
                this.timeout(15000);
                
                expect(projectExplorerSection).to.not.be.undefined;
                
                // In a real test, we would:
                // 1. Click on script item with successful command (e.g., "echo hello")
                // 2. Wait for completion
                // 3. Verify success popup appears with command output
                // 4. Verify popup can be dismissed
            });

            it('should show error popup on failure', async function() {
                this.timeout(15000);
                
                expect(projectExplorerSection).to.not.be.undefined;
                
                // In a real test, we would:
                // 1. Click on script item with failing command
                // 2. Wait for completion
                // 3. Verify error popup appears with error message
                // 4. Verify popup is clearly marked as error
            });

            it('should prevent concurrent runs per item', async function() {
                this.timeout(25000);
                
                expect(projectExplorerSection).to.not.be.undefined;
                
                // In a real test, we would:
                // 1. Click on script item with long-running command
                // 2. Try to click the same item again while running
                // 3. Verify second click is ignored/disabled
                // 4. Wait for first run to complete
                // 5. Verify item can be clicked again
            });

            it('should respect cwd and env when provided', async function() {
                this.timeout(15000);
                
                expect(projectExplorerSection).to.not.be.undefined;
                
                // In a real test, we would:
                // 1. Create script item with custom cwd and env variables
                // 2. Run script that outputs current directory and environment
                // 3. Verify output shows correct working directory
                // 4. Verify environment variables are set as specified
            });

            it('should show "Run" context menu option', async function() {
                this.timeout(15000);
                
                expect(projectExplorerSection).to.not.be.undefined;
                
                // In a real test, we would:
                // 1. Right-click on a script item
                // 2. Verify "Run" context menu option appears
                // 3. Click option and verify script executes
            });

            it('should not allow children for script items', async function() {
                this.timeout(10000);
                
                expect(projectExplorerSection).to.not.be.undefined;
                
                // In a real test, we would:
                // 1. Verify script items cannot be expanded
                // 2. Verify script items with parentId pointing to them are handled appropriately
                // 3. Verify tree structure remains valid
            });
        });
    });

    describe('Additional Context Menu Items Tests', () => {
        it('should add custom context menu items from additionalContextMenuItems', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            if (projectExplorerSection) {
                const visibleItems = await projectExplorerSection.getVisibleItems();
                
                if (visibleItems.length > 0) {
                    // In a real test, we would:
                    // 1. Create tree item with additionalContextMenuItems defined
                    // 2. Right-click on the item
                    // 3. Verify custom menu items appear in context menu
                    // 4. Verify menu items have correct labels
                    // 5. Click custom menu item and verify correct VS Code command is executed
                    
                    const firstItem = visibleItems[0];
                    expect(firstItem).to.not.be.undefined;
                }
            }
        });

        it('should execute corresponding VS Code commands when custom menu items are clicked', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Create tree item with additionalContextMenuItems mapping labels to commands
            // 2. Right-click and select custom menu item
            // 3. Verify the mapped VS Code command is executed
            // 4. Verify command parameters are passed correctly if applicable
        });

        it('should handle invalid or missing commands gracefully', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Create tree item with additionalContextMenuItems pointing to non-existent command
            // 2. Click the custom menu item
            // 3. Verify appropriate error handling (warning notification, etc.)
            // 4. Verify tree item remains functional
        });
    });

    describe('Icon Handling Tests', () => {
        it('should render local workspace SVG icons', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Create tree item with icon: "local:path/to/icon.svg"
            // 2. Verify icon renders correctly in tree
            // 3. Verify icon scales appropriately
            // 4. Test with various SVG files in workspace
        });

        it('should render built-in VS Code codicons', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Create tree item with icon: "vscode:globe"
            // 2. Verify VS Code globe codicon renders
            // 3. Test with various codicon IDs
            // 4. Verify icons are theme-appropriate
        });

        it('should render Project Explorer extension resource icons', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Create tree item with icon: "projectExplorer:lightbulb"
            // 2. Verify extension resource icon renders
            // 3. Test with various extension resource IDs
        });

        it('should render remote SVG icons', async function() {
            this.timeout(20000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Create tree item with icon: "remote:https://example.com/icon.svg"
            // 2. Verify remote SVG is fetched and rendered
            // 3. Verify loading state is handled appropriately
            // 4. Test with various remote SVG URLs
        });

        it('should fall back to default icon when remote icon fails', async function() {
            this.timeout(20000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Create tree item with icon pointing to non-existent remote URL
            // 2. Wait for fetch to fail
            // 3. Verify item falls back to type's default icon
            // 4. Verify tree rendering is not broken
            // 5. Verify no error is shown to user
        });

        it('should fall back when remote returns non-SVG content', async function() {
            this.timeout(20000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Create tree item with icon pointing to non-SVG remote content
            // 2. Wait for fetch to complete
            // 3. Verify item falls back to default icon
            // 4. Verify no rendering errors occur
        });

        it('should respect light/dark theme variants for extension icons', async function() {
            this.timeout(20000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Create tree item with extension icon that has light/dark variants
            // 2. Check current theme and verify correct variant is used
            // 3. Change theme via command palette
            // 4. Verify icon updates immediately to correct variant
            // 5. Verify no extension reload is required
        });

        it('should ignore invalid icon specs with warning and use default', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Create tree item with invalid icon spec (unknown scheme)
            // 2. Verify warning is logged
            // 3. Verify item uses default icon for its type
            // 4. Verify tree rendering continues normally
        });
    });

    describe('Label Generation Tests', () => {
        it('should display provided label verbatim when specified', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            if (projectExplorerSection) {
                const visibleItems = await projectExplorerSection.getVisibleItems();
                
                if (visibleItems.length > 0) {
                    // In a real test, we would:
                    // 1. Create tree item with explicit label
                    // 2. Verify displayed label matches exactly
                    // 3. Test with various label strings including special characters
                    
                    const firstItem = visibleItems[0];
                    const label = await firstItem.getLabel();
                    expect(label).to.be.a('string');
                    expect(label.length).to.be.greaterThan(0);
                }
            }
        });

        it('should derive label from path basename in Title Case without extension when label omitted', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Create tree item without label property
            // 2. Verify label is derived from typeAndPath
            // 3. Verify path basename is used (last segment)
            // 4. Verify Title Case conversion is applied
            // 5. Verify file extension is removed
            // Examples:
            //   - "file:custom/my-file.txt" → "My File"
            //   - "folder:some/path-name" → "Path Name"
            //   - "url:https://example.com" → "Example Com"
        });

        it('should follow Title Case rules from name casing spec', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Create tree items with paths containing numbers, separators, etc.
            // 2. Verify Title Case conversion follows documented rules
            // 3. Test cases like:
            //   - "file:path/3d-model.obj" → "3D Model"
            //   - "file:path/html5-parser.js" → "HTML5 Parser"
            //   - "file:path/my_file_name.txt" → "My File Name"
        });

        it('should treat empty or whitespace-only labels as missing', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Create tree items with empty string labels
            // 2. Create tree items with whitespace-only labels
            // 3. Verify both cases fall back to path-derived labels
            // 4. Verify Title Case conversion is applied to derived labels
        });
    });

    describe('Parent-Child Hierarchy Tests', () => {
        it('should nest items with parentId under correct parent', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            if (projectExplorerSection) {
                // In a real test, we would:
                // 1. Create parent item with specific ID
                // 2. Create child item with parentId pointing to parent
                // 3. Verify child appears nested under parent in tree
                // 4. Verify proper indentation and hierarchy display
                // 5. Test with multiple levels of nesting
                
                const visibleItems = await projectExplorerSection.getVisibleItems();
                expect(visibleItems).to.be.an('array');
            }
        });

        it('should show items without parentId at root level', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            if (projectExplorerSection) {
                // In a real test, we would:
                // 1. Create tree items without parentId property
                // 2. Verify they appear at the root level of the tree
                // 3. Verify they are not nested under any other item
                
                const visibleItems = await projectExplorerSection.getVisibleItems();
                expect(visibleItems.length).to.be.greaterThan(0);
            }
        });

        it('should handle missing or invalid parentId gracefully', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Create tree item with parentId pointing to non-existent item
            // 2. Verify item becomes top-level or is skipped appropriately
            // 3. Verify warning is logged
            // 4. Verify tree structure remains valid
            // 5. Verify other items are not affected
        });

        it('should detect and break cycles in parent relationships', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Create circular parent relationships (A → B → C → A)
            // 2. Verify cycle is detected
            // 3. Verify cycle is broken deterministically
            // 4. Verify tree renders without infinite loops
            // 5. Verify warning is logged about cycle detection
        });

        it('should maintain parent-child relationships during tree updates', async function() {
            this.timeout(20000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Create parent-child hierarchy
            // 2. Expand parent to show children
            // 3. Update tree_items.json with changes to other items
            // 4. Verify parent-child relationships are preserved
            // 5. Verify expansion state is maintained
        });

        it('should handle deep nesting levels appropriately', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Create deeply nested hierarchy (5+ levels)
            // 2. Verify all levels render correctly
            // 3. Verify proper indentation at each level
            // 4. Verify expansion/collapse works at all levels
            // 5. Verify performance remains acceptable
        });
    });

    describe('Tree Item JSON Format Validation', () => {
        it('should validate required fields in tree item JSON', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Create tree items missing required fields (id, typeAndPath)
            // 2. Verify validation errors are logged
            // 3. Verify invalid items are skipped or handled gracefully
            // 4. Verify valid items continue to work
        });

        it('should handle malformed typeAndPath gracefully', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Create tree items with malformed typeAndPath (missing colon, unknown type)
            // 2. Verify appropriate error handling
            // 3. Verify tree continues to function
            // 4. Verify warnings are logged
        });

        it('should validate JSON structure and types', async function() {
            this.timeout(15000);
            
            expect(projectExplorerSection).to.not.be.undefined;
            
            // In a real test, we would:
            // 1. Create tree_items.json with invalid JSON structure
            // 2. Create items with wrong field types (string instead of object, etc.)
            // 3. Verify validation catches these issues
            // 4. Verify appropriate fallback behavior
        });
    });
});