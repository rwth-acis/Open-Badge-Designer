// on start-up prepare necessary UI elements

$(document).ready(function(){
    constructUI();
});


/*
    The UI could alternatively be made directly as part of HTML with CSS styling.
    The constructUI() function is simply there to make it easier to add this frontend
    to any existing page without major changes. All that's needed is a div tag with
    the 'frontendUI' ID as seen in the index.html used to launch this during development.
*/
function constructUI(){
    // check location within HTML page to start building elements
    var location = document.getElementById("frontendUI");
    
    // prepare divisions
    var left = document.createElement("DIV");
    var right = document.createElement("DIV");
    location.appendChild(left);
    location.appendChild(right);
    var backend = document.createElement("DIV");
    var xapi = document.createElement("DIV");
    var declarations = document.createElement("DIV");
    var analytics = document.createElement("DIV");
    var recommendations = document.createElement("DIV");
    var badgesurvey = document.createElement("DIV");
    
    // set style for UI (CSS)
    // this allows to split the screen into a left and right section
    left.style.backgroundColor = 'papayawhip';
    left.style.width = '50%';
    left.style.left = 0;
    left.style.position = 'absolute';
    right.style.backgroundColor = 'wheat';
    right.style.width = '50%';
    right.style.right = 0;
    right.style.position = 'absolute';
    backend.style.backgroundColor = 'lightcoral';
    xapi.style.backgroundColor = 'lightsalmon';
    declarations.style.backgroundColor = 'lightpink';
    analytics.style.backgroundColor = 'lightgreen';
    recommendations.style.backgroundColor = 'lightsteelblue';
    badgesurvey.style.backgroundColor = 'lightyellow'
    
    // prepare paragraphs
    var backendtextlocation = document.createElement("p");
    var backendfieldlocation = document.createElement("p");
    var backendbuttonlocation = document.createElement("p");
        backendbuttonlocation.style.textAlign = 'right';
    var urltextlocation = document.createElement("p");
    var urlfieldlocation = document.createElement("p");
    var authorizetextlocation = document.createElement("p");
    var authorizefieldlocation = document.createElement("p");
    var xapibuttonlocation = document.createElement("p");
        xapibuttonlocation.style.textAlign = 'right';
    var declarationstextlocation = document.createElement("p");
    var declarationsselectlocation = document.createElement("p");
    var declarationsConstraintsTextLocation = document.createElement("p");
    var declarationsConstraintsFieldLocation = document.createElement("p");
    var declarationsbuttonlocation = document.createElement("p");
        declarationsbuttonlocation.style.textAlign = 'right';
    var analyticstextlocation = document.createElement("p");
    var analyticscanvaslocation = document.createElement("p");
    
    
    // assign paragraphs to divisions
    appendChildren(left, backend, xapi, declarations, badgesurvey);
    appendChildren(right, analytics, recommendations);
    appendChildren(backend, backendtextlocation, backendfieldlocation, backendbuttonlocation);
    appendChildren(xapi, urltextlocation, urlfieldlocation, authorizetextlocation, authorizefieldlocation, xapibuttonlocation);
    appendChildren(declarations, declarationstextlocation, declarationsselectlocation, declarationsConstraintsTextLocation, declarationsConstraintsFieldLocation, declarationsbuttonlocation);
    appendChildren(analytics, analyticstextlocation, analyticscanvaslocation);

    // create elements for entering the URL of the Backend
    var backendtext = document.createTextNode("Step 1 (necessary): connect to a Backend instance");
    var backendfield = document.createElement("INPUT");
    setAttributes(backendfield,
            ["type", "text"],
            ["placeholder", "http://localhost:9000"],
            ["id", "backendfield"]);
    
    // add a button to call checkConnection on click
    var backendbutton = document.createElement("BUTTON");
    backendbutton.appendChild(document.createTextNode("Test Connection"));
    backendbutton.onclick = checkConnection;

    // create elements for entering the URL of LRS
    var urlfield = document.createElement("INPUT");
    setAttributes(urlfield,
            ["type", "text"],
            ["placeholder", "http://localhost"],
            ["id", "urlfield"]);
    var urltext = document.createTextNode("Add URL of the statements section of your LRS here: ");
    
    // create elements for entering authorization for LRS
    var authorizefield = document.createElement("INPUT");
    setAttributes(authorizefield,
            ["type", "text"],
            ["placeholder", "Basic MTZlODUyNzllYTQ5YzA5YTkzNGE2N2RhOWQzMjQ5M2Y1YTI1OTc5MjpjYWM3YTExYTJhY2E0N2Y2YjMxMDI4YjhkNjA3MTg4MjM2NTk0Y2Yy"],
            ["id", "authfield"]);
    var authorizetext = document.createTextNode("Add HTTP authorization for the LRS");
    
    // add a button to call checkXAPIConnection on click
    var xapibutton = document.createElement("BUTTON");
    xapibutton.appendChild(document.createTextNode("Test Connection"));
    xapibutton.onclick = checkXAPIConnection;
    
    // add a section to make declarations for how the xAPI data should be interpreted (Analytics)
    var declarationstext = document.createTextNode("To visualize xAPI data and gain recommendations, please fill in the following information:");
    var declarationsselect1 = document.createElement("SELECT");
        declarationsselect1.setAttribute("id", "decselect1");
        var declarationsoption1_1 = document.createElement("OPTION");
            declarationsoption1_1.appendChild(document.createTextNode("Minimise"));
            declarationsoption1_1.setAttribute("value", "min");
            declarationsselect1.appendChild(declarationsoption1_1);
        var declarationsoption1_2 = document.createElement("OPTION");
            declarationsoption1_2.appendChild(document.createTextNode("Maximise"));
            declarationsoption1_2.setAttribute("value", "max");
            declarationsselect1.appendChild(declarationsoption1_2);
    var declarationsselect2 = document.createElement("select");
        declarationsselect2.setAttribute("id", "decselect2");
        var declarationsoption2_1 = document.createElement("OPTION");
            declarationsoption2_1.appendChild(document.createTextNode("Value"));
            declarationsoption2_1.setAttribute("value", "val");
            declarationsselect2.appendChild(declarationsoption2_1);
        var declarationsoption2_2 = document.createElement("OPTION");
            declarationsoption2_2.appendChild(document.createTextNode("Occurrence"));
            declarationsoption2_2.setAttribute("value", "occur");
            declarationsselect2.appendChild(declarationsoption2_2);
    var declarationsvaluefield = document.createElement("INPUT");
    setAttributes(declarationsvaluefield,
            ["type", "text"],
            ["placeholder", "timestamp"],
            ["id", "declarationsvaluefield"]);
    var declarationsvaluetext = document.createTextNode("(the xAPI key to process)");
    var declarationsConstraintsText = document.createTextNode("The following allows to set constraints in comma-separated key:value pairs (timestamps are in ISO 8601 format)");
    var declarationsConstraintsField = document.createElement("TEXTAREA");
    setAttributes(declarationsConstraintsField,
            ["rows","5"],
            ["cols","60"],
            ["placeholder", "since : 2001-01-01T00:00:00.000Z,\nuntil : 2019-01-01T00:00:00.000Z,\nagent:{\"mbox\":\"mailto : max.mustermann@example.com\"},\nverb : http://example.com/verbs/someEpicVerb,\nactivity : http://example.com/activities/someAmazingObject"],
            ["id", "declarationsconstraintsfield"]);
    
    // add a button to call a function to analyse the LRS on given declarations (TODO:: implement)
    var declarationsbutton = document.createElement("BUTTON");
    declarationsbutton.appendChild(document.createTextNode("Analyse"));
    declarationsbutton.onclick = analyseXAPI;
    
    // add a section to hold a badge design survey
    
    // add a section to display analytics
    var analyticstext = document.createTextNode("Analytics go here. Enter declarations and hit the Analyse button to get results.");
    var analyticscanvas = document.createElement("CANVAS");
    // add a section to display badge recommendations
    
    // add elements to their respective paragraphs / divisions
    backendtextlocation.append(backendtext);
    backendfieldlocation.appendChild(backendfield);
    backendbuttonlocation.appendChild(backendbutton);
    urltextlocation.appendChild(urltext);
    urlfieldlocation.appendChild(urlfield);
    authorizefieldlocation.appendChild(authorizefield);
    authorizetextlocation.appendChild(authorizetext);
    xapibuttonlocation.appendChild(xapibutton);
    declarationstextlocation.appendChild(declarationstext);
    appendChildren(declarationsselectlocation, declarationsselect1, declarationsselect2, declarationsvaluefield, declarationsvaluetext);
    declarationsConstraintsTextLocation.appendChild(declarationsConstraintsText);
    declarationsConstraintsFieldLocation.appendChild(declarationsConstraintsField);
    declarationsbuttonlocation.appendChild(declarationsbutton);
    analyticstextlocation.appendChild(analyticstext);
    analyticscanvaslocation.appendChild(analyticscanvas);
}

// append several children at once
function appendChildren(elem /*children can be passed here */){
    for (var i=1; i<arguments.length; i+=1){
        elem.appendChild(arguments[i]);
    }
}

// apply several [attribute, value] pairs at once
function setAttributes(elem /*[attribute, value] pairs can be passed here*/){
    for (var i=1; i<arguments.length; i+=1){
        elem.setAttribute(arguments[i][0], arguments[i][1]);
    }
}

function checkConnection(){
    var backend = document.getElementById("backendfield").value;
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

function checkXAPIConnection(){
    var backend = document.getElementById("backendfield").value;
    var xapilocation = document.getElementById("urlfield").value;
    var xapiauth = document.getElementById("authfield").value;
    
    if(backend == "")
        backend = document.getElementById("backendfield").placeholder;
    if(xapilocation == "")
        xapilocation = document.getElementById("urlfield").placeholder;
    if(xapiauth == "")
        xapiauth = document.getElementById("authfield").placeholder;
        
    $.ajax({
        url: backend+"/checkxapiconnection?url="+xapilocation+"&auth="+xapiauth
    }).then(function(data, status, jqxhr) {
	    console.log("jqxhr: "+jqxhr);
	    console.log("data: "+data);
	    alert(data);
    }).fail(function(xhr, status, error){
        alert("Error: please check if a backend instance is running at the specified location.");
    });
}

function analyseXAPI(){
    var backend = document.getElementById("backendfield").value;
    var xapilocation = document.getElementById("urlfield").value;
    var xapiauth = document.getElementById("authfield").value;
    
    if(backend == "")
        backend = document.getElementById("backendfield").placeholder;
    if(xapilocation == "")
        xapilocation = document.getElementById("urlfield").placeholder;
    if(xapiauth == "")
        xapiauth = document.getElementById("authfield").placeholder;

    var select1 = document.getElementById("decselect1");
    var select2 = document.getElementById("decselect2");
    
    var keyfield = document.getElementById("declarationsvaluefield");
    var constraintsfield = document.getElementById("declarationsconstraintsfield");
    
    var option1 = select1.options[select1.selectedIndex].value;
    var option2 = select2.options[select2.selectedIndex].value;
    
    var key = keyfield.placeholder.replace(/\s/g, '');
    var constraints = constraintsfield.placeholder.replace(/\s/g, '');
    
    console.log("option1: "+option1+" option2: "+option2+" key: "+key+" constraints: "+constraints);
    
    $.ajax({
        url: encodeURI(backend+"/analysexapi?url="+xapilocation+"&auth="+xapiauth+"&functionparam1="+option1+"&functionparam2="+option2+"&key="+key+"&constraints="+constraints)
    }).then(function(data, status, jqxhr) {
	    console.log("jqxhr: "+jqxhr);
	    console.log("data: "+data);
	    alert(data);
    }).fail(function(xhr, status, error){
        alert("Error: please check if a backend instance is running at the specified location.");
    });
    
}

