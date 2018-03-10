import { inject } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  store: inject(),
  model() {
    return this.get('store').createRecord('<%= entityName %>');
  },
  actions: {
    save(model) {
      var self = this;
      return model.save().then( function() {
        self.transitionTo( "<%= entitiesName %>");
      }).catch( function() {
        alert("Creation of <%= entityName %> failed");
      });
    },
    cancel(model) {
      var self = this;
      model.rollbackAttributes();
      return model.save().then( function() {
        self.transitionTo( "<%= entitiesName %>");
      }).catch( function() {
        alert("Cancelling creation of <%= entityName %> failed");
      });
    }
  }
});
