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
      console.log('componentDidUpdate')
      if (prevState.position !== this.state.position) {
        console.log('componentIsUpdating')
        this.fetchData();
      }
    },

    componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchID)
    },

    //shouldComponentUpdate(nextProps, nextState) {
    //  var a = (
    //      this.state.position !== nextState.position ||
    //        !_.isEqual(this.state.imageData.sort(), nextState.imageData.sort())
    //    )
    //    console.log(a)
    //    return true
    //},

    fetchData() {
       console.log('')
       console.log(this.state)
       const lat = this.state.position.coords.latitude;
       const lng = this.state.position.coords.longitude;

       fetch(`https://api.instagram.com/v1/media/search?lat=${lat}&lng=${lng}&access_token=${ACCESS_TOKEN}`)
         .then((response) => response.json())
         .then((responseData) => {
           console.log('fetchDataResponse')
           console.log(responseData)
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
  console.log(this.state.imageData)
    return images.map((uri) => {
      console.log(uri.id)
      return (
        <Image
          key={uri.id}
          style={[styles.image, this.calculatedSize()]}
          source={{uri: uri.images.thumbnail.url}}
         />
      )
    })
  },

  renderImagesInGroupsOf(count) {
    return _.chunk(this.state.imageData, IMAGES_PER_ROW).map((imagesForRow) => {
      return (
        <View style={styles.row}>
          {this.renderRow(imagesForRow)}
        </View>
      )
    })
  },

  renderImages() {
    console.log(this.state.imageData)
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