chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      videoId: urlParameters.get("v"),
    });
  }
});

chrome.storage.sync.get(["a8kHErH6PKU"]).then((obj) => {
  console.log("Value is " + obj["a8kHErH6PKU"]);
});



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "Give me the current video id") {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      const activeTab = tabs[0];
      const queryParameters = activeTab.url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);
      const currentVideo = urlParameters.get("v");
      console.log(currentVideo);
      sendResponse({currentVideo: currentVideo});
    });

    // Indicate that we'll call sendResponse asynchronously
    return true;
  }
});


// const fetchBookmarks = async () => {
//   try {
//     const obj = await chrome.storage.sync.get([currentVideo]);
//     console.log(currentVideo);
//     return obj[currentVideo] ? JSON.parse(obj[currentVideo]) : [];
//   } catch (error) {
//     console.error(error);
//   }
// };
