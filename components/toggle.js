'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback
} = React;

var Button = require('react-native-button');

var Toggle = React.createClass({

  getInitialState() {
    return({
      enabled: false,
    })
  },

  componentDidMount() {
    console.log(this.props.children)
  },

  toggleEnabled() {
    this.setState({enabled: !this.state.enabled})
  },


  render: function() {
    return (
      <View>
        <Button
           style={{fontSize: 20, color: 'purple', textAlign: 'left',}}
           onPress={this.toggleEnabled}>
          {this.state.enabled ? 'Interests' : 'Interests'}
        </Button>
        <Text>{this.props.children}</Text>
      </View>
    );
  }
});

module.exports = Toggle;