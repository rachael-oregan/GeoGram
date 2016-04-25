[1mdiff --git a/android/app/build.gradle b/android/app/build.gradle[m
[1mindex 5da282b..5a3c494 100644[m
[1m--- a/android/app/build.gradle[m
[1m+++ b/android/app/build.gradle[m
[36m@@ -122,5 +122,4 @@[m [mdependencies {[m
     compile fileTree(dir: "libs", include: ["*.jar"])[m
     compile "com.android.support:appcompat-v7:23.0.1"[m
     compile "com.facebook.react:react-native:0.20.+"[m
[31m-    compile project(':react-native-facebook-login')[m
 }[m
[1mdiff --git a/android/app/src/main/AndroidManifest.xml b/android/app/src/main/AndroidManifest.xml[m
[1mindex 3e1cb6e..dbaf028 100644[m
[1m--- a/android/app/src/main/AndroidManifest.xml[m
[1m+++ b/android/app/src/main/AndroidManifest.xml[m
[36m@@ -19,14 +19,6 @@[m
         </intent-filter>[m
       </activity>[m
       <activity android:name="com.facebook.react.devsupport.DevSettingsActivity" />[m
[31m-        <activity[m
[31m-            android:name="com.facebook.FacebookActivity"[m
[31m-            android:configChanges="keyboard|keyboardHidden|screenLayout|screenSize|orientation"[m
[31m-            android:label="@string/app_name"[m
[31m-            android:theme="@android:style/Theme.Translucent.NoTitleBar" />[m
[31m-        <meta-data[m
[31m-            android:name="com.facebook.sdk.ApplicationId"[m
[31m-            android:value="@string/fb_app_id"/>[m
     </application>[m
 [m
 </manifest>[m
[1mdiff --git a/android/app/src/main/java/com/instago/MainActivity.java b/android/app/src/main/java/com/instago/MainActivity.java[m
[1mindex 19df517..9f2ec70 100644[m
[1m--- a/android/app/src/main/java/com/instago/MainActivity.java[m
[1m+++ b/android/app/src/main/java/com/instago/MainActivity.java[m
[36m@@ -35,8 +35,7 @@[m [mpublic class MainActivity extends ReactActivity {[m
     @Override[m
     protected List<ReactPackage> getPackages() {[m
       return Arrays.<ReactPackage>asList([m
[31m-        new MainReactPackage(),[m
[31m-              new FacebookLoginPackage()[m
[32m+[m[32m        new MainReactPackage()[m
       );[m
     }[m
 }[m
[1mdiff --git a/android/app/src/main/res/values/strings.xml b/android/app/src/main/res/values/strings.xml[m
[1mindex 9016d3a..2fdf2c8 100644[m
[1m--- a/android/app/src/main/res/values/strings.xml[m
[1m+++ b/android/app/src/main/res/values/strings.xml[m
[36m@@ -1,4 +1,3 @@[m
 <resources>[m
     <string name="app_name">InstaGo</string>[m
[31m-    <string name="fb_app_id">197446253944927</string>[m
 </resources>[m
[1mdiff --git a/android/settings.gradle b/android/settings.gradle[m
[1mindex 1e6682f..cdf2c3a 100644[m
[1m--- a/android/settings.gradle[m
[1m+++ b/android/settings.gradle[m
[36m@@ -1,5 +1,3 @@[m
 rootProject.name = 'InstaGo'[m
 [m
[31m-include ':app'[m
[31m-include ':react-native-facebook-login'[m
[31m-project(':react-native-facebook-login').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-facebook-login/android')[m
\ No newline at end of file[m
[32m+[m[32minclude ':app'[m
\ No newline at end of file[m
[1mdiff --git a/components/Settings.js b/components/Settings.js[m
[1mindex d8a4e6a..3d78c01 100644[m
[1m--- a/components/Settings.js[m
[1m+++ b/components/Settings.js[m
[36m@@ -2,31 +2,115 @@[m
 [m
 var React = require('react-native');[m
 var {[m
[31m-  AppRegistry,[m
[31m-  Component,[m
[32m+[m[32m  AsyncStorage,[m
   StyleSheet,[m
   Text,[m
   View,[m
[31m-  Image,[m
[31m-  Dimensions,[m
[31m-  ScrollView,[m
[31m-  Navigator,[m
[31m-  TouchableOpacity[m
[32m+[m[32m  TouchableHighlight[m
 } = React;[m
 [m
 var FBLogin = require('react-native-facebook-login');[m
 var GeoImageUtils = require('../utils/geoimages');[m
[32m+[m[32mvar Accordion = require('react-native-accordion');[m
[32m+[m[32mvar Toggle = require('./toggle');[m
 [m
 var Settings = React.createClass({[m
 [m
[31m-  render: function() {[m
[32m+[m[32m  getInitialState() {[m
[32m+[m[32m    return {[m
[32m+[m[32m      user: null,[m
[32m+[m[32m      categories: new Set(),[m
[32m+[m[32m    }[m
[32m+[m[32m  },[m
[32m+[m
[32m+[m[32m  componentDidMount() {[m
[32m+[m[32m    var _this = this;[m
[32m+[m[32m    AsyncStorage.getItem('fb:user', (err,res) => {[m
[32m+[m[32m      if(res !== null) {[m
[32m+[m[32m        console.log(res);[m
[32m+[m[32m        var user = JSON.parse(res);[m
[32m+[m[32m        _this.setState({[m
[32m+[m[32m          user: user[m
[32m+[m[32m        });[m
[32m+[m[32m        _this.getCategories()[m
[32m+[m[32m      }[m
[32m+[m[32m    })[m
[32m+[m[32m  },[m
[32m+[m
[32m+[m[32m  getCategories() {[m
[32m+[m[32m  var _this = this;[m
[32m+[m[32m    GeoImageUtils.fetchInterestImages(_this.state.user,{[m
[32m+[m[32m      success: function(categoryList) {[m
[32m+[m[32m        _this.setState({categories: categoryList})[m
[32m+[m[32m      }[m
[32m+[m[32m    });[m
[32m+[m[32m  },[m
 [m
[32m+[m[32m  renderFBLogin: function(){[m
[32m+[m[32m    var _this = this;[m
[32m+[m[32m      return ([m
[32m+[m[32m        <View>[m
[32m+[m[32m          <FBLogin style={{ marginBottom: 10, }}[m
[32m+[m[32m              permissions={["email","user_friends", "user_likes"]}[m
[32m+[m[32m              onLogin={function(data){[m
[32m+[m[32m                console.log("Logged in!");[m
[32m+[m[32m                 AsyncStorage.setItem('fb:user',JSON.stringify(data), () => {[m
[32m+[m[32m                   console.log("FB USER STORED");[m
[32m+[m[32m                   _this.setState({ user : data });[m
[32m+[m[32m                   GeoImageUtils.fetchInterestImages(_this.state.user,{[m
[32m+[m[32m                     success: function(categoryList) {[m
[32m+[m[32m                       _this.setState({[m
[32m+[m[32m                         categories: categoryList[m
[32m+[m[32m                       })[m
[32m+[m[32m                     }[m
[32m+[m[32m                   });[m
[32m+[m[32m                 });[m
[32m+[m[32m              }}[m
[32m+[m[32m              onLogout={function(){[m
[32m+[m[32m                console.log("Logged out.");[m
[32m+[m[32m                _this.setState({ user : null });[m
[32m+[m[32m              }}[m
[32m+[m[32m              onLoginFound={function(data){[m
[32m+[m[32m                console.log("Existing login found.");[m
[32m+[m[32m                _this.setState({ user : data });[m
[32m+[m[32m                _this.fetchUserLikes(_this.state.user)[m
[32m+[m[32m              }}[m
[32m+[m[32m              onLoginNotFound={function(){[m
[32m+[m[32m                console.log("No user logged in.");[m
[32m+[m[32m                _this.setState({ user : null });[m
[32m+[m[32m              }}[m
[32m+[m[32m              onError={function(data){[m
[32m+[m[32m                console.log("ERROR");[m
[32m+[m[32m              }}[m
[32m+[m[32m              onCancel={function(){[m
[32m+[m[32m                console.log("User cancelled.");[m
[32m+[m[32m              }}[m
[32m+[m[32m              onPermissionsMissing={function(data){[m
[32m+[m[32m                console.log("Check permissions!");[m
[32m+[m[32m              }}[m
[32m+[m[32m          />[m
[32m+[m[32m        </View>[m
[32m+[m[32m      );[m
[32m+[m[32m  },[m
[32m+[m
[32m+[m[32m  render: function() {[m
[32m+[m[32m    var _this = this;[m
     return ([m
       <View>[m
[31m-[m
[32m+[m[32m        <Toggle>{_this.state.categories}</Toggle>[m
[32m+[m[32m        {(_this.state.user) ? _this.renderFBLogin() : <Text/>}[m
       </View>[m
     );[m
   }[m
 });[m
 [m
[32m+[m[32mvar styles = StyleSheet.create({[m
[32m+[m
[32m+[m[32m  container: {[m
[32m+[m[32m    backgroundColor: '#fff',[m
[32m+[m[32m    margin:10,[m
[32m+[m[32m    overflow:'hidden'[m
[32m+[m[32m  },[m
[32m+[m[32m});[m
[32m+[m
 module.exports = Settings;[m
\ No newline at end of file[m
[1mdiff --git a/package.json b/package.json[m
[1mindex 7c8004e..a371ff1 100644[m
[1m--- a/package.json[m
[1m+++ b/package.json[m
[36m@@ -8,6 +8,7 @@[m
   "dependencies": {[m
     "react-native": "^0.20.0",[m
     "react-native-facebook-login": "^1.0.3",[m
[32m+[m[32m    "react-native-fbsdk": "^0.1.0",[m
     "react-native-scrollable-tab-view": "^0.4.0"[m
   }[m
 }[m
