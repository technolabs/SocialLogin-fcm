# Social-Login-with-FCM
Social-Login with Firebase Cloud Messaging  that are help in user management in any project.


## Getting Started
Set up your project on the Firebase Console.

Enable the authentication method you want to use in the Auth section > SIGN IN METHOD tab - you don't need to enable custom auth.

In the Google Developer Console, access the project you created in the Firebase Console.

For Custom Auth, also create a new Service Account in your project Developers Console, and download the JSON representation.

Edit the .html for the authentication method you want to try and copy the initialization snippet from the Firebase Console Overview > Add Firebase to your web app into the <head> section of .html.

## Note : 

  Replace your Initialize Firebase config  with SOCIAL_LOGIN.config 

  var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    storageBucket: "",
    messagingSenderId: ""
  };
  
  SOCIAL_LOGIN.config = config;
