import {EditorView, basicSetup} from "codemirror"
import {Liquid} from "../dist"

const doc = `{% assign people = "alice, bob, carol" | split: ", " -%}
{{ foo | size: 3 }}
<ul>
{%- for person in people %}
  <li>
    <a href="{{person | prepend: "http://example.com/"}}">
      {{ person | capitalize }}
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