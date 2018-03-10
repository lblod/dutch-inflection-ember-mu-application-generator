import { set } from '@ember/object';
import Route from '@ember/routing/route';

export default Route.extend({
  showError: false,

  actions: {
    toggleShowError(error) {
      set(error, 'showError', !error.showError);
    }
  }
});
