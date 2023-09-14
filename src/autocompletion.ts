import { htmlCompletionSource } from "@codemirror/lang-html"
import {autocompletion, ifIn, completeFromList} from "@codemirror/autocomplete"

const TagNames = [
  "assign", "increment", "decrement", "capture", "endcapture",
  "cycle", "echo", "liquid",
  "if", "elsif", "endif", "unless", "else", "endunless", "case", "when", "endcase",
  "for", "endfor", "tablerow", "endtablerow",
  "break", "continue",
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
const LiteralValues = ["nil", "null", "false", "true", "empty", "blank"]

export const tagNameCompletion = ifIn(
  ["TagName"],
  completeFromList(TagNames.map(tagName => ({label: tagName, type: "class"})))
)

export const filterNameCompletion = ifIn(
  ["FilterName"],
  completeFromList(FilterNames.map(tagName => ({label: tagName, type: "function"})))
)

export const valueCompletion = ifIn(
  ["VariableName"],
  completeFromList(LiteralValues.map(tagName => ({label: tagName, type: "keyword"})))
)

export const liquidCompletion = autocompletion({
  // override: [tagNameCompletion, filterNameCompletion, valueCompletion, ifIn(["HTML"], htmlCompletionSource)]
  override: [htmlCompletionSource]
})
