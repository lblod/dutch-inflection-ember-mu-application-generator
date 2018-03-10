import Component from '@ember/component';
import { LangString } from 'ember-mu-transform-helpers/transforms/language-string';

/*
  This component edits a language typed string.
  The tagname is configurable, the default is a div, because otherwise we cannot use classNameBindings.
  The classes are configurable, the default is "".
*/
export default Component.extend({
  tagName: 'div',
  classNameBindings: ['classes'],
  classes: '',

  init() {
    this._super(...arguments);
    const langTypedString = this.get('data') ? this.get('data') : new LangString('', '');
    this.set('view', langTypedString);
  },

  actions: {
    updateData() {
      if (this.get('view.content') || this.get('view.language'))
        this.set('data', this.get('view'));
      else
        this.set('data', null);
    }
  }
});
