'use strict';
var c, ctx, w, h, particles, nextframe;
/////////////////GOOGLE ANALYTICS////////////////////

//////////////////////////////////////////////////////
var accessToken = "326a6c78dc86439ba21c9cf3cb8a0cf0";
var baseUrl = "https://api.api.ai/v1/";
var talking = true;
var nlp = window.nlp_compromise;
var offline = false;
var countrycode;
var timevocal = 0; //for time because it wase giving time in hindi
var dateforvocal; //speech the date
var monthnameforvocal; //speech the date with month
var dayofweekvocal;
var hourforvocal;
var minutesforvocal;
var ampmforvocal;
var remindtheswitch = false;
var recognition;
////////////////////////////////////////////////////////
$(document).ready(function () {
    //first time when extension will be loaded
    $('body').disableSelection();
    $("#body").on("contextmenu", function (e) {
        return false;
    });
function createMenu(mostVisitedURLs) {
    var ul = document.getElementById("recent-list");
          var str = "";
          $("#recent-list").empty();
          //alert(mostVisitedURLs.length);
          var n;
          if(mostVisitedURLs.length<=10){
            n = mostVisitedURLs.length;
          }
          else
            n = 10;
        if(n!=2){
    for(var i=0;i<n;i++){
        if(mostVisitedURLs[i].title === "Welcome to Google Chrome" || mostVisitedURLs[i].title === "Chrome Web Store"){
            continue;
        }
        else
        str = str + "<li  > <a target='_blank' href = '"+mostVisitedURLs[i].url+"'>"+mostVisitedURLs[i].title+"</a> <button id='"+mostVisitedURLs[i].url+"' class='w3-button w3-tiny  w3-transparent w3-right hey'>&times;</button></li>";
    }
    }
    else{    
       str= str + "<li><h4>No Top Sites. Keep browsing and we will create your favourites automatically.</h4></li>"
    }
     $("#recent-list").append(str);
}
     $(document).on('click','.hey', function(event){
        //alert(event.target.id);
        this.parentElement.style.display='none'

        chrome.history.deleteUrl({url : event.target.id},function(){
           // alert("deleted");
                   });
        });
     $("#clearAll").click(function(){
        chrome.history.deleteAll(function() {
            $("#recent-list").empty();
            document.getElementById('id02').style.display='none';
            alert("history Cleared");
                });
     });
    $(document).keydown(function (event) {
        if (event.keyCode == 123) {
            return false;
        }
        else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
            return false;  //Prevent from ctrl+shift+i
        }
    });

    chrome.storage.local.get(/* String or Array */["firsttime"], function (items2) {
        if (items2.firsttime === 3) {
            $("#rec").click();
            chrome.storage.local.set({"firsttime": 4}, function () {
            });
        }
    });
    changeback();
    $("#randimg").click(function(){
        chrome.storage.local.get(["randimg"],function(items2){
                 if(items2.randimg === undefined){
                    chrome.storage.local.set({"randimg" : "on"},function(){});

                    $("#randimg").text("ON");
                 }
                 else{
                    if(items2.randimg === "on"){
                        chrome.storage.local.set({"randimg" : "off"},function(){});
                        $("#randimg").text("OFF");
                    }
                    else{
                        chrome.storage.local.set({"randimg" : "on"},function(){});
                        $("#randimg").text("ON");
                    }
                 }
        });
    });
    var setwall;
    $("#setwall").click(function(){
        chrome.storage.local.get(["backimage"],function(items){
            if(items.backimage == setwall){
                alert("Already Set!");
            }else{
                chrome.storage.local.set({"backimage":setwall},function(){
                    alert("Image Has been set permanent! We are shutting down random image.");
                    chrome.storage.local.set({"randimg":"off"},function(){
                        $("#randimg").text("OFF");
                    });
                });
            }
        });
    });
    function changeback() {
        chrome.storage.local.get(["randimg"],function(items2){
            if(items2.randimg === "on" ){
                $("#randimg").text("ON");
                chrome.storage.local.get(["backimagerand"],function(items){
                    if(items.backimagerand === undefined){
                         chrome.storage.local.set({"backimagerand":"images/default.jpg"},function(){});
                    }
                    $("#body").attr("background", items.backimagerand);
                    setwall = items.backimagerand;
                   // console.log(items.backimage);
                });
        var request = new XMLHttpRequest();
        request.open('GET', "https://source.unsplash.com/random/1024x600", true);
        request.responseType = 'blob';
        request.onload = function() {
              var reader = new FileReader();
              reader.readAsDataURL(request.response);
              reader.onload =  function(e){
              chrome.storage.local.set({"backimagerand": e.target.result }, function () { 
                });
        //console.log('DataURL:', e.target.result);
    };
};
request.send();
            }
            else{
                $("#randimg").text("OFF");
        chrome.storage.local.get(/* String or Array */["backimage"], function (items2) {
            if (items2.backimage === undefined) {
                $("#body").attr("background",  "images/default.jpg");
                chrome.storage.local.set({"backimagerand":"images/default.jpg"},function(){});
            }
            else {
                       $("#body").attr("background", items2.backimage);
                       setwall = items2.backimage;
            }
        });
    }
    });
    }
// preventing zoom
$(document).keydown(function(event) {
if (event.ctrlKey==true && (event.which == '61' || event.which == '107' || event.which == '173' || event.which == '109'  || event.which == '187'  || event.which == '189'  ) ) {
        event.preventDefault();
     }
});

$(window).bind('mousewheel DOMMouseScroll', function (event) {
       if (event.ctrlKey == true) {
       event.preventDefault();
       }
});
var i = 0;
var i2 = 0;
var i3 = 0;
var bookmarklist = "";
$('#bookmark').click(function(){

    if(i==0){
    document.getElementById('id01').style.display='block';
    document.getElementById('id02').style.display='none';
    document.getElementById('id03').style.display='none';
    i=1;
    $("#bookmark-list").empty();
    //bookmarklist = "";
    chrome.bookmarks.getTree(process_bookmark);
    //alert(bookmarklist);
   // $("#bookmark-list").append(bookmarklist);
    }
    else{
     document.getElementById('id01').style.display='none';
     i=0;   
    }
});
function process_bookmark(bookmarks) {
          //alert(mostVisitedURLs.length);
    for (var i =bookmarks.length-1 ; i >= 0; i--) {
        var bookmark = bookmarks[i];
        if (bookmark.url) {
            $("#bookmark-list").append("<li><a target='_blank' href = '"+bookmark.url+"'>"+bookmark.title+"</a> <button title='permanent delete bookmark' id='"+bookmark.id+"' class='w3-button w3-tiny w3-transparent w3-right hello'>&times;</button></li>");
           }
        if (bookmark.children) {
            process_bookmark(bookmark.children);
        }
    }
}

$(document).on('click','.hello', function(event){
        //alert(event.target.id);
        this.parentElement.style.display='none'

        chrome.bookmarks.remove(event.target.id,function(){
           
                   });
        });
////////
/// minimode coding/////////
$("#minimode").click(function(){
    chrome.storage.local.get(["minimode"],function(items2){
                    if(items2.minimode === "on"){
                        chrome.storage.local.set({"minimode" : "off"},function(){
                            $("#minimode").text("OFF");
                             $(".mini").show();
                             $("#containment").css({"margin-top":"0%"});
                        });
                    }
                    else{
                        chrome.storage.local.set({"minimode" : "on"},function(){});
                        $("#minimode").text("ON");
                        $(".mini").css({"display":"none"});
                        $("#containment").css({"margin-top":"7%"});  
                    }
        });
});
minimode();
function minimode(){
    chrome.storage.local.get(["minimode"],function(items2){
                if(items2.minimode === undefined){
                    chrome.storage.local.set({"minimode" : "off"},function(){});
                    $("#minimode").text("OFF");
                 }
                 else{
                    if(items2.minimode === "on"){
                        $("#minimode").text("ON");
                      $(".mini").css({"display":"none"});
                       $("#containment").css({"margin-top":"7%"});
                    }
                    else{
                        $("#minimode").text("OFF");
                      $(".mini").css({"display":"true"});
                      $("#containment").css({"margin-top":"0%"});
                    }
                 }
    });
}
///////////////////////////////////////////////////////////////////////////////////
$('#recent').click(function(){
    if(i2==0){

        document.getElementById('id01').style.display='none';
    document.getElementById('id02').style.display='block';
    document.getElementById('id03').style.display='none';
   chrome.topSites.get(createMenu); 
    i2=1;
    }
    else{
     document.getElementById('id02').style.display='none';
     i2=0;   
    }
});
$("#menu").click(function(){
    if(i3 == 0){
        document.getElementById('id01').style.display='none';
    document.getElementById('id03').style.display='block';
    document.getElementById('id02').style.display='none';
    i3 = 1;
    }
    else{
        document.getElementById('id03').style.display='none';
        i3=0;
    }
});
$('#closebtn').click(function(){
    document.getElementById('id01').style.display='none';
});

$('#closebtn2').click(function(){
    document.getElementById('id02').style.display='none';
});

$('#closebtn3').click(function(){
    document.getElementById('id03').style.display='none';
});
    $('#file').change(function (event) {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function () {
            chrome.storage.local.set({"backimage": reader.result}, function () {
            });
            $("#body").attr("background", reader.result);
        };
        reader.onerror = function (error) {
            //console.log('Error: ', error);
        };
    });
    checkOnline();

    $("#chatbox").focus(function () {
        for (var i = 1; i < 10; i++) {
            $("#draggable" + i).hide(1000);
        }
    });
    $("#chatbox").blur(function () {
        chrome.storage.local.get(["minimode"],function(items){
            if(items.minimode === 'off'){
                for (var i = 1; i < 10; i++) {
            $("#draggable" + i).show(1000);
        }
            }
        });
        
    });
        var dt = new Date();
    var hours = dt.getHours();
    var hour;
    var timezone;
    


    function SetCurrentTimeFormatAMPM() {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + "<span class='blink'>:</span>" + minutes + ' ' + ampm;
        $("#time").html(strTime);
    }

    function setCurrentDate() {
        var d = new Date();
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Novermber", "December"];
        var fullDate = '';
        fullDate = days[d.getDay()] + ', ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();

       /* $.getJSON("http://freegeoip.net/json/", function (result) {
        $.each(result, function (i, field) {
            if (i == "time_zone") {
                timezone = field;
                //timefun();
            }
            if (i == "country_code") {
                countrycode = field;
            }
        });
    });*/
        $("#date").html(fullDate);
    }
    SetCurrentTimeFormatAMPM();
    setCurrentDate();

    var interval = setInterval(function () {
        SetCurrentTimeFormatAMPM();
        setCurrentDate();
    }, 1000);

    //setInterval(timefun, sec);

    /*function setDate() {
        $("#date").text(dayofweekname + ", " + day + " " + monthname + " " + year);
    }*/

    function blinker() {
        $('.blink').fadeOut(500).fadeIn(500);
    }

    setInterval(blinker, 1000);

// for the starting greats
    chrome.tabs.getCurrent(function (tab) {
        if (tab.id === 2) {
            if (hours >= 4 && hours <= 11) {
                chrome.storage.local.get(/* String or Array */["username"], function (items) {
                    if (items.username === undefined) {
                        Speech("Good Morning, Sir");
                    }
                    else
                        Speech("Good Morning ," + items.username);
                });
            }
            else if (hours >= 12 && hours <= 16) {
                chrome.storage.local.get(/* String or Array */["username"], function (items) {

                    if (items.username === undefined) {
                        Speech("Good After Noon, Sir");
                    }
                    else
                        Speech("Good After Noon ," + items.username);
                });
            }
            else {
                chrome.storage.local.get(/* String or Array */["username"], function (items) {

                    if (items.username === undefined) {
                        Speech("Good Evening, Sir");
                    }
                    else {
                        Speech("Good Evening ," + items.username);
                    }
                });
            }
        }
    })

    $(".autocomplete").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "http://suggestqueries.google.com/complete/search?output=toolbar&hl=en&" + "q=" + $("#chatbox").val() + "&gl=" + countrycode,
                success: function (data) {
                    var json = $.xml2json(data);
                    var newArray = new Array(10);
                    var i = 0;
                    $.each(json["#document"].toplevel.CompleteSuggestion, function (key, value) {
                        var newObject = {
                            label: value.suggestion["$"].data
                        };
                        newArray[i] = newObject;
                        i++;
                    });
                    response(newArray.slice(0, 7));
                }
            });
        },
        select : function(e,ui){
        },
        minChars: 2,
        lookupLimit: 8,
    });
    $("#chatbox").keypress(function (event) {
        if (event.which == 13) {
            event.preventDefault();
            if ($("#chatbox").val() === "") {
                return;
            } else {
                var regex = new RegExp("[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)");
                var txt = $("#chatbox").val();
                if ((txt.indexOf('.com') != -1) || (txt.indexOf('.in') != -1) || (txt.indexOf('.org') !== -1) || (txt.indexOf('.io') != -1) || (txt.indexOf('.*') !== -1 )) {
                    window.open('http://' + $("#chatbox").val());
                }
                else {
                    var a = $('#searchengine option:selected').text()
                    if (a === "Google") {
                        window.open('http://google.com/search?q=' + $("#chatbox").val());
                    }
                    else if (a === "Bing") {
                        window.open('http://bing.com/search?q=' + $("#chatbox").val());
                    }
                    else if (a === "Wikipedia") {
                        window.open('http://Wikipedia.org/wiki/' + $("#chatbox").val());
                    }
                }
                $("#chatbox").val("");
            }
        }
    });
    $("#rec").click(function (event) {
        chrome.storage.local.get(/* String or Array */["onoffswitch"], function (items2) {
            if (items2.onoffswitch === "true") {
                chrome.storage.local.set({"onoffswitch": "false"}, function () {
                    remindtheswitch = true;
                    switchRecognition();
                });
            }
            else {
                switchRecognition();
            }
        });

    });
});

$("#chromeitbar").click(function(){
    window.open("../about/aboutus.htm",'_blank');
});
//function to check if the user is online or offline
function checkOnline() {
    if (!navigator.onLine && !offline) {
        offline = true;
        
        chrome.storage.local.set({ "onoffswitch": "false"}, function(){
            alert("The Browser if offline, Please connect it to the Internet. To continue the service. We are shutting down the voice trigger.");
          });             
    }
    if (navigator.onLine) {
        offline = false;
    }
    setTimeout(checkOnline, 1000);
}
function startRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.onstart = function (event) {
        updateRec();
    };
    recognition.onresult = function (event) {
        var text = "";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
        }
        setInput(text);
        stopRecognition();
    };
    recognition.onend = function () {
        stopRecognition();
    };
    recognition.lang = "en-US";
    recognition.start();
}
function stopRecognition() {
    if (recognition) {
        recognition.stop();
        recognition = null;
        if (remindtheswitch) {
            chrome.storage.local.set({"onoffswitch": "true"}, function () {
                remindtheswitch = false;
            });
        }
    }
    updateRec();
}
function switchRecognition() {
    if (recognition) {
        stopRecognition();
    } else {
        startRecognition();
    }
}
function setInput(text) {
    $("#chatbox").val(text);
    send();
}
function updateRec() {
    $("#rec").text(recognition ? "Stop" : "Speak");
}
function send() {
    var text = $("#chatbox").val();
    if ((text.indexOf('.com') == -1) && (text.indexOf('.in') == -1) && (text.indexOf('.org') == -1) && (text.indexOf('.io') == -1)) {
        $("#chatbox").val("");
        $.ajax({
            type: "POST",
            url: baseUrl + "query?v=20150910",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                "Authorization": "Bearer " + accessToken
            },
            data: JSON.stringify({query: text, lang: "en", sessionId: "somerandomthing"}),
            success: function (data) {
                //for saving the name
                if (data.result.metadata.intentName === "call me") {
                    chrome.storage.local.set({"username": data.result.parameters.any}, function () {
                    });
                }
                //for intellige greets
                if (data.result.metadata.intentName === "youtube search") {
                    chrome.tabs.create({'url': 'https://www.youtube.com/results?search_query=' + data.result.parameters.any});
                }
                if (data.result.metadata.intentName === "greats") {
                    var great = data.result.parameters.great;
                    var dt = new Date();
                    var hours = dt.getHours();
                    if (great === "Morning" && (hours >= 4 && hours <= 11)) {
                        chrome.storage.local.get(/* String or Array */["username"], function (items) {
                            if (items.username === undefined) {
                                Speech("Good Morning, Sir");
                            }
                            else
                                Speech("Good Morning ," + items.username);
                        });
                    }
                    else if (great === "Morning" && (hours >= 12 && hours <= 16)) {
                        chrome.storage.local.get(/* String or Array */["username"], function (items) {
                            if (items.username === undefined) {
                                Speech("It is After Noon, Good After Noon. Sir")
                            }
                            else
                                Speech("It is After Noon, Good After Noon. " + items.username);
                        });
                    }
                    else if (great === "Morning") {
                        chrome.storage.local.get(/* String or Array */["username"], function (items) {
                            if (items.username === undefined) {
                                Speech("It is Evening, Good Evening. Sir")
                            }
                            else
                                Speech("It is Evening, Good Evening. " + items.username);
                        });
                    }
                    if (great === "After noon" && (hours >= 12 && hours <= 16)) {
                        chrome.storage.local.get(/* String or Array */["username"], function (items) {
                            if (items.username === undefined) {
                                Speech("Good After Noon, Sir")
                            }
                            else
                                Speech("Good After Noon ," + items.username);
                        });
                    }
                    else if (great === "After noon" && (hours >= 4 && hours <= 11)) {
                        chrome.storage.local.get(/* String or Array */["username"], function (items) {
                            if (items.username === undefined) {
                                Speech("It is Morning, Good Morning, Sir")
                            }
                            else
                                Speech("It is Morning, Good Morning. " + items.username);
                        });
                    }
                    else if (great === "After noon") {
                        chrome.storage.local.get(/* String or Array */["username"], function (items) {
                            if (items.username === undefined) {
                                Speech("It is Evening, Good Evening. Sir")
                            }
                            else
                                Speech("It is Evening, Good Evening. " + items.username);
                        });
                    } else if (great === "Evening") {
                        chrome.storage.local.get(/* String or Array */["username"], function (items) {
                            if (items.username === undefined) {
                                Speech("Good After Noon, Sir")
                            }
                            else
                                Speech("Good After Noon. " + items.username);
                        });
                    }
                    else if (great === "Evening" && (hours >= 4 && hours <= 11)) {
                        chrome.storage.local.get(/* String or Array */["username"], function (items) {
                            if (items.username === undefined) {
                                Speech("It is Morning, Good Morning, Sir")
                            }
                            else
                                Speech("It is Morning, Good Morning. " + items.username);
                        });
                    }
                    else if (great === "Evening" && (hours >= 12 && hours <= 16)) {
                        chrome.storage.local.get(/* String or Array */["username"], function (items) {
                            if (items.username === undefined) {
                                Speech("It is After Noon, Good After Noon, Sir")
                            }
                            else
                                Speech("It is After Noon, Good After Noon. " + items.username);
                        });
                    }
                }
                if (data.result.fulfillment.speech !== 'i am searching this on google') {
                    var speech = data.result.fulfillment.speech;
                    if (data.result.fulfillment.speech === '@time') {
                        //var now = new Date($.now());
                        //var ampm = (now.getHours() >= 12) ? "PM" : "AM";
                        var time = hourforvocal + ":" + minutesforvocal + " " + ampmforvocal;
                        timevocal = 1;
                        Speech(time);
                    }
                    else {
                        if ((speech.indexOf('.com') != -1) || (speech.indexOf('.in') != -1) || (speech.indexOf('.org') !== -1) || (speech.indexOf('.io') != -1)) {
                            Speech("opening. Sir");
                            window.open('http://' + speech);
                        }
                        else if (data.result.fulfillment.speech === '@close') {
                            Speech("closing");
                            window.top.close();
                        }
                        else if (data.result.fulfillment.speech === '@bookmark') {
                           
                            chrome.tabs.getSelected(null, function(tab) { //<-- "tab" has all the information
                                         chrome.bookmarks.create({'parentId': extensionsFolderId,
                               'title': tab.title,
                               'url': tab.url});
                                          Speech("I have Added this page to favourites");
                            });
                        }
                        else if (data.result.fulfillment.speech === '@open') {
                            Speech("opening");
                            chrome.tabs.create({'url': 'chrome://newtab'});
                        }
                        else if (data.result.fulfillment.speech === '@date') {
                            timevocal = 1;
                            Speech(dateforvocal + " " + monthnameforvocal);
                        }
                        else if (data.result.fulfillment.speech === '@day') {
                            timevocal = 1;
                            Speech(dayofweekvocal);
                        }
                        else if (data.result.fulfillment.speech === '@refresh') {
                            //timevocal = 1;
                            location.reload(true);
                            Speech("reloading");
                        }
                        else {
                            if (data.result.metadata.intentName === "users_name") {
                                chrome.storage.local.get(/* String or Array */["username"], function (items) {
                                    if (items.username === undefined) {
                                        Speech("you didn't told me your name Yet . Please Tell me your name . ");
                                    }
                                    else
                                        Speech(speech + " " + items.username);
                                });

                            }
                            else
                                Speech(speech);
                        }
                    }
                }
                else {
                    setResponse(data.result.fulfillment.speech);
                    window.open('http://google.com/search?q=' + text);
                }
            },
            error: function () {
                setResponse("Internal Server Error");
            }
        });
    }
    else {
        Speech("opening");
        window.open('http://' + text);
        $("#chatbox").val("");
    }
}
function setResponse(val) {
    Speech(val);
}
//for Daily Quotes
     $.getJSON("http://quotes.rest/qod.json", function (result) {
        $("#quotesp").text(result.contents.quotes[0].quote);
        $("#quotesc").text("-"+result.contents.quotes[0].author);

    });    
////////////////////
/////////////////////////////////////
var faron = 0;
    function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
      alert(); 
    }
}

function showPosition(position) {
    $.getJSON("https://api.openweathermap.org/data/2.5/weather?appid=424dfd1d89269bb727a865a4d5ce0dbb&lat="+position.coords.latitude+"&lon="+position.coords.longitude, function (result) {
    $("#city").text(result.name+","+result.sys.country);
    if(faron == 0){
    $("#temp").html((result.main.temp.toFixed(0)-273.15).toFixed(0)+"&#8451;");
    }
    else
        $("#temp").html((result.main.temp.toFixed(0)*9/5 - 459.67).toFixed(0)+"&#8457;");
    $("#desc").text(result.weather[0].description); 
    });
}

$("#defar").click(function(){
    chrome.storage.local.get(["defar"],function(items2){
                 
                    if(items2.defar === "on"){
                        chrome.storage.local.set({"defar" : "off"},function(){
                            $("#defar").text("OFF");
                            faron=0;
                            getLocation();
                        });
                    }
                    else{
                        chrome.storage.local.set({"defar" : "on"},function(){});
                        $("#defar").text("ON");
                        faron = 1;
                        getLocation();  
                    }
        });
});

defar();
function defar(){
    chrome.storage.local.get(["defar"],function(items2){
                if(items2.defar === undefined){
                    chrome.storage.local.set({"defar" : "off"},function(){});
                    $("#defar").text("OFF");
                    faron=0;
                    getLocation();
                 }
                 else{
                    if(items2.defar === "on"){
                        $("#defar").text("ON");
                        faron=1;
                        getLocation();
                        
                    }
                    else{
                        $("#defar").text("OFF");
                        faron=0;
                        getLocation();

                    }
                 }
    });
}
//////////////////////////////////////


// fuction to set timezone and country code
    $.getJSON("http://freegeoip.net/json/", function (result) {
        $.each(result, function (i, field) {
            if (i == "time_zone") {
                timezone = field;
                //timefun();
            }
            if (i == "country_code") {
                countrycode = field;
            }
        });
    });
    var sec = 1000;
    var dayofweekname;
    var day;
    var monthname;
    var year;
    var servertime = false;
    //////////////////////////////
function Speech(say) {
    if ('speechSynthesis' in window && talking) {
        var language = window.navigator.userLanguage || window.navigator.language;
        var utterance = new SpeechSynthesisUtterance(say);
        //msg.voice = voices[10]; // Note: some voices don't support altering params
        //msg.voiceURI = 'native';
        if (timevocal == 1) {
            utterance.volume = 1; // 0 to 1
            utterance.pitch = 0; //0 to 2
            utterance.voiceURI = 'native';
            utterance.lang = "en-IN";
            speechSynthesis.speak(utterance);
            timevocal = 0
        }
        else {
            utterance.volume = 1; // 0 to 1
            //utterance.rate = 0.1; // 0.1 to 10
            utterance.pitch = 0; //0 to 2
            //utterance.text = 'Hello World';
            utterance.voiceURI = 'native';
            utterance.lang = "hi-IN";
            speechSynthesis.speak(utterance);
        }
    }
}