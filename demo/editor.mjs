import {EditorView, basicSetup} from "codemirror"
import {Liquid} from "../dist"

const doc = `{% assign people = "alice, bob, carol" | split: ", " -%}
<h1>{{ people | join: empty }}
<ul>
{%- for i in (0..2) reversed limit:people.size offset:1 %}
  <li>
    <a href="{{people[i] | prepend: "http://example.com/"}}">
      {{ people[i] | capitalize }}
   </a>
  </li>
{%- endfor%}
</ul>

{% liquid
  assign favorite_food2 = "pizza"
  assign age2 = 35
  capture about_me2
    echo "I am  and my favorite food is nnn."
  endcapture

  echo about_me2
%}`

let editor = new EditorView({
  doc,
  extensions: [basicSetup, Liquid()],
  parent: document.body
})