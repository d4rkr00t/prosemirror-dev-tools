import type { EditorState, Transaction } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";

type subsctibeCallback = (
  tr: Transaction,
  oldState: EditorState,
  newState: EditorState,
) => void;
export default function subscribeOnUpdates(
  editorView: EditorView,
  callback: subsctibeCallback,
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const maybeDispatchTransaction = editorView._props.dispatchTransaction;
  const dispatch = (maybeDispatchTransaction || editorView.dispatch).bind(
    editorView,
  );

  const handler = function (tr: Transaction) {
    const oldState = editorView.state;
    dispatch(tr);
    callback(tr, oldState, editorView.state);
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (editorView._props.dispatchTransaction) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    editorView._props.dispatchTransaction = handler;
  } else {
    editorView.dispatch = handler;
  }
}
