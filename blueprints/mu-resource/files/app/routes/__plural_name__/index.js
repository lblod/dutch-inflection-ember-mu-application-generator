import { inject } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  size: 20,
  page: 0,
  queryParams: {
    page: {
      refreshModel: true
    },
    size: {
      refreshModel: true
    },
    sort: {
      refreshModel: true
    }
  },

  store: inject(),
  model(params) {
    let page = params.page;
    let size = params.size;
    if(size == null) {
      size = this.get('size');
    }
    if(page == null) {
      page = this.get('page');
    }

    let options = {
      page: {
        number: page,
        size: size
      }
    };

    if(params.sort != null) {
      options['sort'] = params.sort;
    }

    return this.get('store').query('<%= entityName %>', options);
  },

  // unsticking query parameters
  resetController(controller, isExiting) {
    if (isExiting) {
      // isExiting would be false if only the route's model was changing
      controller.set('page', this.get('page'));
    }
  }
});
