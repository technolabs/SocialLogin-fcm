var AJAX = {
    _url: "http://localhost:3000/user/",
    post: function(u, d, s) {
        SOCIAL_LOGIN.getToken(function(token) {
            if(token) {
                $.ajax({
                    url: AJAX._url + u,
                    method: "POST",
                    headers: {
                        "id-token": token,
                        "content-type": "application/json"
                    },
                    data: JSON.stringify(d),
                    error: function(error) {
                        console.log(error);
                    },
                    success: s
                });
            }else{
                console.log("id-token not found");
            }
        });
    },
    get: function(u, s) {
        SOCIAL_LOGIN.getToken(function(token) {
            if (token) {
                $.ajax({
                    url: AJAX._url + u,
                    headers: {
                        "id-token": token,
                        "content-type": "application/json"
                    },
                    error: function(error) {
                        console.log(error);
                    },
                    success: s
                });
            }else{
                console.log("id-token not found");
            }
        });
    },
};
