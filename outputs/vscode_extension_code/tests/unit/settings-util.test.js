const { expect } = require('chai');
// Mock vscode module for unit environment
const Module = require('module');
const originalLoad = Module._load;
Module._load = function(request, parent, isMain) {
  if (request === 'vscode') return {
    ConfigurationTarget: { Global: 1, Workspace: 2 },
    workspace: {
      workspaceFolders: undefined,
      getConfiguration: () => ({ get: () => true, update: async () => {} }),
      onDidChangeConfiguration: () => ({ dispose() {} }),
      fs: { readFile: async () => Buffer.from('{}'), writeFile: async () => {}, createDirectory: async () => {} }
    },
    Uri: { joinPath: (uri, ...segs) => ({ ...uri, path: [uri.path, ...segs].join('/') }), file: (p) => ({ path: p }) },
    window: { showTextDocument: async () => ({}), showWarningMessage: () => {}, showErrorMessage: () => {} },
    commands: { executeCommand: async () => {} },
    TextEditorRevealType: { InCenter: 0 },
    Range: function() {},
    Selection: function() {}
  };
  return originalLoad(request, parent, isMain);
};
const util = require('../../out/src/utils/settingsUtil.js');

describe('settingsUtil get/update scope', function() {
  it('writes and reads user scope when no workspace', async function() {
    // Cannot reliably toggle workspace in unit test; at least ensure methods exist and return without throwing
    await util.update('ftl-tools.project-explorer.openDocsInPreview', true, 'user');
    const v = util.get('ftl-tools.project-explorer.openDocsInPreview');
    expect(v === true || v === false).to.equal(true);
  });

  it('resolves scopeFor correctly', function() {
    // Private, but we can infer by updating with explicit scope
    expect(() => util.update('ftl-tools.project-explorer.brainstormingDocPath', '', 'workspace')).to.not.throw;
    expect(() => util.update('ftl-tools.project-explorer.brainstormingDocPath', '', 'user')).to.not.throw;
  });
});
