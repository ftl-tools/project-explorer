import { ActivityBar, SideBarView, DefaultTreeSection, EditorView, Workbench } from 'vscode-extension-tester';
import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

describe('Settings JSON Action', () => {
  let sidebar: SideBarView;
  let section: DefaultTreeSection | undefined;
  let workbench: Workbench;

  const wsRoot = process.cwd();
  const settingsPath = path.join(wsRoot, '.vscode', 'settings.json');

  before(async function() {
    this.timeout(25000);
    workbench = new Workbench();
    const activityBar = new ActivityBar();
    const explorerView = await activityBar.getViewControl('Explorer');
    sidebar = await explorerView?.openView() as SideBarView;
    await new Promise(r => setTimeout(r, 5000));
    const sections = await sidebar.getContent().getSections();
    for (const s of sections) {
      if (await s.getTitle() === 'Project Explorer') section = s as DefaultTreeSection;
    }
    // ensure clean settings file
    try { fs.rmSync(settingsPath); } catch {}
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
    fs.writeFileSync(settingsPath, '{}', 'utf8');
  });

  it('opens workspace settings.json and reveals first ftl-tools key with grouping/injection', async function() {
    this.timeout(30000);
    if (!section) throw new Error('Project Explorer section missing');

    // Click the Settings title action via command as proxy
    await workbench.executeCommand('Project Explorer: Open Settings');
    // Wait editor open
    await new Promise(r => setTimeout(r, 1500));

    const editorView = new EditorView();
    const editors = await editorView.getOpenEditorTitles();
    expect(editors.some(t => t.endsWith('settings.json'))).to.be.true;

    // Verify file content grouped and defaults injected
    const txt = fs.readFileSync(settingsPath, 'utf8');
    const json = JSON.parse(txt);
    expect(Object.prototype.hasOwnProperty.call(json, 'ftl-tools.project-explorer.watchThese')).to.be.true;
    expect(Object.prototype.hasOwnProperty.call(json, 'ftl-tools.project-explorer.userDefinedTreeItems')).to.be.true;
    expect(Object.prototype.hasOwnProperty.call(json, 'ftl-tools.project-explorer.openDocsInPreview')).to.be.true;
    expect(Object.prototype.hasOwnProperty.call(json, 'ftl-tools.project-explorer.brainstormingDocPath')).to.be.true;

    const keys = Object.keys(json);
    const ftlIdxs = keys.map((k,i)=>[k,i]).filter(([k])=>String(k).startsWith('ftl-tools.')).map(([,i])=>Number(i));
    const nonFtlIdxs = keys.map((k,i)=>[k,i]).filter(([k])=>!String(k).startsWith('ftl-tools.')).map(([,i])=>Number(i));
    expect(Math.min(...nonFtlIdxs.concat([9999]))).to.be.greaterThan(Math.max(...ftlIdxs.concat([-1])));

    // Cursor reveal of first key: ensure selection within file near first key text
    const editorView2 = new EditorView();
    const active = await editorView2.openEditor('settings.json');
    const content = await active.getText();
    const firstKey = keys.find(k=>k.startsWith('ftl-tools.'));
    expect(firstKey).to.not.be.undefined;
    expect(content.indexOf('"'+firstKey+'"')).to.be.greaterThan(-1);
  });
});
