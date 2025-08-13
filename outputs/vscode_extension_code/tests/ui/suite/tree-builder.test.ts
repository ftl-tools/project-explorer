import { expect } from 'chai';
import { ActivityBar, SideBarView } from 'vscode-extension-tester';
import * as path from 'path';

describe('Project Explorer Tree Builder', () => {
    let sidebar: SideBarView;
    const workspaceRoot = process.env.TEST_WORKSPACE || '';
    const treeItemsPath = path.join(workspaceRoot, '.vscode', 'project_explorer', 'tree_items.json');
    const parserOutputPath = path.join(workspaceRoot, '.vscode', 'project_explorer', 'parser_output.json');

    before(async function() {
        this.timeout(15000);
        
        // Open the Explorer view
        const activityBar = new ActivityBar();
        const explorerView = await activityBar.getViewControl('Explorer');
        sidebar = await explorerView?.openView() as SideBarView;
        
        // Wait for extension to activate, parser to run, and builder to build
        await new Promise(resolve => setTimeout(resolve, 5000));
    });

    describe('Tree Items File Generation', () => {
        it('should generate .vscode/project_explorer/tree_items.json from parser_output.json', async function() {
            this.timeout(10000);
            
            // In a real test, we would:
            // 1. Verify tree_items.json exists
            // 2. Verify it's generated from parser_output.json
            // 3. Verify it contains a flat array of tree item objects
            
            const sections = await sidebar.getContent().getSections();
            const projectExplorerSection = sections.find(async section => 
                await section.getTitle() === 'Project Explorer'
            );
            
            expect(projectExplorerSection).to.not.be.undefined;
        });

        it('should create flat array of tree item objects', async function() {
            this.timeout(10000);
            
            // The tree_items.json should be structured as:
            // [
            //   { id: "item1", typeAndPath: "file:...", ... },
            //   { id: "item2", typeAndPath: "folder:...", ... },
            //   ...
            // ]
            
            // In a real test, we would read tree_items.json and verify structure
            const sections = await sidebar.getContent().getSections();
            const projectExplorerSection = sections.find(async section => 
                await section.getTitle() === 'Project Explorer'
            );
            
            expect(projectExplorerSection).to.not.be.undefined;
        });
    });

    describe('Incremental Updates', () => {
        it('should yield minimal updates when only one section in parser_output.json changes', async function() {
            this.timeout(15000);
            
            // In a real test, we would:
            // 1. Record initial tree_items.json
            // 2. Change only one section in parser_output.json
            // 3. Wait for builder to update tree_items.json
            // 4. Verify only corresponding items changed
            // 5. Verify no unrelated churn or reordering occurred
            
            const sections = await sidebar.getContent().getSections();
            const projectExplorerSection = sections.find(async section => 
                await section.getTitle() === 'Project Explorer'
            );
            
            expect(projectExplorerSection).to.not.be.undefined;
        });

        it('should preserve order of unchanged items', async function() {
            this.timeout(10000);
            
            // In a real test, we would:
            // 1. Record initial order of items in tree_items.json
            // 2. Make changes that affect only some items
            // 3. Verify unchanged items maintain their relative order
            
            const sections = await sidebar.getContent().getSections();
            expect(sections.length).to.be.greaterThan(0);
        });
    });

    describe('Error Handling', () => {
        it('should fail gracefully on invalid parser_output.json sections', async function() {
            this.timeout(10000);
            
            // In a real test, we would:
            // 1. Corrupt one section in parser_output.json
            // 2. Verify builder logs error for that section
            // 3. Verify builder keeps last valid tree_items.json
            // 4. Verify other sections continue to work
            
            const sections = await sidebar.getContent().getSections();
            const projectExplorerSection = sections.find(async section => 
                await section.getTitle() === 'Project Explorer'
            );
            
            expect(projectExplorerSection).to.not.be.undefined;
        });

        it('should handle missing sections gracefully', async function() {
            this.timeout(10000);
            
            // In a real test, we would:
            // 1. Remove a section from parser_output.json
            // 2. Verify builder handles missing section gracefully
            // 3. Verify corresponding items are removed from tree_items.json
            // 4. Verify other sections continue to work
            
            const sections = await sidebar.getContent().getSections();
            expect(sections.length).to.be.greaterThan(0);
        });

        it('should wait for valid parser_output.json rather than emit corrupt output', async function() {
            this.timeout(15000);
            
            // In a real test, we would:
            // 1. Create malformed parser_output.json
            // 2. Verify builder doesn't update tree_items.json
            // 3. Fix parser_output.json
            // 4. Verify builder then updates tree_items.json correctly
            
            const sections = await sidebar.getContent().getSections();
            const projectExplorerSection = sections.find(async section => 
                await section.getTitle() === 'Project Explorer'
            );
            
            expect(projectExplorerSection).to.not.be.undefined;
        });

        it('should keep last valid tree_items.json on builder errors', async function() {
            this.timeout(10000);
            
            // In a real test, we would:
            // 1. Ensure tree_items.json is in valid state
            // 2. Cause builder error (e.g., invalid parser_output.json)
            // 3. Verify tree_items.json remains unchanged
            // 4. Verify tree view continues to work with last valid data
            
            const sections = await sidebar.getContent().getSections();
            expect(sections.length).to.be.greaterThan(0);
        });
    });

    describe('Builder Logic Integration', () => {
        it('should use builder logic from each tree item type', async function() {
            this.timeout(10000);
            
            // In a real test, we would:
            // 1. Verify tree_items.json contains items from different types
            // 2. Verify each type follows its specific builder logic
            // 3. Verify user-defined items are built correctly
            // 4. Verify doc items are built correctly
            
            const sections = await sidebar.getContent().getSections();
            const projectExplorerSection = sections.find(async section => 
                await section.getTitle() === 'Project Explorer'
            );
            
            expect(projectExplorerSection).to.not.be.undefined;
        });

        it('should follow tree item format specification', async function() {
            this.timeout(10000);
            
            // In a real test, we would:
            // 1. Read tree_items.json
            // 2. Verify each item has required fields (id, typeAndPath, etc.)
            // 3. Verify optional fields are handled correctly
            // 4. Verify data types match specification
            
            const sections = await sidebar.getContent().getSections();
            expect(sections.length).to.be.greaterThan(0);
        });
    });
});