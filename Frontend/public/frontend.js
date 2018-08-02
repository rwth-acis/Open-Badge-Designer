// on start-up prepare necessary UI elements

$(document).ready(function(){
    constructUI();
});


function constructUI(){
    // check location within HTML page to start building elements
    var location = document.getElementById("frontendUI");
    
    // prepare divisions
    var left = document.createElement("div");
    var right = document.createElement("div");
    location.appendChild(left);
    location.appendChild(right);
    
    // set style for UI (CSS)
    left.style.backgroundColor = 'papayawhip';
    left.style.width = '50%';
    left.style.left = 0;
    left.style.position = 'fixed';
    right.style.backgroundColor = 'wheat';
    right.style.width = '50%';
    right.style.right = 0;
    right.style.position = 'fixed';

    // prepare paragraphs
    var backendtextlocation = document.createElement("p");
    var backendfieldlocation = document.createElement("p");
    var backendbuttonlocation = document.createElement("p");
    var urltextlocation = document.createElement("p");
    var urlfieldlocation = document.createElement("p");
    var authorizetextlocation = document.createElement("p");
    var authorizefieldlocation = document.createElement("p");
    
    // assign paragraphs to divisions
    appendChildren(left, backendtextlocation, backendfieldlocation, backendbuttonlocation);
    appendChildren(right, urltextlocation, urlfieldlocation, authorizetextlocation, authorizefieldlocation);

    // create elements for entering the URL of the Backend
    var backendtext = document.createTextNode("Step 1 (necessary): connect to a Backend instance");
    var backendfield = document.createElement("INPUT");
    setAttributes(backendfield,
            "type", "text",
            "placeholder", "http://localhost:9000",
            "id", "backendfield");
    var backendbutton = document.createElement("BUTTON");
    backendbutton.appendChild(document.createTextNode("Test Connection"));
    backendbutton.onclick = checkConnection;

    // create elements for entering the URL of LRS
    var urlfield = document.createElement("INPUT");
    setAttributes(urlfield,
            "type", "text",
            "placeholder", "http://localhost/data/xAPI/statements");
    var urltext = document.createTextNode("Add URL of the statements section of your LRS here: ");
    
    // create elements for entering authorization for LRS
    var authorizefield = document.createElement("INPUT");
    setAttributes(authorizefield,
            "type", "text",
            "placeholder", "Basic MTZlODUyNzllYTQ5YzA5...");
    var authorizetext = document.createTextNode("Add HTTP authorization for the LRS");
    
    // add elements to their respective paragraphs / divisions
    backendtextlocation.append(backendtext);
    backendfieldlocation.appendChild(backendfield);
    backendbuttonlocation.appendChild(backendbutton);
    urltextlocation.appendChild(urltext);
    urlfieldlocation.appendChild(urlfield);
    authorizefieldlocation.appendChild(authorizefield);
    authorizetextlocation.appendChild(authorizetext);
}

// function from stack overflow (license needed?)
// apply several attribute, value pairs at once
function setAttributes(elem /*additional attribute, value pairs can be passed*/){
    for (var i = 1; i < arguments.length; i+=2){
        elem.setAttribute(arguments[i], arguments[i+1]);
    }
}

// append several children at once
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
