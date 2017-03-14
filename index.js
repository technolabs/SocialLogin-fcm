var config = {
    apiKey: "AIzaSyBgcSHxbo93P-N9Sh-ZIqgzvwicHDk_Skc",
    authDomain: "fir-ui-demo-84a6c.firebaseapp.com",
    databaseURL: "https://fir-ui-demo-84a6c.firebaseio.com",
    storageBucket: "fir-ui-demo-84a6c.appspot.com",
    messagingSenderId: "265939374336"
};

//SOCIAL_LOGIN.config = config;


/*  use cases */


/* initialize social login app */
document.addEventListener('DOMContentLoaded', function() {
    SOCIAL_LOGIN.init();
}, false);

var sendtoserver = true;
/* override  SOCIAL_LOGIN.onAuthStateChanged method that are trigger when user login or logout */
SOCIAL_LOGIN.onAuthStateChanged = function(status, user) {
    if (status) {
        var u = user.providerData[0];
        var photoURL = "https://www.google.co.in/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwiftJuS3q_SAhWBsZQKHRI_AqgQjRwIBw&url=https%3A%2F%2Fgithub.com%2Fajaysaini235&psig=AFQjCNGXw5zXtLextBDnZzPEqmN4iX2GQg&ust=1488266293967998";
        document.getElementById('userInfoimg').src = u.photoURL ? u.photoURL : photoURL;
        document.getElementById('userInfoname').textContent = u.displayName;
        document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, 2);
        document.getElementById('userInfo').style.display = 'block';
        if (PUSH_NOTIFICATION && sendtoserver) {
            $(".mdl-layout__tab:eq(1) span").click();
            sendtoserver = false;
            PUSH_NOTIFICATION.init();
        }
    } else {
        document.getElementById('userInfo').style.display = 'none';
    }
};

/* override  SOCIAL_LOGIN.handleResetPasswordWithoutLogin method  */
/* SOCIAL_LOGIN.handleResetPasswordWithoutLogin = function(status, user) {
     
 };*/


/* provider mean login by like google ,facebook etc. */
function login(provider) {
    var email = '',
        password = '';
    if (provider == "password") {
        email = document.getElementById('email').value;
        password = document.getElementById('password').value;
        if (email.length < 4) {
            alert('Please enter an email address.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a password.');
            return;
        }
    }
    SOCIAL_LOGIN.login(provider, function(status, result) {
        console.log(result);
        $(".mdl-layout__tab:eq(1) span").click();
    }, email, password);
}

/*  logout a loggedin user */
function logout() {
    if (PUSH_NOTIFICATION && !sendtoserver) {
        PUSH_NOTIFICATION.deleteToken(function(r) {
            console.log(r);
            SOCIAL_LOGIN.logout();
        });
        clearMessages();
    } else {
        SOCIAL_LOGIN.logout();
    }

}


/*  send Email Verification */
function sendEmailVerification() {
    SOCIAL_LOGIN.sendEmailVerification(function(result) {
        console.log(result);
    });
}

/*  send Password Reset */
function sendPasswordReset() {
    var email = document.getElementById('email').value;
    SOCIAL_LOGIN.sendPasswordReset(email, function(result) {
        console.log(result);
    });
}

/*  create a user by email */
function signup() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 6) {
        alert('Please enter a password.');
        return;
    }

    SOCIAL_LOGIN.signup(email, password, function(result) {
        console.log(result);
    });
}

/*  Delete user */
function deleteMyAccount() {
    SOCIAL_LOGIN.deleteAccount();
}







//  override  PUSH_NOTIFICATION.onMessage method 

PUSH_NOTIFICATION.onMessage = function(payload) {
    appendMessage(payload);
    console.log(payload);
    $(".mdl-layout__tab:eq(3) span").click();
};

// Add a message to the messages element.
function appendMessage(payload) {
    const messagesElement = document.querySelector('#messages');
    const dataHeaderELement = document.createElement('h5');
    const dataElement = document.createElement('pre');
    dataElement.style = 'overflow-x:hidden;'
    dataHeaderELement.textContent = 'Received message:';
    dataElement.textContent = JSON.stringify(payload, null, 2);
    messagesElement.appendChild(dataHeaderELement);
    messagesElement.appendChild(dataElement);
}

// Clear the messages element of all children.
function clearMessages() {
    const messagesElement = document.querySelector('#messages');
    while (messagesElement.hasChildNodes()) {
        messagesElement.removeChild(messagesElement.lastChild);
    }
}

function sendPushNotification() {
    var dd = {
        "uid": $('#push_uid').val(),
        "notification": {
            "title": $('#push_title').val(),
            "body": $('#push_body').val()
        }
    };
    AJAX.post('push', dd, function(r) {
        if(r.error)
        console.log(r);
    });
}
