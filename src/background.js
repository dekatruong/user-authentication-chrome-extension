/**
 * when user click Icon
 * Note: consider browserAction, pageAction level
 */
chrome.browserAction.onClicked.addListener(function(tab) {
    console.log('onClicked');
    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
        //Case error
        if (chrome.runtime.lastError) {
            alert(chrome.runtime.lastError.message);
            return;
        }

        // Use the token.
        console.log(token);
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //Request info
        var retry = true;
        var request = new XMLHttpRequest();
        request.open('GET', 'https://www.googleapis.com/oauth2/v2/userinfo?alt=json'); //&access_token=' + token
        request.setRequestHeader('Authorization', 'Bearer ' + token);
        request.onload = function() {
            //Clear cache
            if (this.status === 401 && retry) {
                // This status may indicate that the cached
                // access token was invalid. Retry once with
                // a fresh token.
                retry = false;
                chrome.identity.removeCachedAuthToken(
                    { 'token': token },
                    function(responseUrl) {});

                return;
            }


            alert(request.response);
            console.log(JSON.parse(request.response));
        };

        request.send();
    });
});