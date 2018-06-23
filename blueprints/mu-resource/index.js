// TODO clean up packages
var Inflector = require('./inflector.js');
var inflector = new Inflector();
var stringUtils = require('ember-cli-string-utils');
var EOL = require('os').EOL;
var fs = require('fs-extra');
var path = require('path');
var chalk = require('chalk');
var stringUtil = require('ember-cli-string-utils');
var EmberRouterGenerator = require('ember-router-generator');

// TODO: duplication from blueprints/ember-mu-application-generator/files/app/models/custom-inflector-rules
inflector.plural(/$/,'en');
inflector.plural(/e$/,'es');
inflector.plural(/e([lnr])$/,'e$1s');
inflector.plural(/([aiuo])$/,'$1s');
inflector.plural(/([^aiuoe])([aiuo])([a-z])$/,'$1$2$3$3en'); // TODO: this is a bit hack
inflector.plural(/uis$/,'uizen');
inflector.plural(/ief$/,'ieven');
inflector.plural(/or$/,'oren');
inflector.plural(/ie$/,'ies');
inflector.plural(/eid$/,'eden');
inflector.plural(/aa([a-z])$/,'a$1en');
inflector.plural(/uu([a-z])$/,'u$1en');
inflector.plural(/oo([a-z])$/,'o$1en');
inflector.singular(/en$/,'');
inflector.singular(/es$/,'e');
inflector.singular(/e([lnr])s$/,'e$1');
inflector.singular(/([aiuo])s$/,'$1');
inflector.singular(/([^aiuoe])([aiuo])([a-z])\3en$/,"$1$2$3"); // TODO: this is a bit hack
inflector.singular(/uizen$/,'uis');
inflector.singular(/ieven$/,'ief');
inflector.singular(/ies$/,'ie');
inflector.singular(/eden$/,'eid');
inflector.singular(/a([a-z])en$/,'aa$1');
inflector.singular(/u([a-z])en$/,'uu$1');
inflector.singular(/o([a-z])en$/,'oo$1');
inflector.singular(/([auio])s$/,'$1s');
inflector.irregular("behandeling-van-agendapunt","behandelingen-van-agendapunten");
inflector.irregular("rechtsgrond-aanstelling","rechtsgronden-aanstelling");
inflector.irregular("rechtsgrond-artikel","rechtsgronden-artikel");
inflector.irregular("rechtsgrond-beeindiging","rechtsgronden-beeindiging");
inflector.irregular("rechtsgrond-besluit","rechtsgronden-besluit");
inflector.irregular("editor-document", "editor-documents");
inflector.irregular("editor-document-status", "editor-document-statuses");
inflector.irregular("export", "exports");
inflector.irregular("account", "accounts");
inflector.irregular('identificator', 'identificatoren');
inflector.irregular('file', 'files');
inflector.irregular('document-status', 'document-statuses');
inflector.irregular('bbcdr-report', 'bbcdr-reports');
inflector.irregular('validation', 'validations');
inflector.irregular('validation-execution', 'validation-executions');
inflector.irregular('validation-error', 'validation-errors');
inflector.irregular('inzending-voor-toezicht', 'inzendingen-voor-toezicht');
inflector.irregular('toezicht-account-acceptance-status', 'toezicht-account-acceptance-statuses');
inflector.irregular('toezicht-fiscal-period', 'toezicht-fiscal-periods');

/* eslint-env node */
module.exports = {

  description: 'Generates an ember-data model and an ember application to edit it.',

  anonymousOptions: [
    'name',
    'attr:type',
    'rel:kind:type~inverse'
  ],

  availableOptions: [
    {
      name: 'readonly',
      type: Boolean,
      default: false
    }
  ],

  locals: function(options) {

    // Model

    var attrs = [];
    var needs = [];
    var properties = [];
    var entityOptions = options.entity.options;
    var importStatements = [
      'import Model from \'ember-data/model\';',
      'import { collect } from \'@ember/object/computed\';'
    ];
    var shouldImportAttr = false;
    var shouldImportBelongsTo = false;
    var shouldImportHasMany = false;

    for (var name in entityOptions) {
      var type = entityOptions[name] || '';
      var foreignModel = name;
      var inverseName = '';
      if (type.indexOf(':') > -1) {
        foreignModel = type.split(':')[1];
        type = type.split(':')[0];
        if (foreignModel.indexOf('~') > -1) {
          inverseName = foreignModel.split('~')[1];
          foreignModel = foreignModel.split('~')[0];
        }
      }


      var dasherizedName = stringUtils.dasherize(name);
      var camelizedName = stringUtils.camelize(name);
      var dasherizedType = stringUtils.dasherize(type);
      var dasherizedForeignModel = stringUtils.dasherize(foreignModel);
      // TODO name is given, inflect anyways? should be correct in domain.lisp, right?
      var dasherizedForeignModelPlural = inflector.pluralize(dasherizedForeignModel);
      var dasherizedForeignModelSingular = inflector.singularize(dasherizedForeignModel);

      var camelizedInverseName = stringUtils.camelize(inverseName);

      var attr;
      if (/has-many/.test(dasherizedType)) {
        attr = dsAttr(dasherizedForeignModelSingular, dasherizedType, camelizedInverseName);
        attrs.push(camelizedName + ': ' + attr);
        shouldImportHasMany = true;
      } else if (/belongs-to/.test(dasherizedType)) {
        attr = dsAttr(dasherizedForeignModel, dasherizedType, camelizedInverseName);
        attrs.push(camelizedName + ': ' + attr);
        shouldImportBelongsTo = true;
      } else {
        attr = dsAttr(dasherizedName, dasherizedType);
        attrs.push(camelizedName + ': ' + attr);
        shouldImportAttr = true;
      }

      if (/has-many|belongs-to/.test(dasherizedType)) {
        needs.push('\'model:' + dasherizedForeignModelSingular + '\'');
      }


      properties.push({
        name: camelizedName,
        kind: type,
        relType: dasherizedForeignModelSingular,
        relRoute: dasherizedForeignModelPlural
      });

    }

    var needsDeduplicated = needs.filter(function(need, i) {
      return needs.indexOf(need) === i;
    });

    if (shouldImportAttr) {
      importStatements.push('import attr from \'ember-data/attr\';');
    }

    if (shouldImportBelongsTo && shouldImportHasMany) {
      importStatements.push('import { belongsTo, hasMany } from \'ember-data/relationships\';');
    } else if (shouldImportBelongsTo) {
      importStatements.push('import { belongsTo } from \'ember-data/relationships\';');
    } else if (shouldImportHasMany) {
      importStatements.push('import { hasMany } from \'ember-data/relationships\';');
    }

    importStatements = importStatements.join(EOL);
    attrs = attrs.join(',' + EOL + '  ');
    needs = '  needs: [' + needsDeduplicated.join(', ') + ']';

    // Templates and code

    var attributes = properties.filter(function(prop) {
      return prop.kind != "has-many" && prop.kind != "belongs-to";
    });
    var relationships = properties.filter(function(prop) {
      return prop.kind == "has-many" || prop.kind == "belongs-to";
    });
    var belongsToRelationships = relationships.filter(function(relationship) {
      return relationship.kind == "belongs-to";
    });
    var hasManyRelationships = relationships.filter(function(relationship) {
      return relationship.kind == "has-many";
    });

    // Return

    const result = {
      // Model
      importStatements: importStatements,
      attrs: attrs, // attrs and relationships, ready to be pasted in the model template
      needs: needs, // for dependencies in unit tests

      // Templates and code
      attributes: attributes,
      relationships: relationships,
      belongsToRelationships: belongsToRelationships,
      hasManyRelationships: hasManyRelationships,
      entityName: options.entity.name,
      entitiesName: inflector.pluralize(options.entity.name),

      readonly: options.readonly
    };

    return result;
  },

  fileMapTokens: function(options) {
    return {
      __plural_name__: function(options) {
        return options.locals.entitiesName;
      }
    };
  },

  // https: //github.com/ember-cli/ember-cli/issues/7287
  files() {

    var fileList = ['app/',
      'app/models/',
      'app/models/__name__.js',
      'app/routes/',
      'app/routes/__plural_name__/',
      'app/routes/__plural_name__/index.js',
      'app/routes/__plural_name__/show.js',
      'app/routes/__plural_name__/show-error.js',
      'app/templates/',
      'app/templates/__plural_name__/',
      'app/templates/__plural_name__/index.hbs',
      'app/templates/__plural_name__/show.hbs',
      'app/templates/__plural_name__/show-error.hbs'
    ];

    if ((this.options == null) || (!this.options.readonly)) {
      return fileList.concat([
        'app/routes/__plural_name__/new.js',
        'app/routes/__plural_name__/edit.js',
        'app/routes/__plural_name__/edit-error.js',
        'app/templates/__plural_name__/new.hbs',
        'app/templates/__plural_name__/edit.hbs',
        'app/templates/__plural_name__/edit-error.hbs'
      ]);
    }

    return fileList;
  },

  shouldEntityTouchRouter: function(name) {
    var isIndex = name === 'index';
    var isBasic = name === 'basic';
    var isApplication = name === 'application';

    return !isBasic && !isIndex && !isApplication;
  },

  shouldTouchRouter: function(name, options) {
    var entityTouchesRouter = this.shouldEntityTouchRouter(name);
    var isDummy = !!options.dummy;
    var isAddon = !!options.project.isEmberCLIAddon();
    var isAddonDummyOrApp = (isDummy === isAddon);

    return (entityTouchesRouter && isAddonDummyOrApp && !options.dryRun && !options.inRepoAddon && !options.skipRouter);
  },

  afterInstall: function(options) {
    return updateRouter.call(this, 'add', options);
    // TODO hey nora use this for install in the other blueprints
    // this.addPackageToProject('ember-i18n', '^4.3.2');
    // this.addPackageToProject('ember-promise-helpers', '^1.0.3');
    // return this.addPackageToProject('ember-data-table', '^0.6.0');
    // Ember CLI expects to resolve a promise from these hooks when running the blueprint
    // So return!
  },

  afterUninstall: function(options) {
    updateRouter.call(this, 'remove', options);
  }
};

// Model


// TODO inline this function. the caller already does the type matching...
function dsAttr(name, type, inverse) {
  if (inverse) { // is either empty or needs some more syntax
    inverse = ", { inverse: '" + inverse + "' }";
  }
  else {
    inverse = ", { inverse: null }";
  }

  switch (type) {
  case 'belongs-to':
    return 'belongsTo(\'' + name + '\'' + inverse + ')';
  case 'has-many':
    return 'hasMany(\'' + name + '\'' + inverse + ')';
  case 'date': // data types with a custom transform
  case 'datetime':
  case 'language-string':
  case 'language-string-set':
  case 'string-set':
  case 'uri-set':
    return 'attr(\'' + type + '\')';
  default:
    return 'attr()';
  }
}

// Router

function updateRouter(action, options) {
  var entity = options.entity;
  var actionColorMap = {
    add: 'green',
    remove: 'red'
  };
  var color = actionColorMap[action] || 'gray';

  var entitiesName = inflector.pluralize(entity.name);

  var routes = [{
      name: entitiesName,
      options: {}
    },
    {
      name: entitiesName + '/show',
      options: {
        path: ':id'
      }
    }
  ];
  if (!options.readonly) {
    routes = routes.concat([{
        name: entitiesName + '/new',
        options: {}
      },
      {
        name: entitiesName + '/edit',
        options: {
          path: ':id/edit'
        }
      }
    ]);
  }
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

// Templates and code
var entityToVariable = function(entityName) {
  var splits = entityName.split("-");
  return [splits[0]].concat(
    splits.slice(1).map(function(word) {
      return word[0].toUpperCase() + word.substring(1);
    })
  ).join("");
};
