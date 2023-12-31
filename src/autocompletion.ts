import {CompletionSource, Completion, pickedCompletion, insertCompletionText, autocompletion, ifIn, ifNotIn, completeFromList} from "@codemirror/autocomplete"
import {EditorView} from "@codemirror/view"
import {EditorSelection, SelectionRange} from "@codemirror/state"

const TagNames = [
  "assign", "increment", "decrement", "capture",
  "cycle", "echo", "liquid",
  "if", "unless", "case",
  "for", "tablerow",
  "include", "layout", "render", "block",
  "#", "raw", "comment",
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
const BuiltinValues = ["nil", "null", "false", "true", "empty", "blank"]

function tagNameCompletions(tagNames: string[]) {
  return [
    ifTagNameCompletion(["TagName"], tagNames, "class"),
    ifTagNameCompletion(["CaptureBlock"], ["endcapture"], "class"),
    ifTagNameCompletion(["ForBlock"], ["break", "continue", "endfor"], "class"),
    ifTagNameCompletion(["IfBlock"], [ "elsif", "else", "endif", ], "class"),
    ifTagNameCompletion(["UnlessBlock"], [ "elsif", "else", "endunless", ], "class"),
    ifTagNameCompletion(["CaseBlock"], [  "when", "endcase", ], "class"),
    ifTagNameCompletion(["TableRowBlock"], [ "endtablerow", ], "class"),
    ifTagNameCompletion(["CommentBlock"], [ "endcomment", ], "class"),
    ifTagNameCompletion(["RawBlock"], [ "endraw", ], "class"),
  ]
}
const argumentCompletions = [
  ifCompletion(["ForTag"], ["reversed", "limit", "offset"], "property"),
  ifCompletion(["IncludeTag", "RenderTag", "LayoutTag"], ["with"], "keyword"),
  ifCompletion(["TableRowTag"], ["offset", "limit", "cols"], "keyword"),
]

function ifTagNameCompletion(nodes: string[], tagNames: string[], type: string) {
  return ifIn(nodes, completeFromList(tagNames.map(tagName => ({label: tagName, type, apply: (view, completion, from, to) => {
    const appendTagEnd = isNothingAfter(view, to) && !inLiquidTag(view, from)
    const insert = appendTagEnd ? `${tagName} %}` : tagName
    view.dispatch(view.state.update({
      ...insertCompletionText(view.state, insert, from, to),
      annotations: pickedCompletion.of(completion)
    }))
    if (appendTagEnd) {
      const cursor = view.state.selection.main;
      view.dispatch({selection: view.moveByGroup(cursor, false)})
    }
  }}))))
}

function ifCompletion(nodes: string[], tagNames: string[], type: string) {
  return ifIn(nodes, completeFromList(tagNames.map(tagName => ({label: tagName, type}))))
}

function inLiquidTag(view: EditorView, begin: number) {
  let str = ''
  for (let iter = view.state.doc.iterRange(begin, 0); !iter.next().done;) {
    str = iter.value + str
    if (str.slice(0, 2) === "{%") {
      return str.match(/^{%-?\s*liquid\s+/i)
    }
  }
  return false
}

function isNothingAfter(view: EditorView, begin: number) {
  for (let iter = view.state.doc.iterRange(begin); !iter.next().done;) {
    if (["\t", " "].includes(iter.value)) continue
    else if (iter.lineBreak) return true
    else return false
  }
  return true
}

export interface LiquidLanguageAutoCompletionOptions {
  // additional tag names
  tagNames?: string[]
  // additional filter names
  filterNames?: string[]
  // variable names for autocompletiokn
  variableNames?: string[]
}
export function liquidCompletions({ tagNames = [], filterNames = [], variableNames = []}: LiquidLanguageAutoCompletionOptions = {}): CompletionSource[] {
  variableNames = variableNames.map(name => /^[a-zA-Z_]\w*$/.test(name) ? name : `["${name}"]`)
  return [
    ...tagNameCompletions([...TagNames, ...tagNames]),
    ...argumentCompletions,
    ifCompletion(["FilterName"], [...FilterNames, ...filterNames], "function"),
    ifCompletion(["VariableName"], BuiltinValues, "keyword"),
    ifCompletion(["VariableName"], variableNames, "variable"),
  ]
}
