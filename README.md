# InstaGo
An Android [React-Native] (https://facebook.github.io/react-native/) app that allows users to browse Instagram images based on their current location. <br />
The user can also discover Instagram tailored to their interests that are obtained from Facebook.

# Set Up
* Register a new client on [Instagram] (https://www.instagram.com/developer/register/) <br />
  * Visit the following address replacing client id with your own etc.: <br />
    `https://api.instagram.com/oauth/authorize/?client_id=[clientID]&redirect_uri=[redirectURI]&response_type=code`
  * Click Yes to authorise the app.
  * Copy the code value returned
  * Run this command in the terminal: <br />
  `curl -F 'client_id=[clientID]' -F 'client_secret=[clientSecret]' -F 'grant_type=authorization_code' -F 'redirect_uri=[redirectURI]' -F 'code=[code]' https://api.instagram.com/oauth/access_token`
  * The access token should be returned in a JSON object.
* Register a new client on [Facebook] (https://developers.facebook.com/)
  * On the dashboard click choose platform
  * Follow the steps
    * For "Package name" put `com.<your-app-name>` and
    * For "Default Activity Class name" put `com.<your-app-name>.MainActivity`
  * Follow the rest of the steps to get a 28 character key hash.
* Facebook recently released [React-Native SDK] (https://developers.facebook.com/docs/react-native) <br />
  However I used this module at the time [react-native-facebook-login] (https://github.com/magus/react-native-facebook-login)
* The navbar used was [react-native-scrollable-tab-view] (https://github.com/brentvatne/react-native-scrollable-tab-view) <br />

# Demo
![Demo] (https://raw.githubusercontent.com/rachael-oregan/InstaGo/master/images/demo.gif)
