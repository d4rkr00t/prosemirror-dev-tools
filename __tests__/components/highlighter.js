import React from "react";
import renderer from "react-test-renderer";

test.only('Item Highlight when child present', () => {
  const module = require('../../src/components/highlighter');
  var highligthed = module.Highlighter({children:'1'});
  let tree = renderer.create(highligthed).toJSON();
  expect(tree).toMatchSnapshot();
});
