main();

function main(){
    
    var pathnameArray = location.pathname.split("/").filter(i=>i);

    // case: in image page
    if(pathnameArray.length != 1 && pathnameArray[0] == "p") {
                
        try{
            var pattern = new RegExp('property="instapp:owner_user_id" content="([0-9]+)"');
            var res = pattern.exec(document.documentElement.innerHTML);
            var id = res[1];     
            
            chrome.runtime.sendMessage({param: id, mode: "id" }, function(response) {
                window.location.href = response;
            });
        }
        
        // case: image page is not loaded into dom
        catch(error){
            chrome.runtime.sendMessage({param: pathnameArray[1], mode: "photo" }, function(response) {
                window.location.href = response;
            });
        }
        
        return;
    }
        
    var pathUserName = pathnameArray[0];
    
    var pattern = new RegExp('"username":"(.+)"');
    var res = pattern.exec(document.documentElement.innerHTML);
    var domUserName = res[1];
        
    // Case: already html and url is synchronized
    if(domUserName == pathUserName){
        var pattern = new RegExp('"id":"([0-9]+)"');
        var res = pattern.exec(document.documentElement.innerHTML);
        var id = res[1];
        chrome.runtime.sendMessage({param: id, mode: "id" }, function(response) {
            window.location.href = response;
        });
    }
    
    /* 
    Case: html and url is not synchronized yet.
    This requires http request to the instagram profile.
    Because the existed html page does not belong to the current instagram profile in the url.
    */
    else {
        chrome.runtime.sendMessage({param: pathUserName, mode: "name" }, function(response) {
            window.location.href = response;
        });
    }
    
}