'use babel';

import ArrowDebugView from './arrow-debug-view';
import { CompositeDisposable } from 'atom';

export default {

  arrowDebugView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.arrowDebugView = new ArrowDebugView(state.arrowDebugViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.arrowDebugView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'arrow-debug:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.arrowDebugView.destroy();
  },

  serialize() {
    return {
      arrowDebugViewState: this.arrowDebugView.serialize()
    };
  },

  toggle() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      const splitText = selection.split('=>')
      let newText = `${splitText[0]}=> ` +
        `{\n  debugger\n  return (` +
        `      ${splitText[1].split('\n').
          map((text) => `  ${text}`).
          join('\n')}\n  )\n}`
      editor.insertText(newText)
    }
  }

};
