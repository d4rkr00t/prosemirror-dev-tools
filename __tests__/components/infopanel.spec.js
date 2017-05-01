import React from "react";
import renderer from "react-test-renderer";
import {InfoPanel} from "../../src/components/info-panel";

test('InfoPanel renders when active', () => {
     let info = renderer.create(<InfoPanel params ='white'/>).toJSON();
     expect(info).toMatchSnapshot();
  });
