import {parser} from "./syntax.grammar"
import {parseMixed} from "@lezer/common"
import {htmlLanguage, html} from "@codemirror/lang-html"
import {LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, delimitedIndent, TreeIndentContext} from "@codemirror/language"
import {highlight} from "./highlight"
import {liquidCompletions, LiquidLanguageAutoCompletionOptions} from "./autocompletion"

// "{" will be used to begin tag or output, not close with "}"
const closeBrackets = { brackets: "(['\"" }

export const liquidLanguage = LRLanguage.define({
  name: "liquid",
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Tag: delimitedIndent({closing: "%}"}),
        "UnlessTag ForTag TablerowTag CaptureTag": directiveIndent(/^\s*(\{%-?\s*)?end\w/),
        IfTag: directiveIndent(/^\s*(\{%-?\s*)?(endif|else|elsif)\b/),
        CaseTag: directiveIndent(/^\s*(\{%-?\s*)?(endcase|when)\b/),
      }),
      foldNodeProp.add({
        "IfBlock UnlessBlock ForBlock TablerowBlock CaptureBlock CaseBlock RawBlock CommentBlock": foldInside
      }),
      highlight
    ]
  }),
  languageData: {
    closeBrackets,
    commentTokens: { line: "#", block: { open: "{% comment %}", close: "{% endcomment %}" } },
    indentOnInput: /^\s*{%-?\s*(?:end|elsif|else|when|)$/
  }
})

function directiveIndent(except: RegExp) {
  return (context: TreeIndentContext) => {
    let back = except.test(context.textAfter)
    return context.lineIndent(context.node.from) + (back ? 0 : context.unit)
  }
}

export const liquidHTMLLanguage = liquidLanguage.configure({
    wrap: parseMixed(node => node.type.isTop ? {
      parser: htmlLanguage.parser,
      overlay: n => n.name == "Text" || n.name == "RawText"
    } : null)
}, "liquid")

function liquidCompletionExts(options: LiquidLanguageOptions) {
  return liquidCompletions(options).map(autocomplete => liquidHTMLLanguage.data.of({autocomplete}))
}

export interface LiquidLanguageOptions extends LiquidLanguageAutoCompletionOptions {}

export function Liquid(options: LiquidLanguageOptions) {
  return new LanguageSupport(liquidLanguage, liquidCompletionExts(options))
}

export function LiquidHTML(options: LiquidLanguageOptions) {
  return new LanguageSupport(liquidHTMLLanguage, [
    ...liquidCompletionExts(options),
    htmlLanguage.data.of({ closeBrackets }),
    html().support,
  ])
}
