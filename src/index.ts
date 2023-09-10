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
        Identifier: t.variableName,
        Literal: t.literal,
        Quoted: t.string,
        Boolean: t.bool,
        Empty: t.bool,
        Null: t.null,
        Number: t.number,
        "{%": t.paren,
        "%}": t.paren
      })
    ]
  }),
  languageData: {
  }
})

export function Liquid() {
  return new LanguageSupport(LiquidLanguage)
}
