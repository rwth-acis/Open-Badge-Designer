// on start-up prepare necessary UI elements

var UIDiv;

$(document).ready(function(){
    // check location within HTML page to start adding elements
    UIDiv = document.getElementById("frontendUI");
    constructMainMenu();
});

/*
    function to generate the Main Menu using DOM Elements
*/
function constructMainMenu(){
    removeAllChildren(UIDiv);

    
    
    var titleText = document.createTextNode("Open Badge Designer");
    var titleTextP = document.createElement("p");
        titleTextP.appendChild(titleText);
    
    var assistedBadgeButton = document.createElement("BUTTON");
        assistedBadgeButton.appendChild(document.createTextNode("Assisted Badge Design Mode"));
        assistedBadgeButton.onclick = constructAssistedBadgeMode;
        assistedBadgeButton.style.width = '223px'
    var assistedBadgeButtonP = document.createElement("p");
        assistedBadgeButtonP.appendChild(assistedBadgeButton);
    
    var manualBadgeButton = document.createElement("BUTTON");
        manualBadgeButton.appendChild(document.createTextNode("Manual Badge Design Mode  "));
        manualBadgeButton.onclick = constructManualBadgeMode;
        manualBadgeButton.style.width = '223px'
    var manualBadgeButtonP = document.createElement("p");
        manualBadgeButtonP.appendChild(manualBadgeButton);
        
    var compareButton = document.createElement("BUTTON");
        compareButton.appendChild(document.createTextNode("Data Comparison Mode      "));
        compareButton.onclick = constructCompareMode;
        compareButton.style.width = '223px'
    var compareButtonP = document.createElement("p");
        compareButtonP.appendChild(compareButton);
        
    appendChildren(UIDiv, titleTextP, assistedBadgeButtonP, manualBadgeButtonP, compareButtonP);
}

/*
    function to generate the Assisted Badge Design Mode using DOM Elements
*/
function constructAssistedBadgeMode(){
    removeAllChildren(UIDiv);
    
    var leftDiv = document.createElement("DIV");
    var rightDiv = document.createElement("DIV");
    UIDiv.appendChild(leftDiv);
    UIDiv.appendChild(rightDiv);
    
    // set style for UI (CSS)
    // this allows to split the screen into a left and right section
    leftDiv.style.width = '50%';
    leftDiv.style.left = 0;
    leftDiv.style.position = 'absolute';
    rightDiv.style.width = '50%';
    rightDiv.style.right = 0;
    rightDiv.style.position = 'absolute';
    
    // use different colors to see the Border between Divisions
    leftDiv.style.backgroundColor = 'papayawhip';
    rightDiv.style.backgroundColor = 'wheat';
    
    appendPWithReturnButton(leftDiv);
    appendDivWithBackendUI(leftDiv);
    
}

/*
    function to generate the Manual Badge Design Mode using DOM Elements
*/
function constructManualBadgeMode(){
    removeAllChildren(UIDiv);
    
    appendPWithReturnButton(UIDiv);
}

/*
    function to generate the Data Comparison Mode using DOM Elements
*/
function constructCompareMode(){
    removeAllChildren(UIDiv);
    
    var leftDiv = document.createElement("DIV");
    var rightDiv = document.createElement("DIV");
    UIDiv.appendChild(leftDiv);
    UIDiv.appendChild(rightDiv);
    
    // set style for UI (CSS)
    // this allows to split the screen into a left and right section
    leftDiv.style.width = '50%';
    leftDiv.style.left = 0;
    leftDiv.style.position = 'absolute';
    rightDiv.style.width = '50%';
    rightDiv.style.right = 0;
    rightDiv.style.position = 'absolute';
    
    // use different colors to see the Border between Divisions
    leftDiv.style.backgroundColor = 'papayawhip';
    rightDiv.style.backgroundColor = 'wheat';
    
    appendPWithReturnButton(leftDiv);
    appendDivWithBackendUI(leftDiv);
}

/*
    appends a paragraph with a 'Return to Menu' button to the selected element.
*/

function appendPWithReturnButton(elem){

    var returnButton = document.createElement("BUTTON");
        returnButton.appendChild(document.createTextNode("Return to Menu"));
        returnButton.onclick = constructMainMenu;
    var returnButtonP = document.createElement("p");
        returnButtonP.appendChild(returnButton);
        
    elem.appendChild(returnButtonP);
}

function appendDivWithBackendUI(elem){
    var backendDiv = document.createElement("DIV");
        backendDiv.style.backgroundColor = 'lightcoral';
    
    var backendText = document.createTextNode("Step 1 (necessary): connect to a Backend instance");
    var backendTextP = document.createElement("p");
        backendTextP.appendChild(backendText);
        backendTextP.append(backendText);
    
    var backendField = document.createElement("INPUT");
    setAttributes(backendField,
            ["type", "text"],
            ["placeholder", "http://localhost:9000"],
            ["id", "backendfield"]);
    var backendFieldP = document.createElement("p");
        backendFieldP.appendChild(backendField);
    
    var backendButton = document.createElement("BUTTON");
    backendButton.appendChild(document.createTextNode("Test Connection"));
    backendButton.onclick = checkConnection;  
    var backendButtonP = document.createElement("p");
        backendButtonP.style.textAlign = 'right';
        backendButtonP.appendChild(backendButton);
    
    appendChildren(backendDiv, backendTextP, backendFieldP, backendButtonP);
    
    elem.appendChild(backendDiv);
}

/*
    appends a division containing the UI used to set the data source location
    ( source refers to the Learning Record Store [LRS] holding the xAPI data )
*/
function appendDivWithSourceUI(elem){
    
    sourceDiv = document.createElement("DIV");
    
    
    elem.appendChild(sourceDiv);
}

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
    // next set colors
    xapi.style.backgroundColor = 'lightsalmon';
    declarations.style.backgroundColor = 'lightpink';
    analytics.style.backgroundColor = 'lightgreen';
    recommendations.style.backgroundColor = 'lightsteelblue';
    badgesurvey.style.backgroundColor = 'lightyellow';
    
    // prepare paragraphs
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
    appendChildren(left, xapi, declarations, badgesurvey);
    appendChildren(right, analytics, recommendations);
    appendChildren(xapi, urltextlocation, urlfieldlocation, authorizetextlocation, authorizefieldlocation, xapibuttonlocation);
    appendChildren(declarations, declarationstextlocation, declarationsselectlocation, declarationsConstraintsTextLocation, declarationsConstraintsFieldLocation, declarationsbuttonlocation);
    appendChildren(analytics, analyticstextlocation, analyticscanvaslocation);

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
        analyticscanvas.setAttribute("id", "canvas1");
        analyticscanvas.setAttribute("width", "100");
        analyticscanvas.setAttribute("height", "50");
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

// remove all children from an HTML element to make space for new ones.
function removeAllChildren(elem){
    while (elem.firstChild){
        elem.removeChild(elem.firstChild);
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
    
    var results;
    
    $.ajax({
        url: encodeURI(backend+"/analysexapi?url="+xapilocation+"&auth="+xapiauth+"&functionparam1="+option1+"&functionparam2="+option2+"&key="+key+"&constraints="+constraints)
    }).then(function(data, status, jqxhr) {
	    console.log("jqxhr: "+jqxhr);
	    console.log("data: "+data);
	    results = JSON.parse(data);
	    alert(results.status);
	    
	    var labels = [];
        var values = [];
        for(var i=0; i<results.values.length; i++){
            labels.push(results.values[i][0]);
            values.push(results.values[i][1]);
        }
        console.log(labels);
        console.log(values);
        
        var canvas = document.getElementById("canvas1");
        var chart = new Chart(canvas,
                {   
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                data: values
                            }
                        ]
                    },
                    options: {
                        scales: {
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: results.keyX
                                }
                            }],
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: results.keyY
                                }
                            }]
                        }
                    }
                });
                
	    
    }).fail(function(xhr, status, error){
        alert("Error: please check if a backend instance is running at the specified location.");
    });
    
    
    
}

