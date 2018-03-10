var fs = require('fs-extra');
var path = require('path');
var chalk = require('chalk');
var EmberRouterGenerator = require('ember-router-generator');

/* eslint-env node */
/*jshint node:true*/
module.exports = {
  description: '',

  normalizeEntityName: function() {},

  // to install important packages
  afterInstall: function(options) {
    updateRouter.call(this, 'add', options);
    this.addPackageToProject('jquery-datetimepicker', '^2.5.4');
    this.addAddonToProject('ember-power-select', '^1.9.3');
    this.addAddonToProject('ember-datetimepicker', '^2.1.0');
    return this.addAddonToProject('ember-changeset', '^1.3.0');
  },

  afterUninstall: function(options) {
    updateRouter.call(this, 'remove', options);
  }
};


// Router

function updateRouter(action, options) {
  var actionColorMap = {
    add: 'green',
    remove: 'red'
  };
  var color = actionColorMap[action] || 'gray';

  var routes = [
    {
      name: 'route-not-found',
      options: {
        path: '/*wildcard'
      }
    }
  ];

  var self = this;
  this.ui.writeLine('updating router');
  routes.forEach(function(route) {
    writeRoute(action, route.name, route.options, options);
    self._writeStatusToUI(chalk[color], action + ' route', route.name);
  });
}

function findRouter(options) {
  var routerPathParts = [options.project.root];

  if (options.dummy && options.project.isEmberCLIAddon()) {
    routerPathParts = routerPathParts.concat(['tests', 'dummy', 'app', 'router.js']);
  } else {
    routerPathParts = routerPathParts.concat(['app', 'router.js']);
  }

  return routerPathParts;
}

function writeRoute(action, name, routeOptions, options) {
  var routerPath = path.join.apply(null, findRouter(options));
  var source = fs.readFileSync(routerPath, 'utf-8');

  var routes = new EmberRouterGenerator(source);
  var newRoutes = routes[action](name, routeOptions);

  fs.writeFileSync(routerPath, newRoutes.code());
}
