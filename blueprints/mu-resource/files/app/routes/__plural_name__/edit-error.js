import Route from '@ember/routing/route';
import { set } from '@ember/object';

export default Route.extend({
  showError: false,

  actions: {
    toggleShowError(error) {
      set(error, 'showError', !error.showError);
    }
  }
});
