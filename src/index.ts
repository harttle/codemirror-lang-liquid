import {parser} from "./syntax.grammar"
// import {htmlCompletionSource } from "@codemirror/lang-html"
import {LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, delimitedIndent} from "@codemirror/language"
import {highlight} from "./highlight"
import {liquidCompletion} from "./autocompletion"

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
      highlight
    ]
  }),
  languageData: {
    commentTokens: { block: { open: "{% comment %}", close: "{% endcomment %}" } },
    indentOnInput: /^\s*(<\/\w+\W)$/,
    wordChars: "_",
    // autocomplete: htmlCompletionSource
  }
})

export function Liquid() {
  return new LanguageSupport(LiquidLanguage, [liquidCompletion])
}
