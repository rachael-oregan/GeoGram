'use strict';

var React = require('react-native');
var {
  AsyncStorage,
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  Navigator,
  TouchableOpacity
} = React;

var FBLogin = require('react-native-facebook-login');
var GeoImage = require('./Recent');
var {width, height} = Dimensions.get('window');
var _ = require('underscore');

var Interests = React.createClass({

  getInitialState() {
    return {
      currentScreenWidth: width,
      currentScreenHeight: height,
      user: null,
      userLikes: null,
      pageCategories: null,
      interests: [],
      interestedImages: null
    }
  },

  componentDidMount() {
  console.log("SHIT")
  console.log(this.state)
    if (this.state.user) {
    console.log("Someone logged in")
      fetchUserLikes(this.state.user)
      fetchPageCategories(this.state.userLikes.pageId)
      mapCategoriesToInterests(this.state.pageCategories.category)
    }
    //var _this = this;
    //setInterval(function(){console.log(_this.state.user, _this.state.userLikes)}, 5000)
  },

  fetchUserLikes(user) {
  console.log("userLikes")
    var api = `https://graph.facebook.com/v2.5/${user.profile.id}/likes?access_token=${user.token}`;

      fetch(api)
        .then((response) => response.json())
        .then((responseData) => {
          this.setState({
            userLikes : {
              pageId : responseData.data.id
            },
          });
        })
        .done();
  },

  fetchPageCategories(pageId) {
  console.log("pageCategories")
    //for each id get the category and store into pageCategories
    var userToken = this.state.user.token
    var api = `https://graph.facebook.com/v2.5/pageId/?fields=category&access_token=${userToken}`;

    fetch(api)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          pageCategories : {
            category : responseData.data.category
          },
        });
      })
      .done();
  },

  mapPageCategoriesToInterests(pageCategories) {
  console.log("mapPageCategories")
    for (var i = 0; i < this.pageCategories.length; i++) {
      //get rid of '/' and spaces from page categories
      var delimiters = ['/', ' '];
      var splittedArray = this.pageCategories[i].category.Split(delimiters)
      for (var j = 0; j < splittedArray.length; j++) {
        if (_.findWhere(this.state.interests, splittedArray[j]) == null) {
          this.state.interests.push(splittedArray[j]);
        }
      }
    }
  },

  calculatedSize() {
    var size = this.state.currentScreenWidth / 3
    return {width: size, height: size}
  },

  renderRows(images){
    return images.map((uri) => {
      return (
        <Image
          key={uri.id}
          style={[styles.image, this.calculatedSize()]}
          source={{uri: uri.images.thumbnail.url}}
        />
      )
    })
  },

  renderImages(){
     return _.chunk(this.state.interestedImages, 3).map((imagesForRow) => {
      return (
        <View style={styles.row} key={imagesForRow[0].id}>
          {this.renderRow(imagesForRow)}
        </View>
        )
      })
  },
   componentWillReceiveProps: function() {
     console.log("GAY NUTS");
   },
  render: function() {
  console.log("RENDER")
    if(this.state.user == null) return this.renderFBLogin();
    var _this = this;
    console.log(_this.state.interests)

    for (var i = 0; i < GeoImage.id.length; i++){
      for (var j = 0; j < _this.state.interests.length; j++) {
        //GeoImage should have a list of images from current location
        //then filter out the ones for each interest
        _this.state.interestedImages = GeoImage[i].data.tags[_this.state.interests[j]]
      }
    }
    return (
      <View>
        {_this.renderImages()}
      </View>
    );

  },
  renderFBLogin: function(){
  var _this = this;
          return (
            <View>
              <FBLogin style={{ marginBottom: 10, }}
                  permissions={["email","user_friends", "user_likes"]}
                  onLogin={function(data){
                    console.log("Logged in!");
                    console.log(data);
                    AsyncStorage.setItem('fb_user', JSON.stringify({token: data.token, id: data.profile.id}),
                    function() {console.log(AsyncStorage.getItem('fb_user'))})
                    _this.setState({ user : data });
                    _this.getUserLikes(_this.state.user)
                  }}
                  onLogout={function(){
                    console.log("Logged out.");
                    _this.setState({ user : null });
                  }}
                  onLoginFound={function(data){
                    console.log("Existing login found.");
                    console.log(data);
                    _this.setState({ user : data });
                    _this.getUserLikes(_this.state.user)
                  }}
                  onLoginNotFound={function(){
                    console.log("No user logged in.");
                    _this.setState({ user : null });
                  }}
                  onError={function(data){
                    console.log("ERROR");
                    console.log(data);
                  }}
                  onCancel={function(){
                    console.log("User cancelled.");
                  }}
                  onPermissionsMissing={function(data){
                    console.log("Check permissions!");
                    console.log(data);
                  }}
              />
            </View>
          );
        }
});

var styles = StyleSheet.create({

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },

  image: {
  }
});

module.exports = Interests;