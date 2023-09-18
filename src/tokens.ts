import {ExternalTokenizer} from "@lezer/lr"
import { endcommentTagStart, endrawTagStart, CommentText, RawText} from "./syntax.grammar.terms"

const enum Ch {
  BraceL = 123, Percent = 37, Dash = 45, Hash = 35,
  Space = 32, Newline = 10, Tab = 9,
  e = 101, n = 110, d = 100
}

function wordChar(code: number) {
  return code >= 65 && code <= 90 || code >= 97 && code <= 122
}

function rawTokenizer(endTag: string, text: number, tagStart: number) {
  return new ExternalTokenizer(input => {
    let start = input.pos
    for (;;) {
      let {next} = input
      if (next == Ch.BraceL && input.peek(1) == Ch.Percent) {
        let scan = 2
        if (input.peek(scan) == Ch.Dash) scan++
        const tagStartLength = scan
        for (;; scan++) {
          let ch = input.peek(scan)
          if (ch != Ch.Space && ch != Ch.Tab) break
        }
        let word = ""
        for (;; scan++) {
          let next = input.peek(scan)
          if (!wordChar(next)) break
          word += String.fromCharCode(next)
        }
        if (word == endTag) {
          if (input.pos > start) break
          input.acceptToken(tagStart, tagStartLength)
          break
        }
      } else if (next < 0) {
        break
      }
      input.advance()
    }
    if (input.pos > start) {
      input.acceptToken(text)
    }
  })
}

export const raw = rawTokenizer("endraw", RawText, endrawTagStart)
export const comment = rawTokenizer("endcomment", CommentText, endcommentTagStart)
