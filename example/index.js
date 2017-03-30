import "./editor.css";
import applyDevTools from "../src";

import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { DOMParser } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { exampleSetup } from "prosemirror-example-setup";

const view = new EditorView(document.querySelector("#app"), {
  state: EditorState.create({
    schema,
    plugins: exampleSetup({ schema })
  })
});

applyDevTools(view);
