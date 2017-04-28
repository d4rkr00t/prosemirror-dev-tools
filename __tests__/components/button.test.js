import React from "react";
import renderer from "react-test-renderer";

describe('Button test',function(){
  var Button = require('../../src/components/button').default
  var input = [{
    isActive: '1',
    theme: 'white05'
  }];

  it('Button renders when active', () => {
    var button = renderer.create(<Button
      params = {input}
    />).toJSON();
    expect(button).toMatchSnapshot();
  });
})