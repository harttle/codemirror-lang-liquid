# Liquid language package for CodeMirror 6

Live demo: https://harttle.land/codemirror-lang-liquid/

## Get Started

```javascript
import {EditorView, basicSetup} from "codemirror"
import {LiquidHTML} from "codemirror-lang-liquid"

const doc = `{% layout "main.liquid" with "dark", url: "/" %}`

new EditorView({
  doc,
  extensions: [basicSetup, LiquidHTML({
    filterNames: ["customFilter"],
    tagNames: ["customTag"],
    variableNames: ["foo", "bar"]
  })],
  parent: document.body
})
```

Demos:

- JavaScript: https://github.com/harttle/codemirror-lang-liquid/tree/main/demo
- React: https://github.com/harttle/codemirror-react-demo

## API

- `Liquid`: `LanguageSupport` for pure Liquid language.
- `LiquidHTML`: `LanguageSupport` for Liquid used to create HTML.

## Contribute

### Build & test

```bash
npm run build
npm test
```

### Build demo page

You'll need to build `codemirror-lang-liquid` first. Then link current project to demo:

```bash
npm link
cd demo && npm link codemirror-lang-liquid && cd ..
```

Build & run demo (in parent directory):

```bash
npm run build:demo
npm run start:demo
```
