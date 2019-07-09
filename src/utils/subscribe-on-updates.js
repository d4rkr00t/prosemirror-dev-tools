export default function subscribeOnUpdates(editorView, callback) {
  const dispatch = (
    editorView._props.dispatchTransaction || editorView.dispatch
  ).bind(editorView);

  const handler = function(tr) {
    const oldState = editorView.state;
    dispatch(tr);
    callback(tr, oldState, editorView.state);
  };

  if (editorView._props.dispatchTransaction) {
    editorView._props.dispatchTransaction = handler;
  } else {
    editorView.dispatch = handler;
  }
}
