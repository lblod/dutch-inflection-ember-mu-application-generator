import Inflector from 'ember-inflector';

const inflector = Inflector.inflector;

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
inflector.irregular("behandeling-van-agendapunt","behandelingen-van-agendapunten");
inflector.irregular("rechtsgrond-aanstelling","rechtsgronden-aanstelling");
inflector.irregular("rechtsgrond-artikel","rechtsgronden-artikel");
inflector.irregular("rechtsgrond-beeindiging","rechtsgronden-beeindiging");
inflector.irregular("rechtsgrond-besluit","rechtsgronden-besluit");
inflector.irregular("editor-document", "editor-documents");

// Meet Ember Inspector's expectation of an export
export default {};
