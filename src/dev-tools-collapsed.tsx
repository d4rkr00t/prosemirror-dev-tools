import React, { MouseEventHandler } from "react";
import { css } from "@compiled/react";
import theme from "./theme";

const floatingButtonStyles = css({
  appearance: "none",
  position: "fixed",
  bottom: "16px",
  right: "16px",
  background: theme.mainBg,
  boxShadow: `0 0 30px ${theme.black30}`,
  borderRadius: "50%",
  padding: "4px 6px",
  transition: "opacity 0.3s",
  border: "none",
  zIndex: 99999,

  "&:hover": {
    opacity: 0.7,
    cursor: "pointer",
  },

  "& svg": {
    width: "34px",
    height: "34px",
    position: "relative",
    bottom: "-2px",
  },
});

type DevToolsCollapsedProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
};
export default function DevToolsCollapsed(props: DevToolsCollapsedProps) {
  return (
    <button
      data-test-id="__prosemirror_devtools_collapsed_button__"
      css={floatingButtonStyles}
      onClick={props.onClick}
    >
      <svg
        width="530"
        height="530"
        viewBox="0 0 530 530"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <title>prosemirror</title>
        <desc>Created using Figma</desc>
        <use xlinkHref="#a" transform="matrix(2 0 0 2 118 116)" fill="#FFF" />
        <use
          xlinkHref="#b"
          transform="rotate(16 59.054 420.192) scale(2)"
          fill="#FFF"
        />
        <use
          xlinkHref="#c"
          transform="matrix(2 0 0 2 154.024 141.58)"
          fill="#363755"
        />
        <use xlinkHref="#d" transform="matrix(2 0 0 2 220 334.8)" fill="#FFF" />
        <use
          xlinkHref="#e"
          transform="matrix(2 0 0 2 218.826 262.052)"
          fill="#363755"
        />
        <use
          xlinkHref="#f"
          transform="matrix(2 0 0 2 197.108 184.998)"
          fill="#FFF"
        />
        <use
          xlinkHref="#g"
          transform="matrix(2 0 0 2 221.8 216)"
          fill="#363755"
        />
        <defs>
          <path
            id="a"
            d="M73.5 0C32.859 0 0 32.859 0 73.5S32.859 147 73.5 147 147 114.141 147 73.5 114.069 0 73.5 0z"
          />
          <path
            id="b"
            d="M193.601 107.116c0-13.376 8.238-23.91 20.619-31.153-2.244-7.447-5.19-14.6-8.824-21.32-13.886 3.633-25.12-1.799-34.568-11.26-9.449-9.437-12.344-20.672-8.709-34.571A111.362 111.362 0 0 0 140.799 0c-7.243 12.37-20.339 20.594-33.689 20.594-13.363 0-26.446-8.225-33.701-20.594A110.888 110.888 0 0 0 52.1 8.812c3.634 13.9.753 25.134-8.721 34.57-9.436 9.462-20.67 14.894-34.569 11.26A112.178 112.178 0 0 0 0 75.963c12.369 7.243 20.593 17.777 20.593 31.153 0 13.352-8.224 26.448-20.593 33.704a113.338 113.338 0 0 0 8.811 21.321c13.899-3.634 25.133-.752 34.569 8.697 9.448 9.462 12.355 20.696 8.721 34.57a112.653 112.653 0 0 0 21.32 8.837c7.243-12.407 20.338-20.619 33.702-20.619 13.35 0 26.446 8.225 33.701 20.619a114.22 114.22 0 0 0 21.32-8.837c-3.634-13.874-.752-25.108 8.709-34.57 9.449-9.437 20.683-14.869 34.569-11.26a112.343 112.343 0 0 0 8.823-21.321c-12.406-7.256-20.644-17.789-20.644-31.141zm-86.491 46.57c-25.732 0-46.58-20.849-46.58-46.57 0-25.733 20.86-46.595 46.58-46.595 25.732 0 46.567 20.875 46.567 46.595 0 25.734-20.835 46.57-46.567 46.57z"
          />
          <path
            id="c"
            d="M98.088 49.91c-6.9 83.9 10.8 103.401 10.8 103.401s-55.1 5.499-82.7-13.401c-30.5-20.9-26-67.5-25.9-94.6.1-28.4 25.6-45.8 49.9-45.3 29.1.5 50.2 21.6 47.9 49.9z"
          />
          <path
            id="d"
            d="M.1.1c12.2 33.3 22.5 42.7 40 55.2 25.3 18 36.6 17.5 76.3 41C78.1 60.3 30.8 45.7 0 0l.1.1z"
          />
          <path
            id="e"
            d="M.687 36.474c3 13.3 17.9 29.9 30.4 41.6 24.8 23.2 42 22.4 86 54.7-18.2-51.8-18.8-62-43.5-106.1-24.7-44-67.6-20.3-67.6-20.3s-8.4 16.6-5.3 29.9v.2z"
          />
          <path
            id="f"
            d="M38.346 11.5s-4-11.6-18-11.5c-30 .2-28.8 52.1 16.9 52 39.6-.1 39.2-49.4 16.1-49.6-10.2-.2-15 9.1-15 9.1z"
          />
          <path
            id="g"
            d="M26.5 15c10.8 0 2 14.9-.6 20.9-1.8-8.4-10.2-20.9.6-20.9zM10.2.1C4.6.1 0 4.6 0 10.3c0 5.6 4.5 10.2 10.2 10.2 5.6 0 10.2-4.5 10.2-10.2C20.4 4.7 15.9.1 10.2.1zM40.7 0c-4.8 0-8.8 4.5-8.8 10.2 0 5.6 3.9 10.2 8.8 10.2 4.8 0 8.8-4.5 8.8-10.2C49.5 4.6 45.6 0 40.7 0z"
          />
        </defs>
      </svg>
    </button>
  );
}
