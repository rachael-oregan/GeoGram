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
var RecentImages = require('./RecentImages');
var Interests = require('./Interests');
var Following = require('./Following');
var HandleRotation = require('./HandleRotation');

var InstaGo = React.createClass({

  render: function() {
    return (
      <ScrollableTabView
      tabBarBackgroundColor='purple'
      tabBarActiveTextColor='white'
      tabBarUnderlineColor='white'
      tabBarInactiveTextColor="grey">
        <ScrollView onLayout={this.HandleRotation} tabLabel="Recent">
            <RecentImages />
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
