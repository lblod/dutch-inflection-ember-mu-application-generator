import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from '../templates/components/pagination-component';

/**
  This component displays a pagination actions, if there are more than 20 results.
  If in the json-api call the number of results is added, then it will also display the number of displayed items: x-y (z)
  The tagname is configurable, the default is a div, because otherwise we cannot use classNameBindings.
  The classes are configurable, the default is "pagination".

  This code is based on the ember-data-table's number pagination component
  https://github.com/mu-semtech/ember-data-table/blob/master/addon/components/number-pagination.js
*/
export default Component.extend({
  layout: layout,
  tagName: 'div',
  classNameBindings: ['classes'],
  classes: "pagination",

  currentPage: computed('page', {
    get() {
      return this.get('page') ? parseInt(this.get('page')) + 1 : 1;
    },
    set(key, value) {
      this.set('page', value - 1);
      return value;
    }
  }),

  firstPage: computed('links', function() {
    return this.get('links')['first']['number'] || 1;
  }),
  lastPage: computed('links', function() {
    const max = this.get('links')['last']['number'];
    return max ? max + 1 : max;
  }),

  isFirstPage: computed('firstPage', 'currentPage', function() {
    return this.get('firstPage') == this.get('currentPage');
  }),
  isLastPage: computed('lastPage', 'currentPage', function() {
    return this.get('lastPage') == this.get('currentPage');
  }),
  hasMultiplePages: computed('lastPage', function() {
    return this.get('lastPage') !== undefined;
  }),
  numberOfPages: computed('hasMultiplePages', 'firstPage', 'lastPage', function() {
    let numberOfPages = 1;
    if (this.get('hasMultiplePages')) {
      numberOfPages += this.get('lastPage') - this.get('firstPage');
    }
    return numberOfPages;
  }),

  size: computed('links', function() {
    return this.get('links')['first']['size'] || null;
  }),
  startItem: computed('size', 'currentPage', function() {
    return this.get('size') * (this.get('currentPage') - 1) + 1;
  }),
  endItem: computed('startItem', 'size', 'total', function() {
    let endItem = this.get('startItem') + this.get('size') - 1;
    if (endItem > this.get('total')) {
      return this.get('total');
    }
    return endItem;
  }),

  isValidPageNumber: computed('goToPage', 'numberOfPages', function(){
    return (this.get('goToPage') > 0) && (this.get('goToPage') < (this.get('numberOfPages') + 1));
  }),
  actions: {
    changePage(link) {
      if (link['number'] != null) {
        this.set('page', link['number'] || 0);
      } else {
        if (link > 0) {
          link -= 1;
        }
        this.set('page', link || 0);
      }
    }
  }
});
