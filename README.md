# Liquid language package for CodeMirror 6

This is Liquid language package for CodeMirror 6.

## Features

- 

## Principles

1. **Aim for correct syntax**. Top priority is to guarantee valid template is parsed correctly. Tradeoffs can be made for invalid templates.
2. **Standard tags only**. To create better yet simpler lexer, we support only tags listed in shopify/liquid and harttle/liquidjs. Other tags fallback to default tag lexer.
