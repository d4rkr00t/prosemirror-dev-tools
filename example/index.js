import applyDevTools from "../src";
import "./editor.css";

import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "prosemirror-schema-basic";
import { exampleSetup } from "prosemirror-example-setup";

import plugin from "./empty-plugin";

const plugins = exampleSetup({ schema });
plugins.push(plugin);

const view = new EditorView(document.querySelector("#app"), {
  state: EditorState.create({ schema, plugins })
});

applyDevTools(view);
