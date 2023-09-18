import {parser} from "./syntax.grammar"
import {parseMixed} from "@lezer/common"
import {html} from "@codemirror/lang-html"
import {Language, LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, delimitedIndent} from "@codemirror/language"
import {highlight} from "./highlight"
import {liquidCompletion} from "./autocompletion"

export const BaseLiquidLanguage = LRLanguage.define({
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
  }
})

const htmlLanguageSupport = html()

export const LiquidLanguage = BaseLiquidLanguage.configure({
  wrap: parseMixed(node => node.type.isTop ? {
    parser: htmlLanguageSupport.language.parser,
    overlay: n => n.name == "Text" || n.name == "RawText"
  } : null)
}, "liquid")

function bracketsSupport(lang: Language) {
  return lang.data.of({closeBrackets: {brackets: "(['\""}})
}

export function Liquid() {
  return new LanguageSupport(LiquidLanguage, [
    liquidCompletion,
    bracketsSupport(htmlLanguageSupport.language),
    bracketsSupport(BaseLiquidLanguage)
  ])
}
