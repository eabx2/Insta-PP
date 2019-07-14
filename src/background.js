// Starting Notification
console.log("Instagram-PP \nReady to go");

/**********************************************/

function getPage(url){
    
    return new Promise(function(resolve, reject){
                
        var xhrProfile = new XMLHttpRequest();
        xhrProfile.open("GET", url, true);
        xhrProfile.onreadystatechange = function() {
            if (xhrProfile.readyState == 4) {
                var page = xhrProfile.responseText;
                resolve(page);
            }
        }
        xhrProfile.send();
        
    });
    
}

// define onClick function
openProfilePhoto = function(){
    // run script which is allowed to access DOM
    chrome.tabs.executeScript(null, {file:'src/script.js'})
}

/**********************************************/

// add context menu
chrome.contextMenus.create({
    title: "Open Profile Photo",
    documentUrlPatterns: ["*://www.instagram.com/*"], // show in only instagram profile
    contexts: ["page"], // allow to be appeared in only page
    onclick: openProfilePhoto
});

// add listener
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
    
    switch(response.mode){
            
        case "photo":
            getPage("https://www.instagram.com/p/" + response.param + "/")
                .then(value => {
                    var pattern = new RegExp('property="instapp:owner_user_id" content="([0-9]+)"');
                    var res = pattern.exec(value);
                    var id = res[1];
                    return getPage("https://i.instagram.com/api/v1/users/" + id +"/info/");
                })
                .then(value => {
                    var json = JSON.parse(value);
                    sendResponse(json.user.hd_profile_pic_url_info.url);
                });
            break;
            
        case "name":
            getPage("https://www.instagram.com/" + response.param + "/")
                .then(value => {
                    var pattern = new RegExp('"id":"([0-9]+)"');
                    var res = pattern.exec(value);
                    var id = res[1];
                    return getPage("https://i.instagram.com/api/v1/users/" + id +"/info/");
                })
                .then(value => {
                    var json = JSON.parse(value);
                    sendResponse(json.user.hd_profile_pic_url_info.url);
                });
            break;
            
        case "id":
            getPage("https://i.instagram.com/api/v1/users/" + response.param +"/info/")
                .then(value => {
                    var json = JSON.parse(value);
                    sendResponse(json.user.hd_profile_pic_url_info.url);
                });
            break;
            
    }
    
    return true; // to keep the port opened
});