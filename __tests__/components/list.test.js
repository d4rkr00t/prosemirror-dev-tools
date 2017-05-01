import React from "react";
import renderer from "react-test-renderer";

jest.dontMock("../../src/components/list");

test.only("ListItemGroup renders when clicked", () => {
  const module = require("../../src/components/list");
  const component = module.List({
    title: jest.fn(),
    groupTitle: jest.fn(),
    items: ["", "", ["", "", "", ""]]
  });
  let tree = renderer.create(component).toJSON();
  console.log(tree);
  expect(tree).toMatchSnapshot();
});
