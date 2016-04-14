'use strict';

var React = require('react-native');
var {
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

var _ = require('lodash');
var {width, height} = Dimensions.get('window');
var secret = require('../constants/secrets');
var GeoImageUtils = require('../utils/geoimages');

const ACCESS_TOKEN = secret.ACCESS_TOKEN;

var RecentImages = React.createClass({
  getInitialState() {
    return {
    currentScreenWidth: width,
    currentScreenHeight: height,
    initialPosition: false,
    changedPosition: false,
    watchID: null,
    imageData: [],
    }
   },

  componentDidMount() {
    this.getPosition();
  },

  getPosition() {
    navigator.geolocation.getCurrentPosition(
      (initialPosition) => this.setState({initialPosition}),
      (error) => console.log(error),
      {enableHighAccuracy: true, timeout: 2000},
    )
    this.watchID = navigator.geolocation.watchPosition(
      (changedPosition) => this.setState({changedPosition}),
      (error) => console.log(error),
      {enableHighAccuracy: true, timeout: 2000},
    )
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevState.initialPosition !== this.state.initialPosition) {
      var lat = this.state.initialPosition.coords.latitude;
      var lng = this.state.initialPosition.coords.longitude;
      this.fetchData(lat, lng);
    }
    else if (prevState.changedPosition &&
      prevState.changedPosition.coords.latitude !==
      this.state.changedPosition.coords.latitude &&
      prevState.changedPosition.coords.longitude !==
      this.state.changedPosition.coords.longitude) {
        var lat = this.state.changedPosition.coords.latitude;
        var lng = this.state.changedPosition.coords.longitude;
        this.fetchData(lat, lng);
    }
  },

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID)
  },

  fetchData(lat, lng) {
    var _this = this;
    GeoImageUtils.fetchImages({lng: lng, lat: lat}, {
      success: function (imageList) {
        _this.setState({imageData: imageList});
      }
    })
  },

  calculatedSize() {
    var size = this.state.currentScreenWidth / 3
    return {width: size, height: size}
  },

  renderRow(images) {
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

  renderImages() {
    return _.chunk(this.state.imageData, 3).map((imagesForRow) => {
      return (
        <View style={styles.row} key={imagesForRow[0].id}>
          {this.renderRow(imagesForRow)}
        </View>
      )
    })
  },

  render: function() {
    return (
     <View>
       {this.renderImages()}
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

module.exports = RecentImages;