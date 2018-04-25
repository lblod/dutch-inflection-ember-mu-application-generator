# ember-mu-application-generator

Generator for a full browseable CRUD front-end for a mu-cl-resources back-end.

The generator commands can be generated based on a domain.lisp file with the [ember-mu-application-generator-generator](https://github.com/tenforce/ember-mu-application-generator-generator). This script also generates dispatcher rules to route calls from Ember to mu-cl-resources.

## Installation

To install the application via git+https:
```
ember install https://github.com/tenforce/ember-mu-application-generator.git
ember generate ember-mu-application-generator
```

The ember generate is needed, because on install the application should install some necessary files (transforms, utils, etc.) and addons (ember-power-select, ember-changeset). If ember installation is done with a git url, ember install cannot find the package name and install the default blueprint (where packagename == blueprintname).

If it's needed, you can modify the url with a tag or a branch:
```
ember install https://github.com/tenforce/ember-mu-application-generator.git#tag
ember install https://github.com/tenforce/ember-mu-application-generator.git#branch
```

### Ember 2.14

To use the addon with Ember version >=2.14 and <3.0.0, make sure to use the good tag:

```
ember install https://github.com/tenforce/ember-mu-application-generator.git#ember-2.14
```

### Dependencies

This addon requires the following addons:
- [ember-power-select](https://github.com/cibernox/ember-power-select)
- [ember-changeset](https://github.com/DockYard/ember-changeset)
- [ember-datetimepicker](https://github.com/kellyselden/ember-datetimepicker)

If they are not installed with the `ember generate ember-mu-application-generator`, then please install them manually.

```
ember install ember-power-select
ember install ember-changeset
ember install ember-datetimepicker
```

The ember-datetimepicker addon needs jquery-datetimepicker to be able to run. Somehow the addon doesn't ember install it correctly, so make sure to use `ember install ember-datetimepicker` command!


### Design installation

To use the design, you will need `ember-cli-sass`. You'll have to remove your app.css file to use the app.scss file. This design blueprint will install it  for you and generate necessary files:
```
ember generate mu-application-design
```

To install `ember-cli-sass` manually, you can do it like this:

```
ember install ember-cli-sass
```

To just include the necessary files in your app.scss:
```
$mainColor: crimson;
@import "ember-mu-application-generator";
@import "ember-power-select";
```

The `$mainColor` has to be defined! It defines the background of the navbar and all the on hover and focused colors for buttons and input fields.

The default fonts are included in the design files and will be imported in the scss file:
- Source Sans Pro
- Font Awesome


## Usage

```ember generate mu-resource [resource name] ([attribute name](:[type]))* ([relationship name]:(belongs-to|has-many):[type](~[inverse relationship name]))*```

The blueprint takes a flag `--readonly` which generates the same Ember code but without pages to edit an existing or create a new record of these resources.

### Example

```ember generate mu-resource taco filling:belongs-to:protein~fills toppings:has-many:toppings name:string price:number misc --readonly```

In this example `misc` will create an untyped attribute: `misc: attr()`

## User documentation

User documentation can be found in the docs folder!

## Supported attribute types
Besides the built-in Ember attribute types (string, number, boolean) we have transforms for the followings:

- date: transforms an `xsd:date`
- datetime: transforms an `xsd:datetime`
- language-string: transforms an object representing a value in a specific language
- language-string-set: transforms an array of language-strings
- string-set: transforms an array of strings
- uri-set: transforms an array of URIs

See [mu-semtech/ember-mu-transform-helpers](https://github.com/mu-semtech/ember-mu-transform-helpers)

## Known issues

- Sometimes ember-power-select doesn't find the wormhole. This can be fixed with either importing the ember-power-select in SASS or installing ember-wormhole.
- The ember-datetimepicker addon needs jquery-datetimepicker to be able to run. Somehow the addon doesn't ember install it correctly, so make sure to use `ember install ember-datetimepicker` command!
- The extra used addon installation after the `ember generate ember-mu-application-generator` doesn't seem to work correctly. Some extra addons from the [dependencies](#dependencies) might need to be added.
