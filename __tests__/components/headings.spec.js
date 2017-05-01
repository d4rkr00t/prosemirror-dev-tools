import React from "react";
import renderer from "react-test-renderer";
import { Heading, HeadingWithButton, HeadingButton } from "../../src/components/heading";

test('Heading renders without crashing', () => {
    var heading = renderer.create(<Heading/>).toJSON();
    expect(heading).toMatchSnapshot();
  });

test('HeadingWithButton renders without crashing', () => {
    var headingWithButton = renderer.create(<HeadingWithButton/>).toJSON();
    expect(headingWithButton).toMatchSnapshot();
  });

test('HeadingButton renders without crashing', () => {
    var headingButton = renderer.create(<HeadingButton />).toJSON();
    expect(headingButton).toMatchSnapshot();
  });