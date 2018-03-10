import Component from '@ember/component';
import layout from '../templates/components/display-model-belongsto-relationship';

export default Component.extend({
  layout: layout,
  tagName: 'div',
  classNameBindings: ['classes'],
  classes: ""
});
