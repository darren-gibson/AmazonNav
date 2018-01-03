(function() {
  var callback = function(details) {
    console.debug("callback complete: ", details);
    if (details.tabId >= 0) {
      var message = {
        type: "webRequest_onCompleted",
        data: {
          url: details.url
        }
      };
      console.debug(`sending message to tab: ${details.tabId}, message:`, message);
      chrome.tabs.sendMessage(details.tabId, message);
    };
  };

  chrome.webRequest.onCompleted.addListener(callback, {
    urls: ["<all_urls>"]
  }, ["responseHeaders"]);
})();
