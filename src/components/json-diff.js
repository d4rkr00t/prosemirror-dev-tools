import React from "react";
import JSONTree from "./json-tree";
import styled from "styled-components";
import stringify from "javascript-stringify";
import InfoPanel from "./info-panel";

const Updated = styled.span`
  color: ${props => props.theme.main};
`;

const White = styled.span`
  color: ${props => props.theme.white};
`;

const Deleted = styled.span`
  display: inline-block;
  background: ${props => props.theme.lightYellow};
  color: ${props => props.theme.lightPink};
  padding: 1px 3px 2px;
  text-indent: 0;
  text-decoration: line-through;
  min-height: 1ex;
`;

const Added = styled.span`
  display: inline-block;
  background: ${props => props.theme.lightYellow};
  color: ${props => props.theme.darkGreen};
  padding: 1px 3px 2px;
  text-indent: 0;
  min-height: 1ex;
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
  const diffByLines = textDiff.split(/\n/gm).slice(1);

  return diffByLines.map(line => {
    const type = line.startsWith("-")
      ? "delete"
      : line.startsWith("+") ? "add" : "raw";

    return { [type]: replaceSpacesWithNonBreakingSpace(line.substr(1)) };
  });
}

function valueRenderer(raw) {
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

export function getItemString(type, value, defaultView, keysCount) {
  switch (type) {
    case "Object":
      return <span>{"{…}"}</span>;
    default:
      return <span>{defaultView} {keysCount}</span>;
  }
}

export default function JSONDiff(props) {
  if (!props.delta) {
    return <InfoPanel>Docs are equal</InfoPanel>;
  }

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
