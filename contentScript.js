(() => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideo = "";
  let currentVideoBookmarks = [];

  // Setting the currentVideo id
  const getCurrentVideo = async () => {

  };
  getCurrentVideo();
  // Setting the currentVideo id


  const fetchBookmarks = async () => {
    try {
      const obj = await chrome.storage.sync.get([currentVideo]);
      console.log(currentVideo);
      return obj[currentVideo] ? JSON.parse(obj[currentVideo]) : [];
    } catch (error) {
      console.error(error);
    }
  };

  const addNewBookmarkEventHandler = async () => {
    const currentTime = youtubePlayer.currentTime;
    const newBookmark = {
      time: currentTime,
      desc: "Bookmark at " + getTime(currentTime),
    };

    currentVideoBookmarks = await fetchBookmarks();

    console.log(currentVideo);
    chrome.storage.sync
      .set({
        [currentVideo]: JSON.stringify(
          [...currentVideoBookmarks, newBookmark].sort(
            (a, b) => a.time - b.time
          )
        ),
      })
      .then((res) =>
        chrome.storage.sync.get([currentVideo]).then((obj) => {
          console.log(obj[currentVideo]);
        })
      );

    chrome.runtime.sendMessage({
      message: "bookmarkAdded",
      currentVideo: `${currentVideo}`,
    });
  };

  const newVideoLoaded = async () => {
    // try {
    //   const activeTab = await getActiveTabURL();
    //   const queryParameters = activeTab.url.split("?")[1];
    //   const urlParameters = new URLSearchParams(queryParameters);
  
    //   currentVideo = urlParameters.get("v");
    // } catch (error) {
    //   console.log(error);
    // }
    try {
      await chrome.runtime.sendMessage({
        message: "Give me the current video id",
      }, (response) => {
        console.log(response);
        currentVideo = response.currentVideo;
      })
    } catch (error) {
      console.log(error);
    }

    const bookmarkBtnExists =
      document.getElementsByClassName("bookmark-btn")[0];

    currentVideoBookmarks = await fetchBookmarks();

    if (!bookmarkBtnExists) {
      const bookmarkBtn = document.createElement("img");

      bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
      bookmarkBtn.className = "ytp-button " + "bookmark-btn";
      bookmarkBtn.title = "Click to bookmark current timestamp";

      youtubeLeftControls =
        document.getElementsByClassName("ytp-left-controls")[0];
      youtubePlayer = document.getElementsByClassName("video-stream")[0];

      youtubeLeftControls.appendChild(bookmarkBtn);
      bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
    }
  };

  chrome.runtime.onMessage.addListener(async (obj, sender, response) => {
    const { type, value, videoId } = obj;
    console.log(obj);

    if (type === "NEW") {
      const activeTab = await getActiveTabURL();
      const queryParameters = activeTab.url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);

      currentVideo = urlParameters.get("v");
      newVideoLoaded();
    } else if (type === "PLAY") {
      youtubePlayer.currentTime = value;
    } else if (type === "DELETE") {
      currentVideoBookmarks = currentVideoBookmarks.filter(
        (b) => b.time != value
      );
      chrome.storage.sync
        .set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) })
        .then((res) => console.log(res));

      response(currentVideoBookmarks);
    }
  });

  newVideoLoaded();
})();

const getTime = (t) => {
  var date = new Date(0);
  date.setSeconds(t);

  return date.toISOString().substr(11, 8);
};


// async function getActiveTabURL() {
//   const tabs = await chrome.tabs.query({
//       currentWindow: true,
//       active: true
//   });

//   return tabs[0];
// }