<%= importStatements %>

export default Model.extend({
  // A string representation of this model, based on its attributes.
  // This is what mu-cl-resources uses to search on, and how the model will be presented while editing relationships.
  stringRep: collect.apply(this,[<%="'" + ["id"].concat(attributes.map( function(attribute) {return attribute.name})).join("', '") + "'"%>]),

  <%= attrs %>
});
