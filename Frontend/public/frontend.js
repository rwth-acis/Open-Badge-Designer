// on start-up prepare necessary UI elements

var UIDiv;
var twoFields = false;

// connection settings
var backend;
var lrs;
var auth;

// statement settings
var since1 = "";
var since2 = "";
var until1 = "";
var until2 = "";
var option1;
var option2;
var key;
var object;
var action;
var constraints;

var chart1 = null;
var chart2 = null;
var badgesDiv;
var badgeRecommendations = [];

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
    appendDivWithSourceUI(leftDiv);
    appendDivWithDeclarationsUI(leftDiv);
    appendDivWithAnalyticsUI(rightDiv, "canvas1");
    appendDivForBadgeRecommendations(rightDiv);
    
}

/*
    function to generate the Manual Badge Design Mode using DOM Elements
*/
function constructManualBadgeMode(){
    removeAllChildren(UIDiv);
    
    appendPWithReturnButton(UIDiv);
	
	appendDivWithBadgeUI(UIDiv);
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
    appendDivWithSourceUI(leftDiv);
    appendDivWithDeclarationsUI(leftDiv);
    
    var sinceText = document.createTextNode("Since: ");
    var sinceField = document.createElement("INPUT");
    setAttributes(sinceField,
        ["type", "text"],
        ["placeholder", "2001-01-01T00:00:00.000Z"],
        ["id", "sincefieldc"]);
    var untilText = document.createTextNode("Until: ");
    var untilField = document.createElement("INPUT");
    setAttributes(untilField,
        ["type", "text"],
        ["placeholder", "2019-01-01T00:00:00.000Z"],
        ["id", "untilfieldc"]);
    var sinceUntilCompareP = document.getElementById("sinceuntilcomparep")
    appendChildren(sinceUntilCompareP, sinceText, sinceField, untilText, untilField);
    
    appendDivWithAnalyticsUI(rightDiv, "canvas1");
    appendDivWithAnalyticsUI(rightDiv, "canvas2");
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
    
    //return new element to allow editing it later
    return returnButtonP;
}

/*
    appends a division containing the UI for entering Backend information.
*/

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
            ["placeholder", "http://localhost:9003/OpenBadgeDesigner"],
            ["id", "backendfield"]);
    var backendFieldP = document.createElement("p");
        backendFieldP.appendChild(backendField);
    
    var backendButton = document.createElement("BUTTON");
    backendButton.appendChild(document.createTextNode("Set Backend Connection"));
    backendButton.onclick = setConnection;  
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
    sourceDiv.style.backgroundColor = 'lightsalmon';
    
    // create elements for information for the LRS
    var urlText = document.createTextNode("Add URL of your Learning Record Store: ");
    var urlTextP = document.createElement("p");
        urlTextP.appendChild(urlText);
    
    var urlField = document.createElement("INPUT");
    setAttributes(urlField,
            ["type", "text"],
            ["placeholder", "http://localhost"],
            ["id", "urlfield"]);
    var urlFieldP = document.createElement("p");
        urlFieldP.appendChild(urlField);
    
    var authorizeField = document.createElement("INPUT");
    setAttributes(authorizeField,
            ["type", "text"],
            ["placeholder", "Basic MTZlODUyNzllYTQ5YzA5YTkzNGE2N2RhOWQzMjQ5M2Y1YTI1OTc5MjpjYWM3YTExYTJhY2E0N2Y2YjMxMDI4YjhkNjA3MTg4MjM2NTk0Y2Yy"],
            ["id", "authfield"]);
    var authorizeFieldP = document.createElement("p");
        authorizeFieldP.appendChild(authorizeField);
    
    var authorizeText = document.createTextNode("Add HTTP authorization for the LRS");
    var authorizeTextP = document.createElement("p");
        authorizeTextP.appendChild(authorizeText);
   
    var setButton = document.createElement("BUTTON");
        setButton.appendChild(document.createTextNode("Set LRS Connection"));
        setButton.onclick = setXAPIConnection;
    var setButtonP = document.createElement("p");
        setButtonP.style.textAlign = 'right';
        setButtonP.appendChild(setButton);
    
    appendChildren(sourceDiv, urlTextP, urlFieldP, authorizeTextP, authorizeFieldP, setButtonP);
    
    elem.appendChild(sourceDiv);
}

function appendDivWithDeclarationsUI(elem){
    
    declareDiv = document.createElement("DIV");
    declareDiv.style.backgroundColor = 'lightpink';
    
    
    var buttonP = document.createElement("p");
        buttonP.style.textAlign = 'right';
    
    // add a section to make declarations for how the xAPI data should be interpreted (Analytics)
    var text = document.createTextNode("To visualize xAPI data and gain recommendations, please fill in the following information:");
    var textP = document.createElement("p");
        textP.appendChild(text);
    
    /*
    var select1 = document.createElement("SELECT");
        select1.setAttribute("id", "decselect1");
        var option1_1 = document.createElement("OPTION");
            option1_1.appendChild(document.createTextNode("Minimise"));
            option1_1.setAttribute("value", "min");
        select1.appendChild(option1_1);
        var option1_2 = document.createElement("OPTION");
            option1_2.appendChild(document.createTextNode("Maximise"));
            option1_2.setAttribute("value", "max");
        select1.appendChild(option1_2);
    var select2 = document.createElement("select");
        select2.setAttribute("id", "decselect2");
        var option2_1 = document.createElement("OPTION");
            option2_1.appendChild(document.createTextNode("Value"));
            option2_1.setAttribute("value", "val");
            select2.appendChild(option2_1);
        var option2_2 = document.createElement("OPTION");
            option2_2.appendChild(document.createTextNode("Occurrence"));
            option2_2.setAttribute("value", "occur");
            select2.appendChild(option2_2);*/
    var keyField = document.createElement("INPUT");
    setAttributes(keyField,
            ["type", "text"],
            ["placeholder", "timestamp"],
            ["id", "declarationskeyfield"]);
    var objectField = document.createElement("INPUT");
    setAttributes(objectField,
            ["type", "text"],
            ["placeholder", "http://example.com/activities/someAmazingObject"],
            ["id", "declarationsobjectfield"]);
    var actionField = document.createElement("INPUT");
    setAttributes(actionField,
            ["type", "text"],
            ["placeholder", "http://example.com/verbs/someEpicVerb"],
            ["id", "declarationsactionfield"]);
    //TODO:: add link to wiki (once created) to explain options on input
    var keyText = document.createTextNode("The xAPI statement-key to use.");
    var objectText = document.createTextNode("The xAPI activity (object) to check for.");
    var actionText = document.createTextNode("The xAPI verb (action) to check for.");
    //var selectP = document.createElement("p");
    //appendChildren(selectP, select1, select2, keyField, keyText);
    var keyP = document.createElement("p");
    var objectP = document.createElement("p");
    var actionP = document.createElement("p");
    
    appendChildren(keyP, keyText, keyField);
    appendChildren(actionP, actionText, actionField);
    appendChildren(objectP, objectText, objectField);      
    
    var constraintsText = document.createTextNode("The following allows to set additional constraints in comma-separated key:value pairs (optional)");
    var constraintsTextP = document.createElement("p");
        constraintsTextP.appendChild(constraintsText);
    
    var constraintsField = document.createElement("TEXTAREA");
    setAttributes(constraintsField,
            ["rows","5"],
            ["cols","60"],
            ["placeholder", "agent:{\"mbox\":\"mailto : max.mustermann@example.com\"},\nverb : http://example.com/verbs/someEpicVerb,\nactivity : http://example.com/activities/someAmazingObject"],
            ["id", "declarationsconstraintsfield"]);
    var constraintsFieldP = document.createElement("p");
        constraintsFieldP.appendChild(constraintsField);
    
    var timeText = document.createTextNode("Timestamps: (timestamps are in ISO 8601 format)");
    var timeTextP = document.createElement("p");
        timeTextP.appendChild(timeText);
    
    var sinceText = document.createTextNode("Since: ");
    var sinceField = document.createElement("INPUT");
    setAttributes(sinceField,
        ["type", "text"],
        ["placeholder", "2001-01-01T00:00:00.000Z"],
        ["id", "sincefield"]);
    var untilText = document.createTextNode("Until: ");
    var untilField = document.createElement("INPUT");
    setAttributes(untilField,
        ["type", "text"],
        ["placeholder", "2019-01-01T00:00:00.000Z"],
        ["id", "untilfield"]);
    var sinceUntilP = document.createElement("p");
    appendChildren(sinceUntilP, sinceText, sinceField, untilText, untilField);
    
    var sinceUntilCompareP = document.createElement("p");
        sinceUntilCompareP.setAttribute("id", "sinceuntilcomparep");
        
    //since : ,\nuntil : ,\n
    
    // add a button to call a function to analyse the LRS on given declarations (TODO:: implement)
    var setButton = document.createElement("BUTTON");
        setButton.appendChild(document.createTextNode("Analyse"));
        setButton.onclick = analyseXAPI;
    var setButtonP = document.createElement("p");
        setButtonP.appendChild(setButton);
        setButtonP.style.textAlign = 'right';
        
    appendChildren(declareDiv, textP, keyP, actionP, objectP, constraintsTextP, constraintsFieldP, timeTextP, sinceUntilP, sinceUntilCompareP, setButtonP);
    
    elem.appendChild(declareDiv);
}

function appendDivWithAnalyticsUI(elem, canvasName){
    var analyticsDiv = document.createElement("DIV");
        analyticsDiv.style.backgroundColor = 'lightgreen';
    
    var text = document.createTextNode("Analytics go here. Enter declarations and hit the Analyse button to get results.");
    var textP = document.createElement("p");
        textP.appendChild(text);
    var canvas = document.createElement("CANVAS");
    setAttributes(canvas,
            ["id", canvasName],
            ["width", "100"],
            ["height", "50"]);
    var canvasP = document.createElement("p");
        canvasP.appendChild(canvas);
    
    appendChildren(analyticsDiv, textP, canvasP);
    
    elem.appendChild(analyticsDiv);
}

function appendDivForBadgeRecommendations(elem){
    var badgesDiv = document.createElement("DIV");
        badgesDiv.style.backgroundColor = 'lightblue';
        badgesDiv.id = "badgesdiv";
    var text = document.createTextNode("Badge Recommendations go here.");
    var textP = document.createElement("p");
        textP.appendChild(text);
        badgesDiv.appendChild(textP);
    
    elem.appendChild(badgesDiv);
}

/*
"badges":[{
    "name":"A new Badge",
    "description":"Earned by fulfilling the criteria!",
    "imageuri":"http://example.com/badges/a-new-badge.png",
    "criteriauri":"http://example.com/badges/a-new-badge-criteria.html",
    "criteria":"Reach a total SUM of 10413 on the values of xAPI key hour for action http://example.com/verbs/someEpicVerb on Object http://example.com/activities/someAmazingObject",
    "criteriamachinereadable":"
        object: http://example.com/activities/someAmazingObject, 
        action: http://example.com/verbs/someEpicVerb, 
        key: hour, 
        condition: SUM[value]>10413, 
        repetitions: 1",
    "issuer":"http://example.com/issuers/YOURNAME.json",
    "notes":"This Badge is scaled by 3 * the total sum for all included users. 
            This value may be much too large if data for all agents is used for a single user. 
            Please adjust."
    }
*/

function appendDivWithBadgeRecommendation(elem, badgeData){
    var badge = {};
    
    badge["DIV"] = document.createElement("DIV");
    badge["DIV"].style.backgroundColor = 'lightgreen';
    
    badge["name"] = badgeData["name"];
    //...
    
    var nameTextP = document.createElement("p");
        nameTextP.appendChild(document.createTextNode(badge["name"]));
    badge["DIV"].appendChild(nameTextP);
    
    elem.appendChild(badge["DIV"]);
}

function appendDivWithBadgeUI(elem){
	var badgeDiv = document.createElement("DIV");
	badgeDiv.style.border = '2px solid black';
	
	var bText = document.createTextNode("Open Badge Survey: If recommendations are used, applying a recommendation will overwrite some of the fields in this survey!");
	var textP = document.createElement("p");
		textP.appendChild(bText);
	
	var badgeFileDiv = document.createElement("DIV");
	var badgeFileText = document.createTextNode("If you wish to upload the Badge directly to the las2peer FileService, select a badge image from your file system to upload.");
	var badgeFileTextP = document.createElement("p");
		badgeFileTextP.appendChild(badgeFileText);
	var badgeFileInput = document.createElement("INPUT");
	setAttributes(badgeFileInput,
			["id", "badgefileinput"],
			["type", "file"],
			["name", "badgefilecontent"]);
	var badgeFileButton = document.createElement("BUTTON");
		badgeFileButton.appendChild(document.createTextNode("Upload to FileService"));
        badgeFileButton.onclick = uploadBadgeImageToFileService;
        badgeFileButton.style.width = '223px'
	var badgeFileInputP = document.createElement("p");
	appendChildren(badgeFileInputP, badgeFileInput, badgeFileButton);
		
	
	var badgeNameText = document.createTextNode("Badge Name: ");
	var badgeNameField = document.createElement("INPUT");
	setAttributes(badgeNameField, 
			["id", "badgename"],
			["type", "text"],
			["placeholder", "A new Badge"]);
	var badgeNameP = document.createElement("p");
	appendChildren(badgeNameP, badgeNameText, badgeNameField);
	
	var badgeDescriptionText = document.createTextNode("Badge Description: ");
	var badgeDescriptionField = document.createElement("TEXTAREA");
	setAttributes(badgeDescriptionField,
			["rows", "5"],
			["cols", "60"],
			["id", "badgedescription"],
			["placeholder", "Earned by fulfilling the criteria!"]);
	var badgeDescriptionP = document.createElement("p");
	appendChildren(badgeDescriptionP, badgeDescriptionText, badgeDescriptionField);
	
	var badgeCriteriaText = document.createTextNode("Criteria for earning the Badge: ");
	var badgeCriteriaField = document.createElement("TEXTAREA");
	setAttributes(badgeCriteriaField,
			["rows", "5"],
			["cols", "60"],
			["id", "badgecriteria"],
			["placeholder","Assisted Badge Mode allows to generate recommendations."]);
	var badgeCriteriaButton = document.createElement("BUTTON");
		badgeCriteriaButton.appendChild(document.createTextNode("Upload to FileService"));
        badgeCriteriaButton.onclick = uploadCriteriaToFileService;
        badgeCriteriaButton.style.width = '223px'
	
	
	var badgeCriteriaP = document.createElement("p");
	appendChildren(badgeCriteriaP, badgeCriteriaText, badgeCriteriaField, badgeCriteriaButton);
	
	var badgeCriteriaURIText = document.createTextNode("URI for Badge Criteria: ");
	var badgeCriteriaURIField = document.createElement("INPUT");
	setAttributes(badgeCriteriaURIField,
			["id", "badgecriteriauri"],
			["type", "text"],
			["placeholder", "http://example.com/badges/a-new-badge-criteria"]);
	var badgeCriteriaURIP = document.createElement("p");
	appendChildren(badgeCriteriaURIP, badgeCriteriaURIText, badgeCriteriaURIField);
	
	var badgeCriteriaMRText = document.createTextNode("Criteria in a machine-readable format: ");
	var badgeCriteriaMRField = document.createElement("TEXTAREA");
	setAttributes(badgeCriteriaMRField,
			["rows", "5"],
			["cols", "60"],
			["id", "badgecriteriamr"],
			["placeholder","For manual implementation outside you may leave this empty. For use with the Gamification-Framework, use of Recommendations in Assisted Mode are advised."]);
	var badgeCriteriaMRP = document.createElement("p");
	appendChildren(badgeCriteriaMRP, badgeCriteriaMRText, badgeCriteriaMRField);
	
	var issuerText = document.createTextNode("If you have never issued an Open Badge before, you should host an issuer file or generate one here: ")
	var issuerNameText = document.createTextNode("Issuer Name:");
	var issuerNameField = document.createElement("INPUT");
	setAttributes(issuerNameField,
			["id", "issuername"],
			["type", "text"],
			["placeholder", "max mustermann"]);
	var issuerNameP = document.createElement("p");
	appendChildren(issuerNameP, issuerNameText, issuerNameField);
	
	var issuerURLText = document.createTextNode("Issuer URL:");
	var issuerURLField = document.createElement("INPUT");
	setAttributes(issuerURLField,
			["id", "issuerurl"],
			["type", "text"],
			["placeholder", "http://example.com/badges"]);
	var issuerURLP = document.createElement("p");
	appendChildren(issuerURLP, issuerURLText, issuerURLField);
	
	var issuerButton = document.createElement("BUTTON");
		issuerButton.appendChild(document.createTextNode("Upload to FileService"));
		issuerButton.onclick = uploadIssuerDataToFileService;
		issuerButton.style.width = '223px';
		
	var submitButton = document.createElement("BUTTON");
        submitButton.appendChild(document.createTextNode("SUBMIT"));
        submitButton.onclick = uploadBadgeDataToFileservice;
        submitButton.style.width = '223px';
    var submitButtonP = document.createElement("p");
        submitButtonP.appendChild(submitButton);
		submitButtonP.appendChild(document.createTextNode(" to las2peer FileService. (You must be logged into OIDC for this!)"));
	
	appendChildren(badgeFileDiv, badgeFileTextP, badgeFileInputP);
	
	appendChildren(badgeDiv, textP, badgeFileDiv, badgeNameP, badgeDescriptionP, badgeCriteriaP, badgeCriteriaMRP, badgeCriteriaURIP, issuerText, issuerNameP, issuerURLP, issuerButton, submitButtonP);
	
	elem.append(badgeDiv);
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

// TODO:: make sure this works with both strings and numbers (I think it does?)
function compareKeys(a, b){
    return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0;
}

//TODO:: Finish implementation of upload function
function uploadBadgeDataToFileservice(){	
	var imageInput = document.getElementById("badgefileinput");
	
	var imageForm = new FormData();
	var classForm = new FormData();
	// var issuerForm = new FormData();
	
	imageForm.append("filecontent", imageInput.files[0]);
	imageForm.append("identifier", "testimageidentifier");
	imageForm.append("sharewithgroup", "");
	imageForm.append("excludefromindex", false);
	imageForm.append("description", "testdescription");

	var testClassJSON = {
		"key1" : 1,
		"key2" : "value2",
		"key3" : ["a","b"]
	};
	
	console.log(JSON.stringify(testClassJSON, null, 4));
	console.log(JSON.stringify(testClassJSON, null, 4).split('\n'));
	
	var classFile = new File(
			[JSON.stringify(testClassJSON, null, 4)],
			"testbadgeclass.json",
			{type: "text/plain"});
	
	classForm.append("filecontent", classFile);
	classForm.append("identifier", "testclassidentifier");
	classForm.append("sharewithgroup", "");
	classForm.append("excludefromindex", false);
	classForm.append("description", "testdescription");
	
	sendFormDataToFileService(imageForm);
	sendFormDataToFileService(classForm);
	
}


function uploadBadgeImageToFileService(){
	var imageInput = document.getElementById("badgefileinput");
	
	var imageForm = new FormData();
	
	imageForm.append("filecontent", imageInput.files[0]);
	imageForm.append("identifier", "testimageidentifier");
	imageForm.append("sharewithgroup", "");
	imageForm.append("excludefromindex", false);
	imageForm.append("description", "testdescription");
	
	sendFormDataToFileService(imageForm);
}

function uploadCriteriaToFileService(){
	var textField = document.getElementById("badgecriteria");
	
	var criteria = constructFormDataFromText(textField.value, "testriteria", ".html");
	
	criteria.append("identifier", "testcriteriaidentifier");
	criteria.append("sharewithgroup", "");
	criteria.append("excludefromindex", false);
	criteria.append("description", "testdescription");
	
	sendFormDataToFileService(criteria);
}

function uploadIssuerDataToFileService(){
	var nameField = document.getElementById("issuername");
	var urlField = document.getElementById("issuerurl");
	
	var jsonData = {
		"name": nameField.value,
		"url": urlField.value
	}
	
	var ident = "issuer_"+nameField.value.replace(/ /g,"_");
	
	var issuer = constructFormDataFromText(JSON.stringify(jsonData, null, 4), ident, ".json");
	
	issuer.append("identifier", ident);
	issuer.append("sharewithgroup", "");
	issuer.append("excludefromindex", false);
	issuer.append("description", "testdescription");
	
	sendFormDataToFileService(issuer);
	
}

function constructFormDataFromText(fileTextContent, fileName, fileEnding ){
	
	var MIMEtype = "text/plain";
	
	switch(fileEnding){
		case ".json": MIMEtype = "application/json"; break;
		case ".html": MIMEtype = "text/html"; break;
	}
	
	var file = new File(
			[fileTextContent],
			"filename"+fileEnding,
			{type: MIMEtype});
	
	var formData = new FormData();
	
	formData.append("filecontent", file);
	
	return formData;
}

function sendFormDataToFileService(formData){
	$.ajax({
		url: "https://las2peer.dbis.rwth-aachen.de:9098/fileservice/files",
		type: "POST",
		data: formData,
		mimeTypes: "multipart/form-data",
		contentType: false,
		cache: false,
		processData: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader("access_token", window.localStorage["access_token"]);
			//xhr.setRequestHeader("oidc_provider", window.localStorage["oidc_provider"]);
			xhr.setRequestHeader("accept", "text/plain");
		},
		success: function(data, textStatus){
			console.log("file submitted");
			console.log(textStatus);
			console.log(data);
		},
		error: function(jqxhr, status, error){
			console.log(jqxhr);
			console.log(status);
			console.log(error);
		}
	});
}


function setConnection(){
    
    window.backend = document.getElementById("backendfield").value;
    if(window.backend == ""){
        window.backend = document.getElementById("backendfield").placeholder;
    }
    console.log("backend: "+ window.backend);
    // check if connection works
    $.ajax({
        url: window.backend+"/checkconnection"
    }).then(function(data, status, jqxhr) {
	    console.log("jqxhr: "+jqxhr);
	    console.log("data: "+data);
	    alert(data);
    }).fail(function(xhr, status, error){
        alert("Error: please check if a backend instance is running at the specified location.");
    });
}

function setXAPIConnection(){

    window.lrs = document.getElementById("urlfield").value;
    window.auth = document.getElementById("authfield").value;
    
    if(window.lrs == "")
        window.lrs = document.getElementById("urlfield").placeholder;
    if(window.auth == "")
        window.auth = document.getElementById("authfield").placeholder;
    console.log("backend: "+window.backend+" , lrs: "+window.lrs);
    $.ajax({
        url: window.backend+"/checkxapiconnection?url="+window.lrs+"&auth="+window.auth
    }).then(function(data, status, jqxhr) {
	    console.log("jqxhr: "+jqxhr);
	    console.log("data: "+data);
	    alert(data);
    }).fail(function(xhr, status, error){
        alert("Error: please check if a backend instance is running at the specified location.");
    });
}

function setDeclarations(){
    //var select1 = document.getElementById("decselect1");
    //var select2 = document.getElementById("decselect2");
    
    //window.option1 = select1.options[select1.selectedIndex].value;
    //window.option2 = select2.options[select2.selectedIndex].value;
    
    var keyField = document.getElementById("declarationskeyfield");
    var objectField = document.getElementById("declarationsobjectfield");
    var actionField = document.getElementById("declarationsactionfield");
    var constraintsField = document.getElementById("declarationsconstraintsfield");
    
    window.key = keyField.value.replace(/\s/g,'');
    if (window.key == "")
        window.key = keyField.placeholder.replace(/\s/g, '');
    console.log(window.key);
    window.object = objectField.value.replace(/\s/g, '');
    if (window.object == "")
        window.object = objectField.placeholder.replace(/\s/g, '');
    window.action = actionField.value.replace(/\s/g, '');
    if (window.action == "")
        window.action = actionField.placeholder.replace(/\s/g, '');
    window.constraints = constraintsField.value.replace(/\s/g, '');
    
    var since1Field = document.getElementById("sincefield");
    var since2Field = document.getElementById("sincefieldc");
    var until1Field = document.getElementById("untilfield");
    var until2Field = document.getElementById("untilfieldc");
     
    window.since1 = since1Field.value;
    if (window.since1 == "")
        window.since1 = since1Field.placeholder;
    window.until1 = until1Field.value;
    if (window.until1 == "")
        window.until1 = until1Field.placeholder;
    
    if(since2Field){
        window.twoFields = true;
        window.since2 = since2Field.value;
        if (window.since2 == "")
            window.since2 = since1Field.placeholder;
        window.until2 = until2Field.value;
        if (window.until2 == "")
            window.until2 = until2Field.placeholder;
    }else{
        window.twoFields = false;
    }
}

//TODO:: split of chart creation into separate function
function analyseXAPI(){
    
    setDeclarations();
    
    console.log("key: "+window.key+" constraints: "+window.constraints);
    
    var uriString = window.backend 
                    + "/analysexapi?url=" + window.lrs 
                    + "&auth=" + window.auth 
                    + "&key=" + window.key 
                    + "&objectid=" + window.object 
                    + "&actionid=" + window.action 
                    + "&recommend=" + (!window.twoFields).toString() 
                    + "&constraints=" + window.constraints;
    
    $.ajax({
        url: encodeURI(uriString + ",since:" + window.since1 + ",until:" + window.until1)
    }).then(function(data, status, jqxhr) {
	    console.log("jqxhr: "+jqxhr);
	    console.log("data: "+data);
	    var results = JSON.parse(data);
	    alert(results.status);
	    
	    var rv = results.values.sort(compareKeys);
	    
	    var labels = [];
        var values = [];
        for(var i=0; i<rv.length; i++){
            labels.push(rv[i][0]);
            values.push(rv[i][1]);
        }
        console.log(labels);
        console.log(values);
        //TODO:: make separate function for charts! Also delete existing charts when generating new ones...
        var canvas = document.getElementById("canvas1");
		
		if(chart1 != null){
			chart1.destroy();
		}
		
        chart1 = new Chart(canvas,
            {   
                type: 'bar',
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
                                labelString: results.keyX,
                                type: 'time'
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
            }
        );
        
        if(!twoFields){
            results.badges.forEach(function(element) {
                appendDivWithBadgeRecommendation(document.getElementById("badgesdiv"),element);
            });
        }
    }).fail(function(xhr, status, error){
        alert("Error: please check if a backend instance is running at the specified location.");
    });
    
    if (twoFields){
        $.ajax({
            url: encodeURI(uriString + ",since:" + window.since2 + ",until:" + window.until2)
        }).then(function(data, status, jqxhr) {
	        console.log("jqxhr: "+jqxhr);
	        console.log("data: "+data);
	        var results = JSON.parse(data);
	        alert(results.status);
	        
	        var labels = [];
            var values = [];
            for(var i=0; i<results.values.length; i++){
                labels.push(results.values[i][0]);
                values.push(results.values[i][1]);
            }
            labels 
            console.log(labels);
            console.log(values);
            
            var canvas = document.getElementById("canvas2");
            
			if(chart2 != null){
				chart2.destroy();
			}
			
			chart2 = new Chart(canvas,
                {   
                    type: 'bar',
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
                                    labelString: results.keyX,
                                    type: 'time'
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
                }
            );

        }).fail(function(xhr, status, error){
            alert("Error: please check if a backend instance is running at the specified location.");
        });
    }
}

