 var SOCIAL_LOGIN = {
     loginStyle: "signInWithPopup", // "signInWithRedirect"
     config: {
         apiKey: "",
         authDomain: "",
         databaseURL: "",
         storageBucket: "",
         messagingSenderId: ""
     },
     init: function() {
         var mode = SOCIAL_LOGIN.getParameterByName('mode'),
             actionCode = SOCIAL_LOGIN.getParameterByName('oobCode'),
             apiKey = SOCIAL_LOGIN.getParameterByName('apiKey');

         if (mode != '' && actionCode != '' && apiKey != '') {
             SOCIAL_LOGIN._redirectHandler(mode, actionCode, apiKey);
         } else {
             firebase.initializeApp(SOCIAL_LOGIN.config);
         }

         window.onload = function() {
             SOCIAL_LOGIN._initApp();
         };
     },
     _initApp: function() {
         firebase.auth().onAuthStateChanged(function(user) {
             if (user) {
                 SOCIAL_LOGIN.onAuthStateChanged(true, user);
             } else {
                 SOCIAL_LOGIN.onAuthStateChanged(false);
             }
         });
     },
     onAuthStateChanged: function(status) {
         console.log(status);
     },
     login(provider, callback, email, password) {
         provider = SOCIAL_LOGIN._getProvider(provider, email, password);
         if (!password || password == "") {
             firebase.auth()[SOCIAL_LOGIN.loginStyle](provider).then(function(result) {
                 if (callback)
                     callback(true, result);
             }).catch(function(error) {
                 if (callback)
                     callback(false, error);
             });
         } else {
             provider.then(function(result) {
                 if (callback)
                     callback(true, result);
             }).catch(function(error) {
                 if (callback)
                     callback(false, error);
             });
         }
     },
     signup: function(email, password, callback) {
         firebase.auth().createUserWithEmailAndPassword(email, password).then(function(result) {
             if (callback)
                 callback(true, result);
         }).catch(function(error) {
             if (callback)
                 callback(false, error);
         });
     },
     logout: function(callback) {
         firebase.auth().signOut().then(function() {
             if (callback)
                 callback(true, "Sign-out successful");
         }, function(error) {
             if (callback)
                 callback(false, "An error happened");
         });
     },
     sendEmailVerification: function(cb) {
         if (!firebase.auth().currentUser.emailVerified) {
             firebase.auth().currentUser.sendEmailVerification().then(function() {
                 cb({
                     "status": true,
                     "message": "Email Verification Sent!"
                 });
             });
         } else {
             cb({
                 "status": false,
                 "message": "Email Already Verified"
             });
         }
     },
     sendPasswordReset: function(email, cb) {
         firebase.auth().sendPasswordResetEmail(email).then(function() {
             cb({
                 "status": true,
                 "message": "Password Reset Email Sent!"
             });
         }).catch(function(error) {
             cb({
                 "status": false,
                 "message": error.message,
                 error: error
             });
         });
     },
     _getProvider: function(t, email, password) {
         var provider = new firebase.auth.GoogleAuthProvider();
         switch (t) {
             case "google":
                 provider = new firebase.auth.GoogleAuthProvider();
                 break;
             case "github":
                 provider = new firebase.auth.GithubAuthProvider();
                 break;
             case "twitter":
                 provider = new firebase.auth.TwitterAuthProvider();
                 break;
             case "facebook":
                 provider = new firebase.auth.FacebookAuthProvider();
                 break;
             case "password":
                 provider = new firebase.auth().signInWithEmailAndPassword(email, password);
                 break;
         }
         return provider;
     },
     _handleVerifyEmail: function(auth, actionCode) {
         auth.applyActionCode(actionCode).then(function(resp) {
             console.log(resp);
         }).catch(function(error) {
             console.log(error);
         });
     },
     _handleResetPassword: function(auth, actionCode) {
         auth.verifyPasswordResetCode(actionCode).then(function(email) {
             var user = {
                 "auth": auth,
                 "email": email,
                 "actionCode": actionCode
             };
             SOCIAL_LOGIN.handleResetPassword(user, "update");
         }).catch(function(error) {
             // Invalid or expired action code. Ask user to try to reset the password
             // again.
         });
     },
     updatePasswordWithoutLogin: function(user, newPassword) {
         // Save the new password.
         user.auth.confirmPasswordReset(user.actionCode, newPassword)
             .then(function(resp) {
                 user.auth.signInWithEmailAndPassword(user.email, newPassword);
             }).catch(function(error) {
                 SOCIAL_LOGIN.handleResetPasswordWithoutLogin(user, "error", error);
             });
     },
     handleResetPasswordWithoutLogin: function(user, eventType, error) {
         switch (eventType) {
             case "update":
                 SOCIAL_LOGIN.updatePasswordWithoutLogin(user, "123456");
                 break;
             case "error":
                 console.log(error);
                 break;
         }
     },
     _handleRecoverEmail: function(auth, actionCode) {

     },
     getParameterByName: function(name) {
         name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
         var regexS = "[\\?&]" + name + "=([^&#]*)";
         var regex = new RegExp(regexS);
         var results = regex.exec(window.location.href);
         if (results == null) {
             return "";
         } else {
             return decodeURIComponent(results[1].replace(/\+/g, " "));
         }
     },
     _redirectHandler: function(mode, actionCode, apiKey) {
         var config = {
             'apiKey': apiKey
         };

         var app = firebase.initializeApp(config),
             auth = app.auth();
         switch (mode) {
             case 'resetPassword':
                 SOCIAL_LOGIN._handleResetPassword(auth, actionCode);
                 break;
             case 'recoverEmail':
                 SOCIAL_LOGIN._handleRecoverEmail(auth, actionCode);
                 break;
             case 'verifyEmail':
                 SOCIAL_LOGIN._handleVerifyEmail(auth, actionCode);
                 break;
             default:
         }
     },
     getToken: function(cb) {
         firebase.auth().currentUser.getToken(true)
             .then(function(idToken) {
                 cb(idToken);
             }).catch(function(error) {
                 cb(false);
                 console.log(error);
             });
     },
     deleteAccount: function(cb) {
         var user = firebase.auth().currentUser;
         user.delete().then(function() {
             cb(true, "Delete " + user.displayName + " Successfully");
         }, function(error) {
             cb(false, error);
         });
     },
     reauthenticate: function(credential, cb) {
         var user = firebase.auth().currentUser;
         user.reauthenticate(credential).then(function() {
             cb(true, user);
         }, function(error) {
             cb(false);
         });
     },
     updatePasswordAfterLogin: function(newPassword) {
         var credential = '';
         this.reauthenticate(credential, function(s, user) {
             if(s) {
                 user.updatePassword(newPassword).then(function(result) {
                     console.log(result);
                 }, function(error) {
                     console.log(error);
                 });
             }
         });
     },
 }
