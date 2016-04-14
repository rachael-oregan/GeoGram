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
var GeoImageUtils = require('../utils/geoimages');
var _ = require('lodash');

var Interests = React.createClass({

  getInitialState() {
    return {
      currentScreenWidth: width,
      currentScreenHeight: height,
      initialPosition: false,
      changedPosition: false,
      watchID: null,
      user: null,
      geoImages: [],
      categories: new Set(),
      interestedImages: []
    }
  },

  componentDidMount() {
     var _this = this;
    AsyncStorage.getItem('fb:user', (err,res) => {
      if(res !== null) {
        console.log("USER GOT");
        console.log(res);
        var user = JSON.parse(res);
        _this.setState({
          user: user
        });
        _this.getPosition();
      }
    })
  },

  componentWillUnmount() {
  var _this = this;
    navigator.geolocation.clearWatch(_this.watchID)
  },


  getPosition() {
    var _this = this;
    navigator.geolocation.getCurrentPosition(
      (initialPosition) => {
        _this.setState({initialPosition})
        console.log("sbasa")
      },
      (error) => console.log(error),
      {enableHighAccuracy: true, timeout: 2000},
    )
    this.watchID = navigator.geolocation.watchPosition(
      (changedPosition) => _this.setState({changedPosition}),
      (error) => console.log(error),
      {enableHighAccuracy: true, timeout: 2000},
    )
  },

  shouldComponentUpdate(prevProps, prevState) {
    if(prevState.changedPosition || prevState.initialPosition ||
    prevState.user !== null || prevState.interestedImages) {
    if (prevState.changedPosition.timestamp) {
      prevState.changedPosition.timestamp = null
      prevState.initialPosition.timestamp = null
    }
      var _this = this.state
      console.log(_this.state)
      console.log(prevState)
      if(JSON.stringify(prevState) === JSON.stringify(_this)) {
        return(false)
      } else {
        return(true)
      }
    } else {return(false)}
  },

  componentDidUpdate(prevProps, prevState) {
    this.getInterestedImages()
    //console.log(this.state)
    //console.log(JSON.stringify(this.state) === JSON.stringify(prevState))
    //console.log(JSON.stringify(this.props) === JSON.stringify(prevProps))
    var _this = this;
    if (prevState.initialPosition !== _this.state.initialPosition) {
    console.log("you serious")
      var lat = _this.state.initialPosition.coords.latitude;
      var lng = _this.state.initialPosition.coords.longitude;
      _this.fetchData(lat, lng);
      _this.getInterestedImages()
    }
    else if (prevState.changedPosition &&
      prevState.changedPosition.coords.latitude !==
      _this.state.changedPosition.coords.latitude &&
      prevState.changedPosition.coords.longitude !==
      _this.state.changedPosition.coords.longitude) {
        console.log("else if")
        var lat = _this.state.changedPosition.coords.latitude;
        var lng = _this.state.changedPosition.coords.longitude;
        _this.fetchData(lat, lng);
        _this.getInterestedImages()
    }
    console.log("BLA")
   },

  fetchData(lat, lng) {
    var _this = this;
    GeoImageUtils.fetchImages({lng: lng, lat: lat}, {
      success: function (imageList) {
         console.log("CHECK2")
        _this.setState({geoImages: imageList});
      }
    });
    GeoImageUtils.fetchInterestImages(_this.state.user,{
      success: function(categoryList) {
        console.log("CHECK")
        _this.setState({
          categories: categoryList
        })
      }
    });
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
  var _this = this;
     return _.chunk(_this.state.interestedImages, 3).map((imagesForRow) => {
      return (
        <View style={styles.row} key={imagesForRow[0].id}>
          {this.renderRows(imagesForRow)}
        </View>
        )
      })
  },

  getInterestedImages() {
    var _this = this;
    var interestedImages = []
    _this.state.categories.add("womensday")
    for (var i = 0; i < _this.state.geoImages.length; i++) {
      let geoTags = new Set(_this.state.geoImages[i].tags)
      let intersection = new Set(
        [..._this.state.categories].filter(x => geoTags.has(x))
      )
      if (intersection.size > 0) {
        interestedImages.push(_this.state.geoImages[i])
      }
     }
     this.setState({
       interestedImages: interestedImages
     })
  },

  render: function() {
    if(this.state.user == null) return this.renderFBLogin();
    var _this = this;
    return (
      <View>
        {this.renderImages()}
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
                    console.log(data);
                    _this.setState({ user : data });
                    _this.fetchUserLikes(_this.state.user)
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