

function myFunction()
{



	var xhr = new XMLHttpRequest();
	xhr.open('GET', "https://icanhazdadjoke.com/");
	xhr.setRequestHeader("Accept", "application/json");
	xhr.send();
	 
	xhr.addEventListener("readystatechange", processRequest, false);
	function processRequest(e) {
	    if (xhr.readyState == 4 && xhr.status == 200) {
	    	//alert(xhr.responseText);
	        var response = xhr.responseText;
	        x = JSON.parse(response);
	        document.getElementById("demo").innerHTML = x["joke"];
	        //alert(x["joke"]);
	    }
	}


}

window.onload = function() 
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', "https://icanhazdadjoke.com/");
	xhr.setRequestHeader("Accept", "application/json");
	xhr.send();
	 
	xhr.addEventListener("readystatechange", processRequest, false);
	function processRequest(e) {
	    if (xhr.readyState == 4 && xhr.status == 200) {
	    	//alert(xhr.responseText);
	        var response = xhr.responseText;
	        x = JSON.parse(response);
	        document.getElementById("demo").innerHTML = x["joke"];
	        //alert(x["joke"]);
	    }
	}
}



document.getElementById("demo").addEventListener("click", myFunction);

document.getElementById('add').addEventListener('click', myFunction);

document.getElementById('jokes_back').addEventListener('click', function() {
    document.location.href = "../popup.html";
});