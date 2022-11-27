import { atom } from "jotai";
import type { EditorView } from "prosemirror-view";

export const editorViewAtom = atom<EditorView | null>(null);
