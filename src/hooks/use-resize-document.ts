import React from "react";

export function useResizeDocument(isOpen: boolean, defaultSize: number) {
  React.useEffect(() => {
    if (!isOpen) {
      document.querySelector("html")!.style.marginBottom = "";
    } else {
      const size = defaultSize * window.innerHeight;
      document.querySelector("html")!.style.marginBottom = `${size}px`;
    }
  }, [defaultSize, isOpen]);
}
