'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Component,
  View,
  ScrollView,
  StyleSheet,
  Navigator
} = React;

var ScrollableTabView = require('react-native-scrollable-tab-view');
var Recent = require('./components/Recent');
var Interests = require('./components/Interests');
var Following = require('./components/Following');
var HandleRotation = require('./components/HandleRotation');

var InstaGo = React.createClass({

  render: function() {
    return (
      <ScrollableTabView
      tabBarBackgroundColor='purple'
      tabBarActiveTextColor='white'
      tabBarUnderlineColor='white'
      tabBarInactiveTextColor="grey">
        <ScrollView onLayout={this.HandleRotation} tabLabel="Recent">
            <Recent />
        </ScrollView>
        <ScrollView onLayout={this.HandleRotation} tabLabel="Interests">
            <Interests />
        </ScrollView>
        <ScrollView onLayout={this.HandleRotation} tabLabel="Following">
            <Following />
        </ScrollView>
      </ScrollableTabView>
    );
  }
});

AppRegistry.registerComponent('InstaGo', () => InstaGo);
