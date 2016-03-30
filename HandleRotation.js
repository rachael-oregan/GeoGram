'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Component,
  Dimensions
} = React;

var {width, height} = Dimensions.get('window');

var HandleRotation = React.createClass({

  getInitialState() {
    return {
    currentScreenWidth: width,
    currentScreenHeight: height,
    }
  },

  handleRotation(event) {
    var layout = event.nativeEvent.layout
    this.setState({currentScreenWidth: layout.width, currentScreenHeight: layout.height })
  },

  render: function() {
    return (
      this.handleRotation()
    );
  }
});

module.exports = HandleRotation;