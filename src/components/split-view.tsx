import React from "react";
import { css } from "@compiled/react";
import theme from "../theme";

export const SplitView: React.FC = ({ children }) => (
  <div
    css={{
      display: "flex",
      height: "100%",
    }}
  >
    {children}
  </div>
);

type SplitViewColProps = {
  grow?: boolean;
  maxWidth?: number;
  minWidth?: number;
  noPaddings?: boolean;
  sep?: boolean;
};

const splitViewColStyles = css({
  boxSizing: "border-box",
  height: "100%",
  overflow: "scroll",
  borderLeft: "none",
  padding: "16px 18px 18px",
});
const splitViewColGrowStyles = css({
  flexGrow: 1,
});
const splitViewColSepStyles = css({
  borderLeft: "1px solid " + theme.main20,
});
const splitViewColNoPaddingStyles = css({
  padding: "0",
});
export const SplitViewCol: React.FC<SplitViewColProps> = ({
  children,
  sep,
  grow,
  noPaddings,
  minWidth,
  maxWidth,
}) => {
  return (
    <div
      css={[
        splitViewColStyles,
        sep && splitViewColSepStyles,
        grow && splitViewColGrowStyles,
        noPaddings && splitViewColNoPaddingStyles,
        {
          minWidth: minWidth ? `${minWidth}px` : `none`,
          maxWidth: maxWidth ? `${maxWidth}px` : `none`,
        },
      ]}
    >
      {children}
    </div>
  );
};
