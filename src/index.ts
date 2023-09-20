import {parser} from "./syntax.grammar"
import {parseMixed} from "@lezer/common"
import {htmlLanguage, html} from "@codemirror/lang-html"
import {LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, delimitedIndent, TreeIndentContext} from "@codemirror/language"
import {highlight} from "./highlight"
import {liquidCompletions} from "./autocompletion"

export const LiquidLanguage = LRLanguage.define({
  parser: parser.configure({
    wrap: parseMixed(node => node.type.isTop ? {
      parser: htmlLanguage.parser,
      overlay: n => n.name == "Text" || n.name == "RawText"
    } : null),
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

export function Liquid() {
  return new LanguageSupport(LiquidLanguage, [
    ...liquidCompletions.map(autocomplete => LiquidLanguage.data.of({autocomplete})),
    htmlLanguage.data.of({closeBrackets: {brackets: "(['\""}}),
    html().support,
  ])
}
