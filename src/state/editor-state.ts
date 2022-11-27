import { atom } from "jotai";
import type { EditorState } from "prosemirror-state";

export const editorStateAtom = atom<EditorState | null>(null);
