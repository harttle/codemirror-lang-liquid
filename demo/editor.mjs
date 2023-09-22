import {EditorView, basicSetup} from "codemirror"
import {LiquidHTML} from "codemirror-lang-liquid"
import {dracula} from 'thememirror';

const doc = `{% layout "main.liquid" with "dark", url: "/" %}
{%- assign people = "alice, bob, carol" | split: ", " -%}

<ul>
{% for i in (0..2) reversed limit:people.size offset:1 %}
  <li><a href="{{people[i] | prepend: "http://example.com/"}}">
    {{ people[i] | capitalize | append: empty }}
  </a></li>
{% endfor %}
</ul>

{% liquid
  render "footer.liquid" with "dark"
  capture about
    echo "This is a Liquid language demo"
  endcapture
  echo about
%}

{% comment %}
{% assign foo="bar" %}
{% endcomment %}`

const context = {
  foo: 'FOO',
  "space between": "SPACE BETWEEN"
}

new EditorView({
  doc,
  extensions: [basicSetup, LiquidHTML({
    filterNames: ["customFilter"],
    tagNames: ["customTag"],
    variableNames: Object.keys(context)
  }), dracula],
  parent: document.body
})