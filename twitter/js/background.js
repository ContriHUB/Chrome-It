function tweet(url, text) {
	var openas = localStorage.getItem('openas');
	if(!openas) openas = "popup";
	var postUrl = "https://twitter.com/intent/tweet?text="+encodeURIComponent(text)+"&url="+encodeURIComponent(url);
	if(openas === "popup") {
		chrome.windows.create({"url": postUrl, type:"popup", "height":450,"width":600, "top": 100, "left":100});
	}
	else if(openas === "tab") {
		chrome.tabs.create({url: postUrl});
	}
}

// toolbar button
chrome.browserAction.onClicked.addListener(function(tab) {
	tweet(tab.url, tab.title);
});


// context menu
function onClickHandler(info, tab){
	if (info.menuItemId == "tweet-page"){
		tweet(info.pageUrl, tab.title);
	}
	if (info.menuItemId == "tweet-link"){
		tweet(info.linkUrl, "Link: ");
	}
	if (info.menuItemId === "tweet-selection") {
		tweet(tab.url, info.selectionText);
	}
  if (info.menuItemId === "tweet-image") {
		tweet(info.srcUrl, "Image: ");
	}
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

// first run
chrome.runtime.onInstalled.addListener( function(details) {

  contexts = ["page","selection","link", "image"];
  for (var i = 0; i < contexts.length; i++) {
  	var context = contexts[i];
  	var title = "Share " + context + " on Twitter";
  	chrome.contextMenus.create({"title": title, "contexts":[context], "id": "tweet-"+context});
  }

});


