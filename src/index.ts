import {parser} from "./syntax.grammar"
import {LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, delimitedIndent} from "@codemirror/language"
import {styleTags, tags as t} from "@lezer/highlight"

export const LiquidLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        // TODO tag indent
        // Application: delimitedIndent({closing: ")", align: false})
      }),
      foldNodeProp.add({
        // TODO tag fold
        // Application: foldInside
      }),
      styleTags({
        "TagName/...": t.tagName,
        "FilterName/...": t.tagName,
        Literal: t.literal,
        Identifier: t.name,
        "in": t.operatorKeyword,
        "reversed limit offset": t.propertyName,
        Quoted: t.string,
        Boolean: t.bool,
        DropLiteral: t.bool,
        Null: t.null,
        Number: t.number,
        "[ ]": t.squareBracket,
        "| , :": t.punctuation,
        "..": t.operator
      })
    ]
  }),
  languageData: {
  }
})

export function Liquid() {
  return new LanguageSupport(LiquidLanguage)
}
