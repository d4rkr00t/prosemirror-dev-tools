import React from "react";
import JSONTree from "./json-tree";
import diffPatcher from "jsondiffpatch";
import styled from "styled-components";
import stringify from "javascript-stringify";

const diff = diffPatcher.create({
  arrays: { detectMove: false },
  textDiff: { minLength: 1 }
});

const Updated = styled.span`
  color: rgb(197, 142, 150);
`;

const White = styled.span`
  color: #fff59d;
`;

const Deleted = styled.span`
  display: inline-block;
  background: #FFF9C4;
  color: #D32F2F;
  padding: 1px 3px 2px;
  text-indent: 0;
  text-decoration: line-through;
  min-height: 1ex;
`;

const Added = styled.span`
  display: inline-block;
  background: #FFF9C4;
  color: #2E7D32;
  padding: 1px 3px 2px;
  text-indent: 0;
  min-height: 1ex;
`;

const Equal = styled.div`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  color: #FFA2B1;
  font-size: 14px;
`;

function postprocessValue(value) {
  if (value && value._t === "a") {
    const res = {};
    for (let key in value) {
      if (key !== "_t") {
        if (key[0] === "_" && !value[key.substr(1)]) {
          res[key.substr(1)] = value[key];
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

function labelRenderer(raw) {
  return raw[0];
}

function stringifyAndShrink(val) {
  if (val === null) {
    return "null";
  }

  const str = stringify(val);
  if (typeof str === "undefined") {
    return "undefined";
  }

  return str.length > 22 ? `${str.substr(0, 15)}…${str.substr(-5)}` : str;
}

function getValueString(raw) {
  if (typeof raw === "string") {
    return raw;
  }
  return stringifyAndShrink(raw);
}

function replaceSpacesWithNonBreakingSpace(value) {
  return value.replace(/\s/gm, " ");
}

function parseTextDiff(textDiff) {
  const diffByLines = textDiff.split(/\n/gm);
  const matches = diffByLines[0].match(/@@ -(\d+,\d+) \+(\d+,\d+) @@/);

  if (diffByLines.length === 6) {
    return [
      { raw: diffByLines[1].substr(1) },
      { delete: diffByLines[2].substr(1), add: diffByLines[3].substr(1) },
      { raw: diffByLines[4].substr(1) }
    ];
  }

  if (diffByLines.length <= 5) {
    const type = diffByLines[2].startsWith("-") ? "delete" : "add";
    return [
      { raw: diffByLines[1] },
      { [type]: replaceSpacesWithNonBreakingSpace(diffByLines[2].substr(1)) },
      { raw: diffByLines[3].substr(1) }
    ];
  }
}

function valueRenderer(raw, _, key) {
  if (Array.isArray(raw)) {
    if (raw.length === 1) {
      return <Added>{getValueString(raw[0])}</Added>;
    }

    if (raw.length === 2) {
      return (
        <Updated>
          <Deleted>{getValueString(raw[0])}</Deleted>
          {" "}
          =&gt;
          {" "}
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
          "{parseTextDiff(raw[0]).map(item => {
            if (item.raw) return <White key={item.raw}>{item.raw}</White>;
            if (item.add && item.delete) {
              return (
                <Updated key={item.delete + item.add}>
                  [<Deleted>{item.delete}</Deleted>
                  {" "}
                  =&gt;
                  {" "}
                  <Added>{item.add}</Added>]
                </Updated>
              );
            }
            if (item.delete) {
              return <Deleted key={item.delete}>{item.delete}</Deleted>;
            }

            if (item.add) {
              return <Added key={item.add}>{item.add}</Added>;
            }
          })}
          "
        </Updated>
      );
    }
  }

  return "" + raw;
}

export function itemsCountString(count) {
  return `${count}`;
}

export function getItemString(type, value, defaultView) {
  switch (type) {
    case "Object":
      return <span>{"{…}"}</span>;
    default:
      return defaultView;
  }
}

export default function JSONDiff(props) {
  if (!props.current || !props.prev) return null;

  const delta = diff.diff(props.prev, props.current);

  if (!delta) {
    return <Equal>docs are equal</Equal>;
  }

  return (
    <JSONTree
      data={delta}
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
