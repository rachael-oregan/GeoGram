var secret = require('../constants/secrets');
var React = require('react-native');
var { AsyncStorage } = React;

var GeoImages = {
  ACCESS_TOKEN: secret.ACCESS_TOKEN,

  fetchImages: function (coords, callbacks) {
    AsyncStorage.getItem(`geoimages:${coords.lat},${coords.lng}`, (err, res) => {
      if(res === null) {
         fetch(`https://api.instagram.com/v1/media/search?lat=${coords.lat}&lng=${coords.lng}&access_token=${this.ACCESS_TOKEN}`)
              .then((response) => response.json())
              .then((responseData) => {
                AsyncStorage.setItem(`geoimages:${coords.lat},${coords.lng}`, JSON.stringify(responseData.data), () => {
                  console.log(`WAS NOT THERE, CACHED (key: geoimages:${coords.lat},${coords.lng})`)
                })
                callbacks.success(responseData.data);
                console.log(responseData);
              }).done();
      } else {
        console.log(`IN CACHE (key is geoimages:${coords.lat},${coords.lng}), GETTING`)
        callbacks.success(JSON.parse(res));
      }
    });
  },

  fetchInterestImages: function (user, callbacks) {
     var api = `https://graph.facebook.com/v2.5/${user.profile.id}/likes?access_token=${user.token}`;
     let categoryList = new Set();
     fetch(api)
       .then((response) => response.json())
       .then((responseData) => {

         for(var i = 0; i < responseData.data.length; i++) {
           var pageId = responseData.data[i].id;
           var userToken = user.token
           var api = `https://graph.facebook.com/v2.5/${pageId}/?fields=category&access_token=${userToken}`;
           fetch(api)
             .then((response) => response.json())
             .then((responseData) => {
               var categories = responseData.category.split('/')
               for(var j = 0; j < categories.length; j++) {
                 categories[j] = categories[j].replace(/\s+/g, '');
                 categoryList.add(categories[j]);
               }
               callbacks.success(categoryList);
             }).done();
         }
       }).done();
  }
}

module.exports = GeoImages;