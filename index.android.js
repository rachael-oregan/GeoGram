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
  ScrollView
} = React;

var _ = require('lodash');
var {width, height} = Dimensions.get('window');
var secret = require('./secrets')

const ACCESS_TOKEN = secret.ACCESS_TOKEN;

var InstaGo = React.createClass({

  getInitialState() {
    return {
      currentScreenWidth: width,
      currentScreenHeight: height,
      position: false,
      watchID: null,
      imageData: [],
    }
  },

  componentDidMount() {
      this.getPosition();
    },

    getPosition() {
      navigator.geolocation.getCurrentPosition(
        (position) => this.setState({position}),
        (error) => console.log(error),
      )
      this.watchID = navigator.geolocation.watchPosition(
        (position) => this.setState({position}),
        (error) => console.log(error),
      )
    },

    componentDidUpdate(prevProps, prevState) {
      if (prevState.position !== this.state.position) {
        this.fetchData();
      }
    },

    componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchID)
    },

    fetchData() {
       const lat = this.state.position.coords.latitude;
       const lng = this.state.position.coords.longitude;

       fetch(`https://api.instagram.com/v1/media/search?lat=${lat}&lng=${lng}&access_token=${ACCESS_TOKEN}`)
         .then((response) => response.json())
         .then((responseData) => {
           this.setState({
             imageData: responseData.data
           });
         })
         .done();
    },

  handleRotation(event) {
    var layout = event.nativeEvent.layout
    this.setState({currentScreenWidth: layout.width, currentScreenHeight: layout.height })
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
      <ScrollView onLayout={this.handleRotation} contentContainerStyle={styles.scrollView}>
        {this.renderImages()}
      </ScrollView>
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

AppRegistry.registerComponent('InstaGo', () => InstaGo);