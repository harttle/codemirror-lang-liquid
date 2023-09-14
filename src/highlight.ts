import {styleTags, tags as t} from "@lezer/highlight"

export const highlight = styleTags({
  "TagName/...": t.tagName,
  "FilterName/...": t.function(t.variableName),
  Literal: t.literal,
  Identifier: t.name,
  "in": t.operatorKeyword,
  ArgumentName: t.propertyName,
  VariableDefinition: t.definition(t.variableName),
  VariableName: t.variableName,
  Quoted: t.string,
  Boolean: t.bool,
  DropLiteral: t.bool,
  Null: t.null,
  Number: t.number,
  "[ ]": t.squareBracket,
  "{{ }}": t.squareBracket,
  "{% %}": t.squareBracket,
  "| , :": t.punctuation,
  "..": t.operator
})
