import React from "react";
import { useAtom, useAtomValue } from "jotai";
import { devToolsOpenedAtom, devToolsSizeAtom } from "./state/global";
import DevToolsCollapsed from "./dev-tools-collapsed";
import DevToolsExpanded from "./dev-tools-expanded";
import { useResizeDocument } from "./hooks/use-resize-document";
import { useSubscribeToEditorView } from "./hooks/use-subscribe-to-editor-view";
import { useRollbackHistory } from "./hooks/use-rollback-history";

export default function DevTools(props) {
  const [isOpen, setIsOpen] = useAtom(devToolsOpenedAtom);
  const defaultSize = useAtomValue(devToolsSizeAtom);
  const editorView = props.editorView;
  const toggleOpen = React.useCallback(() => setIsOpen(!isOpen), [isOpen]);

  useResizeDocument(isOpen, defaultSize);
  useSubscribeToEditorView(editorView, props.diffWorker);

  const rollbackHistory = useRollbackHistory(editorView);

  if (isOpen) {
    return <DevToolsExpanded rollbackHistory={rollbackHistory} />;
  }

  return <DevToolsCollapsed onClick={toggleOpen} />;
}
