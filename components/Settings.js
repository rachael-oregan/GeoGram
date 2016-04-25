'use strict';

var React = require('react-native');
var {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} = React;

var FBLogin = require('react-native-facebook-login');
var GeoImageUtils = require('../utils/geoimages');
var Accordion = require('react-native-accordion');
var Toggle = require('./toggle');

var Settings = React.createClass({

  getInitialState() {
    return {
      user: null,
      categories: new Set(),
    }
  },

  componentDidMount() {
    var _this = this;
    AsyncStorage.getItem('fb:user', (err,res) => {
      if(res !== null) {
        console.log(res);
        var user = JSON.parse(res);
        _this.setState({
          user: user
        });
        _this.getCategories()
      }
    })
  },

  getCategories() {
  var _this = this;
    GeoImageUtils.fetchInterestImages(_this.state.user,{
      success: function(categoryList) {
        _this.setState({categories: categoryList})
      }
    });
  },

  renderFBLogin: function(){
    var _this = this;
      return (
        <View>
          <FBLogin style={{ marginBottom: 10, }}
              permissions={["email","user_friends", "user_likes"]}
              onLogin={function(data){
                console.log("Logged in!");
                 AsyncStorage.setItem('fb:user',JSON.stringify(data), () => {
                   console.log("FB USER STORED");
                   _this.setState({ user : data });
                   GeoImageUtils.fetchInterestImages(_this.state.user,{
                     success: function(categoryList) {
                       _this.setState({
                         categories: categoryList
                       })
                     }
                   });
                 });
              }}
              onLogout={function(){
                console.log("Logged out.");
                _this.setState({ user : null });
              }}
              onLoginFound={function(data){
                console.log("Existing login found.");
                _this.setState({ user : data });
                _this.fetchUserLikes(_this.state.user)
              }}
              onLoginNotFound={function(){
                console.log("No user logged in.");
                _this.setState({ user : null });
              }}
              onError={function(data){
                console.log("ERROR");
              }}
              onCancel={function(){
                console.log("User cancelled.");
              }}
              onPermissionsMissing={function(data){
                console.log("Check permissions!");
              }}
          />
        </View>
      );
  },

  render: function() {
    var _this = this;
    return (
      <View>
        <Toggle>{_this.state.categories}</Toggle>
        {(_this.state.user) ? _this.renderFBLogin() : <Text/>}
      </View>
    );
  }
});

var styles = StyleSheet.create({

  container: {
    backgroundColor: '#fff',
    margin:10,
    overflow:'hidden'
  },
});

module.exports = Settings;