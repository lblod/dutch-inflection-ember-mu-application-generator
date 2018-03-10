import { debounce } from '@ember/runloop';
import { Promise } from 'rsvp';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import Component from '@ember/component';
import layout from '../templates/components/edit-has-many';

export default Component.extend({
  layout: layout,
  tagName: "div",

  store: inject(),

  options: computed(function(){
    return this.get('store').findAll(this.get('relType'));
  }),

  actions: {
    search(type, term) {
      return new Promise((resolve, reject) => {
        debounce(this, this._performSearch, type, term, resolve, reject, 600);
      });
    },
  },

  _performSearch(type, term, resolve, reject) {
    this.get('store').query(type, {'filter': term}).then(resp => resolve(resp), reject);
  }
});
