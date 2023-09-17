import { htmlCompletionSource } from "@codemirror/lang-html"
import {autocompletion, ifIn, completeFromList} from "@codemirror/autocomplete"

const TagNames = [
  "assign", "increment", "decrement", "capture",
  "cycle", "echo", "liquid",
  "if", "unless", "case",
  "for", "tablerow",
  "include", "layout", "render", "block",
  "#", "raw", "endraw", "comment", "endcomment",
]
const FilterNames = [
  'escape', 'escape_once', 'newline_to_br', 'strip_html',
  'abs', 'at_least', 'at_most', 'ceil', 'divided_by', 'floor', 'minus', 'modulo', 'times', 'round', 'plus',
  'url_decode', 'url_encode',
  'join', 'last', 'first', 'reverse', 'sort', 'sort_natural', 'size', 'map', 'compact', 'concat', 'push', 'slice', 'where', 'uniq', 'sample',
  'date',
  'append', 'prepend', 'lstrip', 'downcase', 'upcase', 'remove', 'remove_first', 'remove_last', 'rstrip', 'split', 'strip', 'strip_newlines', 'capitalize', 'replace', 'replace_first', 'replace_last', 'truncate', 'truncatewords',
  'json', 'raw', 'default'
]

const tagNameCompletions = [
  ifCompletion(["TagName"], TagNames, "class"),
  ifCompletion(["CaptureBlock"], ["endcapture"], "class"),
  ifCompletion(["ForBlock"], ["break", "continue", "endfor"], "class"),
  ifCompletion(["IfBlock"], [ "elsif", "else", "endif", ], "class"),
  ifCompletion(["UnlessBlock"], [ "elsif", "else", "endunless", ], "class"),
  ifCompletion(["CaseBlock"], [  "when", "endcase", ], "class"),
  ifCompletion(["TableRowBlock"], [  "endtablerow", ], "class"),
]

const argumentCompletions = [
  ifCompletion(["ForTag"], ["reversed", "limit", "offset"], "property"),
  ifCompletion(["IncludeTag", "RenderTag", "LayoutTag"], ["with"], "keyword"),
  ifCompletion(["TableRowTag"], ["offset", "limit", "cols"], "keyword"),
]

const filterNameCompletion = ifCompletion(["FilterName"], FilterNames, "function")

const valueCompletion = ifCompletion(["VariableName"], ["nil", "null", "false", "true", "empty", "blank"], "keyword") 

function ifCompletion(nodes: string[], tagNames: string[], type: string) {
  return ifIn(nodes, completeFromList(tagNames.map(tagName => ({label: tagName, type}))))
}

export const liquidCompletion = autocompletion({
  override: [
    ...tagNameCompletions,
    ...argumentCompletions,
    filterNameCompletion,
    valueCompletion,
    ifIn(["HTML"], htmlCompletionSource)]
})
