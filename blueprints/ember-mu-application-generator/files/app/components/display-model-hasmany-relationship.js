import { inject } from '@ember/service';
import Component from '@ember/component';
import layout from '../templates/components/display-model-hasmany-relationship';

export default Component.extend({
  layout: layout,
  routing: inject('-routing'),
  tagName: 'div',
  classNameBindings: ['classes'],
  classes: ""
});
