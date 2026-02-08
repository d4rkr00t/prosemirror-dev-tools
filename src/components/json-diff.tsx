import React from "react";
import { css } from "@compiled/react";
import JSONTree from "./json-tree";
import theme from "../theme";

const updatedStyles = css({
  color: theme.main,
});
const Updated = ({ children }: { children: React.ReactNode }) => (
  <span css={updatedStyles}>{children}</span>
);

const whiteStyles = css({
  color: theme.text,
});
const White = ({ children }: { children: React.ReactNode }) => (
  <span css={whiteStyles}>{children}</span>
);

const deletedStyles = css({
  display: "inline-block",
  background: theme.lightYellow,
  color: theme.lightPink,
  padding: "1px 3px 2px",
  textIndent: 0,
  textDecoration: "line-through",
  minHeight: "1ex",
});
const Deleted = ({ children }: { children: React.ReactNode }) => (
  <span css={deletedStyles}>{children}</span>
);

const addedStyles = css({
  display: "inline-block",
  background: theme.lightYellow,
  color: theme.darkGreen,
  padding: "1px 3px 2px",
  textIndent: 0,
  minHeight: "1ex",
});
const Added = ({ children }: { children: React.ReactNode }) => (
  <span css={addedStyles}>{children}</span>
);

function postprocessValue(value: Record<string, any>) {
  if (value && value._t === "a") {
    const res: Record<string, any> = {};
    for (const key in value) {
      if (key !== "_t") {
        if (key[0] === "_" && !value[key.substring(1)]) {
          res[key.substring(1)] = value[key];
        } else if (value["_" + key]) {
          res[key] = [value["_" + key][0], value[key][0]];
        } else if (!value["_" + key] && key[0] !== "_") {
          res[key] = value[key];
        }
      }
    }

    return res;
  }
  return value;
}

function labelRenderer(raw: Array<string | number>) {
  return raw[0];
}

function stringifyAndShrink(val: null | object) {
  if (val === null) {
    return "null";
  }

  const str = JSON.stringify(val);
  if (typeof str === "undefined") {
    return "undefined";
  }

  return str.length > 22 ? `${str.substr(0, 15)}…${str.substr(-5)}` : str;
}

function getValueString(raw: string | object | null) {
  if (typeof raw === "string") {
    return raw;
  }
  return stringifyAndShrink(raw);
}

function replaceSpacesWithNonBreakingSpace(value: string) {
  return value.replace(/\s/gm, " ");
}

function parseTextDiff(textDiff: string) {
  const diffByLines = textDiff.split(/\n/gm).slice(1);

  return diffByLines.map((line) => {
    const type = line.startsWith("-")
      ? "delete"
      : line.startsWith("+")
      ? "add"
      : "raw";

    return { [type]: replaceSpacesWithNonBreakingSpace(line.substr(1)) };
  });
}

function valueRenderer(raw: Array<any> | string) {
  if (Array.isArray(raw)) {
    if (raw.length === 1) {
      return <Added>{getValueString(raw[0])}</Added>;
    }

    if (raw.length === 2) {
      return (
        <Updated>
          <Deleted>{getValueString(raw[0])}</Deleted> =&gt;{" "}
          <Added>{getValueString(raw[1])}</Added>
        </Updated>
      );
    }

    if (raw.length === 3 && raw[1] === 0 && raw[2] === 0) {
      return <Deleted>{getValueString(raw[0])}</Deleted>;
    }

    if (raw.length === 3 && raw[2] === 2) {
      return (
        <Updated>
          &quot;
          {parseTextDiff(raw[0]).map((item) => {
            if (item.delete) {
              return (
                <Deleted key={item.delete + "delete"}>{item.delete}</Deleted>
              );
            }

            if (item.add) {
              return <Added key={item.add + "add"}>{item.add}</Added>;
            }

            return <White key={item.raw + "raw"}>{item.raw}</White>;
          })}
          &quot;
        </Updated>
      );
    }
  }

  return "" + raw;
}

export function itemsCountString(count: number) {
  return `${count}`;
}

export function getItemString(
  type: string,
  _value: unknown,
  defaultView: unknown,
  keysCount: string
) {
  switch (type) {
    case "Object":
      return <span>{"{…}"}</span>;
    default:
      return (
        <span>
          <>
            {defaultView} {keysCount}
          </>
        </span>
      );
  }
}

export default function JSONDiff(props: { delta: any }) {
  if (!props.delta) return null;

  return (
    <JSONTree
      data={props.delta}
      hideRoot
      postprocessValue={postprocessValue}
      labelRenderer={labelRenderer}
      valueRenderer={valueRenderer}
      isCustomNode={Array.isArray}
      getItemString={getItemString}
      shouldExpandNode={() => true}
    />
  );
}
