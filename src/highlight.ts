import {styleTags, tags as t} from "@lezer/highlight"

export const highlight = styleTags({
  "TagName/...": t.tagName,
  "FilterName/...": t.modifier,
  Literal: t.literal,
  Identifier: t.name,
  "in": t.operatorKeyword,
  "ArgumentName/...": t.definition(t.propertyName),
  "VariableDefinition/...": t.variableName,
  "VariableName/...": t.variableName,
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
