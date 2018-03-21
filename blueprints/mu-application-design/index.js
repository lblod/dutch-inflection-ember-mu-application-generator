/* eslint-env node */
/*jshint node:true*/
module.exports = {
  description: '',

  normalizeEntityName: function() {},

  // locals: function(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }
  beforeInstall: function() {

  },

  afterInstall: function(options) {
    return this.addAddonToProject("ember-cli-sass");
  }
};
