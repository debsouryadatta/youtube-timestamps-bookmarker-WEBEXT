### Steps of Development

1. AddListener on the background.js to send a message to the content.js when the user goes to a new youtube page, sending the videoId with the message.

2. AddListener on the content.js to receive the message from the background.js and get the videoId from the message.

3. Creating newVideoLoaded function on the content.js to create the + button and add the event listener to it.

4. Creating addNewBookmarkEventHandler function on the content.js to add the event listener to the + button to add the vide time stamp to the chrome sync storage.

5. Creating fetchBookmarks functions to get the bookmarks from the chrome sync storage and use it in newVideoLoaded func & addNewBookmarkEventHandler func.

6. Creating getActiveTabURL func in the utils.js to get the active tab URL.

7. Adding a listener on DOMContentLoaded in the popup.js to get the active tab URL and use it to get the bookmarks from the chrome sync storage. If its not a youtube page, it will show a message to the user.

8. Creating viewBookmarks, addNewBookmark func to inject the bookmarks in the popup.html

9. Creating setBookmarkAttributes generic func to generate the play, delete elements and add the event listeners to them.

10. Creating onPlay func to send a message to the content.js with the timeStamp to play the video from the bookmark.

11. Creating onDelete func to delete the bookmark from the chrome sync storage and the popup.html.

12. Faced a lot of issues on fetching the bookmarks -
Problem: The currentVideo variable in the contentScript.js which stores the videoId was an empty string all the time, since the onUpdated func in the background.js was not sending the videoId to the content.js properly. 

Solution: I had to use the chrome.tabs.query in the background.js to get the active tab URL and then use the URL to get the videoId/currentVideo.
