var PUSH_NOTIFICATION = {
    _firebase: null,
    init: function() {
        if (!firebase) {
            console.log("Firebase SDK Not Found");
            return '';
        }

        PUSH_NOTIFICATION._firebase = firebase.messaging();
        
        PUSH_NOTIFICATION.getPermission();
       
        PUSH_NOTIFICATION._firebase.onTokenRefresh(function() {
            PUSH_NOTIFICATION._init();
        });

        PUSH_NOTIFICATION._firebase.onMessage(function(payload) {
            PUSH_NOTIFICATION.onMessage(payload);
        });

        PUSH_NOTIFICATION._init();
    },
    _init: function() {
        PUSH_NOTIFICATION.getToken(function(token, err) {
            if (token) {
                PUSH_NOTIFICATION._setTokenSentToServer(false);
                PUSH_NOTIFICATION._sendTokenToServer(token);
            } else {
                console.log('Unable to retrieve refreshed token ', err);
            }
        });
    },
    getToken: function(cb) {
        PUSH_NOTIFICATION._firebase.getToken().then(function(token) {
            if (token) { cb(token); } else { cb(false, token); }
        }).catch(function(err){
            cb(false, err);
        });
    },
    deleteToken: function(cb) {
        PUSH_NOTIFICATION.getToken(function(token, err) {
            if (token) {
                PUSH_NOTIFICATION._firebase.deleteToken(token).then(function() {
                    PUSH_NOTIFICATION._setTokenSentToServer(false);
                    AJAX.get('saveOrUpdate', function(r) {
                        cb(r);
                    });
                }).catch(function(err) {
                    console.log('Unable to delete token. ', err);
                });
            } else {
                console.log('Unable to retrieve refreshed token ', err);
            }
        });
    },
    _setTokenSentToServer: function(sent) {
        if (sent) {
            window.localStorage.setItem('sentToServer', 1);
        } else {
            window.localStorage.setItem('sentToServer', 0);
        }
    },
    _sendTokenToServer: function(token) {
        if (!PUSH_NOTIFICATION._isTokenSentToServer()) {
            PUSH_NOTIFICATION._setTokenSentToServer(true);
            var me = firebase.auth().currentUser;
            if (me) {
                var dd = {
                    "name": me.displayName,
                    "uid": me.uid,
                    "regid": token
                };
                AJAX.post('saveOrUpdate', dd, function(r) {
                    if(r.error)
                        console.log(r);
                });
            } else {
                console.log("User Not Found");
            }
        } else {
            console.log('Token already sent to server so won\'t send it again ' +
                'unless it changes');
        }
    },
    _isTokenSentToServer: function() {
        if (window.localStorage.getItem('sentToServer') == 1) {
            return true;
        }
        return false;
    },
    getPermission: function() {
        PUSH_NOTIFICATION._firebase.requestPermission().then(function() {
            console.log('Notification permission granted.');
        }).catch(function(err) {
            console.log('Unable to get permission to notify.', err);
        });
    },
    onMessage:function(payload) {
        console.log(payload);
    }
}
