// on start-up prepare necessary UI elements

$(document).ready(function(){
    constructUI();
});


function constructUI(){
    // check location within HTML page to start building elements
    var location = document.getElementById("frontendUI");
    
    var left = document.createElement("div");
    var right = document.createElement("div");

    location.appendChild(left);
    location.appendChild(right);

    left.style.backgroundColor = 'papayawhip';
    left.style.width = '50%';
    left.style.left = 0;
    left.style.position = 'fixed';
    right.style.backgroundColor = 'wheat';
    right.style.width = '50%';
    right.style.right = 0;
    right.style.position = 'fixed';

    var backendtextlocation = document.createElement("p");
    var backendfieldlocation = document.createElement("p");
    var backendbuttonlocation = document.createElement("p");
    var urltextlocation = document.createElement("p");
    var urlfieldlocation = document.createElement("p");
    var authorizetextlocation = document.createElement("p");
    var authorizefieldlocation = document.createElement("p");
    
    left.appendChild(backendtextlocation);
    left.appendChild(backendfieldlocation);
    left.appendChild(backendbuttonlocation);
    right.appendChild(urltextlocation);
    right.appendChild(urlfieldlocation);
    right.appendChild(authorizetextlocation);
    right.appendChild(authorizefieldlocation);

    // create a field to enter the URL of the Backend
    var backendtext = document.createTextNode("Step 1 (necessary): connect to a Backend instance");
    backendtextlocation.append(backendtext);
    var backendfield = document.createElement("INPUT");
    setAttributes(backendfield,
            "type", "text",
            "placeholder", "http://localhost:9000",
            "id", "backendfield");
    backendfieldlocation.appendChild(backendfield);
    var backendbutton = document.createElement("BUTTON");
    backendbutton.appendChild(document.createTextNode("Test Connection"));
    backendbutton.onclick = checkConnection;
    backendbuttonlocation.appendChild(backendbutton);

    // create a field to enter the URL of LRS
    var urlfield = document.createElement("INPUT");
    setAttributes(urlfield,
            "type", "text",
            "placeholder", "http://localhost/data/xAPI/statements");
    urlfieldlocation.appendChild(urlfield);
    var urltext = document.createTextNode("Add URL of the statements section of your LRS here: ");
    urltextlocation.appendChild(urltext);
    
    // create a field to enter authorization for LRS
    var authorizefield = document.createElement("INPUT");
    setAttributes(authorizefield,
            "type", "text",
            "placeholder", "Basic MTZlODUyNzllYTQ5YzA5...");
    authorizefieldlocation.appendChild(authorizefield);
    var authorizetext = document.createTextNode("Add HTTP authorization for the LRS");
    authorizetextlocation.appendChild(authorizetext);
}

// function from stack overflow (license needed?)
function setAttributes(elem /*additional attribute, value pairs can be passed*/){
    for (var i = 1; i < arguments.length; i+=2){
        elem.setAttribute(arguments[i], arguments[i+1]);
    }
}

function appendChildren(elem /* children can be passed here */){
    for (var i=1; i < arguments.length; i+=1){
        elem.appendChild(arguments[i]);
    }
}

function checkConnection(){
    var backend = document.getElementById("backendfield").value;
    console.log("backend:" + backend);
    if(backend == ""){
        backend = document.getElementById("backendfield").placeholder;
    }
    $.ajax({
        url: backend+"/checkconnection"
    }).then(function(data, status, jqxhr) {
	    console.log("jqxhr: "+jqxhr);
	    console.log("data: "+data);
	    alert(data);
    }).fail(function(xhr, status, error){
        alert("Error: please check if a backend instance is running at the specified location.");
    });
}

/*
$(document).ready(function(){
    $.ajax({
        url: "http://localhost:9000/replytest"
    }).then(function(data, status, jqxhr) {
        $('.answer').append(data);
	console.log("jqxhr: "+jqxhr);
	console.log("data: "+data);
    });
    $.ajax({
        url: "http://localhost:9000/xapitest"
    }).then(function(data, status, jqxhr) {
        $('.xapi').append(data);
	console.log("jqxhr: "+jqxhr);
	console.log("data: "+data);
    });
});*/
