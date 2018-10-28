
// constants
var FILESERVICE = "https://las2peer.dbis.rwth-aachen.de:9098/fileservice/files"
// http deployment not intended for longterm use, but currently needed
// for baking API compatibility of hosted Open Badges
// var FILESERVICE = "http://las2peer.dbis.rwth-aachen.de:9071/fileservice/files";

// placeholder fields. Some placeholders are used as default values when a field is left empty. These are marked with //# here:
var PLACEHOLDER_TIMESTAMP = "2001-01-01T00:00:00.000Z"; //#
var PLACEHOLDER_BACKEND = "http://localhost:9003/OpenBadgeDesigner"; //#
var PLACEHOLDER_LRS_URL = "http://localhost"; //#
var PLACEHOLDER_LRS_AUTH = "Basic MTZlODUyNzllYTQ5YzA5YTkzNGE2N2RhOWQzMjQ5M2Y1YTI1OTc5MjpjYWM3YTExYTJhY2E0N2Y2YjMxMDI4YjhkNjA3MTg4MjM2NTk0Y2Yy"; //#
var PLACEHOLDER_STMT_KEY = "timestamp"; //#
var PLACEHOLDER_STMT_ACT = "http://example.com/activities/exampleActivity"; //# 
var PLACEHOLDER_STMT_VRB = "http://example.com/verbs/exampleVerb"; //#
var PLACEHOLDER_STMT_CON = "agent:{\"mbox\":\"mailto : max.mustermann@example.com\"}";
var PLACEHOLDER_CRITERIA = "Assisted Badge Mode allows to generate recommendations.";
var PLACEHOLDER_CRIT_MR = "For manual external implementation you may leave this empty. For use with the Gamification-Framework, use of Recommendations in Assisted Mode is advised.";
var PLACEHOLDER_ISSR = "max mustermann";
var PLACEHOLDER_ISSR_URI = "http://example.com/badges";
var PLACEHOLDER_BDG_NAME = "A new Badge";
var PLACEHOLDER_BDG_DESC = "Earned by fulfilling the criteria!";
var PLACEHOLDER_BDG_IMG = "http://example.com/badges/image_a_new_badge.png";
var PLACEHOLDER_BDG_CRIT = "http://example.com/badges/criteria_a_new_badge.html";
var PLACEHOLDER_BDG_ISSR = "http://example.com/badges/issuer_max_mustermann.json";

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

// on start-up prepare necessary UI elements
$(document).ready(function(){
    // check location within HTML page to start adding elements
    UIDiv = document.getElementById("frontendUI");
    constructMainMenu();
});


/**
 *  function to generate the Main Menu using DOM Elements
 */
function constructMainMenu(){
    removeAllChildren(UIDiv);
    
    var titleText = document.createTextNode("Open Badge Designer");
    var titleTextP = document.createElement("p");
        titleTextP.appendChild(titleText);
	var subtitleText = document.createTextNode("Warning: Please Sign In with Learning Layers at the start if you require access to las2peer services. Login at a later point may lead to loss of data.")
	var subtitleTextP = document.createElement("p");
		subtitleTextP.appendChild(subtitleText);
    
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
        
    appendChildren(UIDiv, titleTextP, subtitleTextP, assistedBadgeButtonP, manualBadgeButtonP, compareButtonP);
}


/**
 *   function to generate the Assisted Badge Design Mode using DOM Elements
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
    appendDivWithBadgeUI(leftDiv);
    appendDivWithAnalyticsUI(rightDiv, "canvas1");
    appendDivForBadgeRecommendations(rightDiv);
    
}


/**
 *   function to generate the Manual Badge Design Mode using DOM Elements
 */
function constructManualBadgeMode(){
    removeAllChildren(UIDiv);
    
    appendPWithReturnButton(UIDiv);
	appendDivWithBadgeUI(UIDiv);
}


/**
 *   function to generate the Data Comparison Mode using DOM Elements
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
    
    // use different colors to tell apart sections more easily
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
        ["placeholder", PLACEHOLDER_TIMESTAMP],
        ["id", "sincefieldc"]);
    var untilText = document.createTextNode("Until: ");
    var untilField = document.createElement("INPUT");
    setAttributes(untilField,
        ["type", "text"],
        ["placeholder", PLACEHOLDER_TIMESTAMP],
        ["id", "untilfieldc"]);
    var sinceUntilCompareP = document.getElementById("sinceuntilcomparep")
    appendChildren(sinceUntilCompareP, sinceText, sinceField, untilText, untilField);
    
    appendDivWithAnalyticsUI(rightDiv, "canvas1");
    appendDivWithAnalyticsUI(rightDiv, "canvas2");
}


/**
 * appends a paragraph with a 'Return to Menu' button to the selected element.
 *
 * @param {Object} elem the DOM Element to append the button to.
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


/**
 * appends a division containing the UI for entering Backend information.
 *
 * @param {Object} elem the DOM Element to append the new UI Section to.
 */
function appendDivWithBackendUI(elem){

    var backendDiv = document.createElement("DIV");
        //backendDiv.style.backgroundColor = 'lightcoral';
        backendDiv.style.border = '2px solid black';
    
	var backendTitle = document.createTextNode("BACKEND:")
	var backendTitleP = document.createElement("p");
		backendTitleP.appendChild(backendTitle);
		backendTitleP.style.fontWeight = "bold";
    var backendText = document.createTextNode("Please add the URL of the Backend to connect.");
    var backendTextP = document.createElement("p");
        backendTextP.appendChild(backendText);
        backendTextP.append(backendText);
    
    var backendField = document.createElement("INPUT");
    setAttributes(backendField,
            ["type", "text"],
            ["placeholder", PLACEHOLDER_BACKEND],
            ["id", "backendfield"]);
    backendField.style.width = '300px';
    var backendFieldP = document.createElement("p");
        backendFieldP.appendChild(backendField);
    
    var backendButton = document.createElement("BUTTON");
    backendButton.appendChild(document.createTextNode("Set Backend Connection"));
    backendButton.onclick = setConnection;  
    var backendButtonP = document.createElement("p");
        backendButtonP.style.textAlign = 'right';
        backendButtonP.appendChild(backendButton);
    
    appendChildren(backendDiv, backendTitleP, backendTextP, backendFieldP, backendButtonP);
    
    elem.appendChild(backendDiv);
}


/**
 *   appends a division containing the UI used to set the data source location
 *   ( source refers to the Learning Record Store [LRS] holding the xAPI data )
 *
 * @param {Object} elem the DOM Element to append the new UI section to.
 */
function appendDivWithSourceUI(elem){
    
	var lrsTitle = document.createTextNode("LEARNING RECORD STORE:")
	var lrsTitleP = document.createElement("p");
		lrsTitleP.appendChild(lrsTitle);
		lrsTitleP.style.fontWeight = "bold";
	
    sourceDiv = document.createElement("DIV");
    //sourceDiv.style.backgroundColor = 'lightsalmon';
    sourceDiv.style.border = '2px solid black';
    
    // create elements for information for the LRS
    var urlText = document.createTextNode("Next, add the URL of your Learning Record Store: ");
    var urlTextP = document.createElement("p");
        urlTextP.appendChild(urlText);
    
    var urlField = document.createElement("INPUT");
    setAttributes(urlField,
            ["type", "text"],
            ["placeholder", PLACEHOLDER_LRS_URL],
            ["id", "urlfield"]);
    var urlFieldP = document.createElement("p");
        urlFieldP.appendChild(urlField);
    
    var authorizeField = document.createElement("INPUT");
    setAttributes(authorizeField,
            ["type", "text"],
            ["placeholder", PLACEHOLDER_LRS_AUTH],
            ["id", "authfield"]);
    var authorizeFieldP = document.createElement("p");
        authorizeFieldP.appendChild(authorizeField);
    
    var authorizeText = document.createTextNode("And HTTP authorization info for it.");
    var authorizeTextP = document.createElement("p");
        authorizeTextP.appendChild(authorizeText);
   
    var setButton = document.createElement("BUTTON");
        setButton.appendChild(document.createTextNode("Set LRS Connection"));
        setButton.onclick = setXAPIConnection;
    var setButtonP = document.createElement("p");
        setButtonP.style.textAlign = 'right';
        setButtonP.appendChild(setButton);
    
    appendChildren(sourceDiv, lrsTitleP, urlTextP, urlFieldP, authorizeTextP, authorizeFieldP, setButtonP);
    
    elem.appendChild(sourceDiv);
}


/**
 * appends a division containing input fields to let the user declare
 * which information in the LRS should be considered.
 * 
 * @param {Object} elem the DOM Element to append the new UI section to.
 */
function appendDivWithDeclarationsUI(elem){
    
	var declarationsTitle = document.createTextNode("DECLARATIONS:")
	var declarationsTitleP = document.createElement("p");
		declarationsTitleP.appendChild(declarationsTitle);
		declarationsTitleP.style.fontWeight = "bold";
	
    declareDiv = document.createElement("DIV");
    //declareDiv.style.backgroundColor = 'lightpink';
    declareDiv.style.border = '2px solid black';
    
    
    var buttonP = document.createElement("p");
        buttonP.style.textAlign = 'right';
    
    // add a section to make declarations for how the xAPI data should be interpreted (Analytics)
    var text = document.createTextNode("To visualize xAPI data and gain recommendations, please fill in the following information:");
    var textP = document.createElement("p");
        textP.appendChild(text);
    
    var keyField = document.createElement("INPUT");
    setAttributes(keyField,
            ["type", "text"],
            ["placeholder", PLACEHOLDER_STMT_KEY],
            ["id", "declarationskeyfield"]);
    var objectField = document.createElement("INPUT");
    setAttributes(objectField,
            ["type", "text"],
            ["placeholder", PLACEHOLDER_STMT_ACT],
            ["id", "declarationsobjectfield"]);
    objectField.style.width = '360px';
    var actionField = document.createElement("INPUT");
    setAttributes(actionField,
            ["type", "text"],
            ["placeholder", PLACEHOLDER_STMT_VRB],
            ["id", "declarationsactionfield"]);
    actionField.style.width = '300px';
    
    var keyText = document.createTextNode("The xAPI statement-key to use.");
    var objectText = document.createTextNode("The xAPI activity (object) to check for.");
    var actionText = document.createTextNode("The xAPI verb (action) to check for.");
    
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
            ["placeholder", PLACEHOLDER_STMT_CON],
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
        ["placeholder", PLACEHOLDER_TIMESTAMP],
        ["id", "sincefield"]);
    var untilText = document.createTextNode("Until: ");
    var untilField = document.createElement("INPUT");
    setAttributes(untilField,
        ["type", "text"],
        ["placeholder", PLACEHOLDER_TIMESTAMP],
        ["id", "untilfield"]);
    var sinceUntilP = document.createElement("p");
    appendChildren(sinceUntilP, sinceText, sinceField, untilText, untilField);
    
    var sinceUntilCompareP = document.createElement("p");
        sinceUntilCompareP.setAttribute("id", "sinceuntilcomparep");
        
    var setButton = document.createElement("BUTTON");
        setButton.appendChild(document.createTextNode("Analyse"));
        setButton.onclick = analyseXAPI;
    var setButtonP = document.createElement("p");
        setButtonP.appendChild(setButton);
        setButtonP.style.textAlign = 'right';
        
    appendChildren(declareDiv, declarationsTitleP, textP, keyP, actionP, objectP, constraintsTextP, constraintsFieldP, timeTextP, sinceUntilP, sinceUntilCompareP, setButtonP);
    
    elem.appendChild(declareDiv);
}

/**
 * function to append a new UI element containing a canvas used for displaying graphs
 * in the analytics section.
 *
 * @param {Object} elem the DOM element to append the new UI section to
 * @param {String} canvasName the name of the new canvas
 */
function appendDivWithAnalyticsUI(elem, canvasName){
    var analyticsDiv = document.createElement("DIV");
        //analyticsDiv.style.backgroundColor = 'lightgreen';
        analyticsDiv.style.border = '2px solid black';
    
	var analyticsTitle = document.createTextNode("ANALYTICS:");
	var analyticsTitleP = document.createElement("P");
		analyticsTitleP.appendChild(analyticsTitle);
		analyticsTitleP.style.fontWeight = "bold";
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
    
    appendChildren(analyticsDiv, analyticsTitleP, textP, canvasP);
    
    elem.appendChild(analyticsDiv);
}


/**
 * function to append a new UI section to hold Badge Recommendations.
 *
 * @param {Object} elem the DOM element to append the new UI section to
 */
function appendDivForBadgeRecommendations(elem){
	var recommendationTitle = document.createTextNode("RECOMMENDATIONS:");
	var recommendationTitleP = document.createElement("P");
		recommendationTitleP.appendChild(recommendationTitle);
		recommendationTitleP.style.fontWeight = "bold";
		
    var badgesDiv = document.createElement("DIV");
        //badgesDiv.style.backgroundColor = 'lightblue';
        badgesDiv.style.border = '2px solid black';
        badgesDiv.id = "badgesdiv";
    var text = document.createTextNode("Badge Recommendations go here.");
    var textP = document.createElement("p");
        textP.appendChild(text);
	appendChildren(badgesDiv, recommendationTitleP, textP)
    
    elem.appendChild(badgesDiv);
}


/**
 * function to append a division containing a badge recommendation
 *
 * @param {Object} elem the DOM element to append the new UI section
 * @param {Object} badgeData the JSON object containing information on the badge recommendation.
 */
function appendDivWithBadgeRecommendation(elem, badgeData){

    badgeDiv = document.createElement("DIV");
    //badgeDiv.style.backgroundColor = 'lightgreen';
    badgeDiv.style.border = '2px solid black';
    badgeDiv.className = 'recommendation';    
    
    var badge = {};
    
    badge["name"] = badgeData["name"];
    badge["criteria"] = badgeData["criteria"];
    badge["description"] = badgeData["description"];
    badge["criteriamr"] = badgeData["criteriamachinereadable"];
	
    jQuery.data(badgeDiv, "badge", badge);
    
    var removeButton = document.createElement("BUTTON");
        removeButton.appendChild(document.createTextNode("X"));
        removeButton.onclick = function(){
            $(this).closest('.recommendation').remove();
        };
        removeButton.style.width = '15px'
    var applyRecommendationButton = document.createElement("BUTTON");
        applyRecommendationButton.appendChild(document.createTextNode("Apply"));
        applyRecommendationButton.onclick = function(){
            div = $(this).closest('.recommendation')[0];
            document.getElementById('badgename').value = jQuery.data(div, "badge")["name"];
            document.getElementById('badgedescription').value = jQuery.data(div, "badge")["description"];
            document.getElementById('badgecriteria').value = jQuery.data(div, "badge")["criteria"];
            document.getElementById('badgecriteriamr').value = jQuery.data(div, "badge")["criteriamr"];
            console.log(jQuery.data(div, "badge"));
        }
    var removeButtonP = document.createElement("p");
        removeButtonP.appendChild(removeButton);
    var nameTextP = document.createElement("p");
        nameTextP.appendChild(document.createTextNode(badge["criteria"]));
    appendChildren(badgeDiv, removeButtonP, applyRecommendationButton, nameTextP);
    //badgeDiv.appendChild(removeButtonP, applyRecommendationButton, nameTextP);
    
    elem.appendChild(badgeDiv);
}


/**
 * function to append a new UI section containing the Open Badge Survey
 * to an existing DOM element.
 *
 * @param {Object} elem the DOM element to append the new UI section to
 */
function appendDivWithBadgeUI(elem){
	var badgeDiv = document.createElement("DIV");
	badgeDiv.style.border = '2px solid black';
	
	var bText = document.createTextNode("Open Badge Survey: ");
	var textP = document.createElement("p");
		textP.appendChild(bText);
		textP.style.fontWeight = "bold";
		textP.style.fontSize = "large";
    var bText2 = document.createTextNode("If recommendations are used, applying a recommendation will overwrite some of the fields in this survey!");
    var text2P = document.createElement("p");
        text2P.appendChild(bText2);
	var generalHR = document.createElement("HR");
		
	var badgeFileDiv = document.createElement("DIV");
	var badgeFileTitle = document.createTextNode("IMAGE:");
	var badgeFileTitleP = document.createElement("P");
		badgeFileTitleP.appendChild(badgeFileTitle);
		badgeFileTitleP.style.fontWeight = "bold";
	var badgeFileText = document.createTextNode("You can either upload a .PNG image file directly to the FileService, or enter the URL to an existing one below. The image should be a square PNG with minimum dimensions of 90px and a maximum filesize of 256kb");
	var badgeFileTextP = document.createElement("p");
		badgeFileTextP.appendChild(badgeFileText);
	var badgeFileInput = document.createElement("INPUT");
	setAttributes(badgeFileInput,
			["id", "badgefileinput"],
			["type", "file"],
			["name", "badgefilecontent"]);
	var badgeFileButton = document.createElement("BUTTON");
		badgeFileButton.appendChild(document.createTextNode("Store Image on FileService"));
        badgeFileButton.onclick = uploadBadgeImageToFileService;
        badgeFileButton.style.width = '223px'
	var badgeFileInputP = document.createElement("p");
	appendChildren(badgeFileInputP, badgeFileInput, badgeFileButton);
	var badgeFileHR = document.createElement("HR");
	
	var badgeCriteriaTitle = document.createTextNode("CRITERIA:");
	var badgeCriteriaTitleP = document.createElement("P");
		badgeCriteriaTitleP.appendChild(badgeCriteriaTitle);
		badgeCriteriaTitleP.style.fontWeight = "bold";
	var badgeCriteriaText = document.createTextNode("You can either upload criteria directly to the FileService, or enter the URL to an existing .html describing the badge criteria below.");
	var badgeCriteriaField = document.createElement("TEXTAREA");
	setAttributes(badgeCriteriaField,
			["rows", "5"],
			["cols", "60"],
			["id", "badgecriteria"],
			["placeholder", PLACEHOLDER_CRITERIA]);
	var badgeCriteriaButton = document.createElement("BUTTON");
		badgeCriteriaButton.appendChild(document.createTextNode("Store Criteria on FileService"));
        badgeCriteriaButton.onclick = uploadCriteriaToFileService;
        badgeCriteriaButton.style.width = '223px'
	var badgeCriteriaButtonDL = document.createElement("BUTTON");
		badgeCriteriaButtonDL.appendChild(document.createTextNode("Download Criteria"));
		badgeCriteriaButtonDL.onclick = downloadCriteria;
	var badgeCriteriaButtonP = document.createElement("P");
	appendChildren(badgeCriteriaButtonP, badgeCriteriaButton, badgeCriteriaButtonDL);
	var badgeCriteriaP = document.createElement("p");
	appendChildren(badgeCriteriaP, badgeCriteriaField);
	var badgeCriteriaHR = document.createElement("HR");
	
	var badgeCriteriaMRText = document.createTextNode("Criteria in a machine-readable format: ");
	var badgeCriteriaMRField = document.createElement("TEXTAREA");
	setAttributes(badgeCriteriaMRField,
			["rows", "5"],
			["cols", "60"],
			["id", "badgecriteriamr"],
			["placeholder", PLACEHOLDER_CRIT_MR]);
	var badgeCriteriaMRP = document.createElement("p");
	appendChildren(badgeCriteriaMRP, badgeCriteriaMRField);
	
	var issuerTitle = document.createTextNode("ISSUER:");
	var issuerTitleP = document.createElement("P");
		issuerTitleP.appendChild(issuerTitle);
		issuerTitleP.style.fontWeight = "bold";
	
	var issuerText = document.createTextNode("If you have never created an Open Badge before, you can store issuer metadata on the FileService here or add a link to a self-hosted issuer file below.");
	var issuerNameText = document.createTextNode("Issuer Name:");
	var issuerNameTextP = document.createElement("p");
		issuerNameTextP.appendChild(issuerNameText);
	var issuerNameField = document.createElement("INPUT");
	setAttributes(issuerNameField,
			["id", "issuername"],
			["type", "text"],
			["placeholder", PLACEHOLDER_ISSUER]);
	var issuerNameP = document.createElement("p");
	appendChildren(issuerNameP, issuerNameField);
	
	var issuerWebText = document.createTextNode("Issuer Website:");
	var issuerWebTextP = document.createElement("p");
		issuerWebTextP.appendChild(issuerWebText);
	var issuerWebField = document.createElement("INPUT");
	setAttributes(issuerWebField,
			["id", "issuerweb"],
			["type", "text"],
			["placeholder", PLACEHOLDER_ISSUER_URL]);
	var issuerWebP = document.createElement("p");
	appendChildren(issuerWebP, issuerWebField);
	
	var issuerButton = document.createElement("BUTTON");
		issuerButton.appendChild(document.createTextNode("Store Issuer JSON on FileService"));
		issuerButton.onclick = uploadIssuerDataToFileService;
		issuerButton.style.width = '223px';
	var issuerButtonDL = document.createElement("BUTTON");
		issuerButtonDL.appendChild(document.createTextNode("Download Issuer JSON"));
		issuerButtonDL.onclick = downloadIssuerData;
	var issuerButtonP = document.createElement("P");
	appendChildren(issuerButtonP, issuerButton, issuerButtonDL);
	var issuerHR = document.createElement("HR");
	
	var badgeClassTitle = document.createTextNode("BADGE CLASS:");
	var badgeClassTitleP = document.createElement("P");
		badgeClassTitleP.appendChild(badgeClassTitle);
		badgeClassTitleP.style.fontWeight = "bold";
	var badgeNameText = document.createTextNode("Badge Name: ");
	var badgeNameField = document.createElement("INPUT");
	setAttributes(badgeNameField, 
			["id", "badgename"],
			["type", "text"],
			["placeholder", PLACEHOLDER_BDG_NAME]);
	var badgeNameP = document.createElement("p");
	appendChildren(badgeNameP, badgeNameField);
	
	var badgeDescriptionText = document.createTextNode("Badge Description: ");
	var badgeDescriptionField = document.createElement("TEXTAREA");
	setAttributes(badgeDescriptionField,
			["rows", "5"],
			["cols", "60"],
			["id", "badgedescription"],
			["placeholder", PLACEHOLDER_BDG_DESC]);
	var badgeDescriptionP = document.createElement("p");
	appendChildren(badgeDescriptionP, badgeDescriptionField);
	
	var badgeImageURIText = document.createTextNode("URI for Badge Image: ");
	var badgeImageURIField = document.createElement("INPUT");
	setAttributes(badgeImageURIField,
			["id", "badgeimageuri"],
			["type", "text"],
			["placeholder", PLACEHOLDER_BDG_IMG]);
	badgeImageURIField.style.width = '500px';
	var badgeImageURIP = document.createElement("p");
	appendChildren(badgeImageURIP, badgeImageURIField);
	
	var badgeCriteriaURIText = document.createTextNode("URI for Badge Criteria: ");
	var badgeCriteriaURIField = document.createElement("INPUT");
	setAttributes(badgeCriteriaURIField,
			["id", "badgecriteriauri"],
			["type", "text"],
			["placeholder", PLACEHOLDER_BDG_CRIT]);
	badgeCriteriaURIField.style.width = '500px';
	var badgeCriteriaURIP = document.createElement("p");
	appendChildren(badgeCriteriaURIP, badgeCriteriaURIField);
	
	var issuerURIText = document.createTextNode("URI for Issuer Data: ");
	var issuerURIField = document.createElement("INPUT");
	setAttributes(issuerURIField,
			["id", "issueruri"],
			["type", "text"],
			["placeholder", PLACEHOLDER_BDG_ISSR]);
	issuerURIField.style.width = '500px';
	var issuerURIFieldP = document.createElement("P");
		issuerURIFieldP.appendChild(issuerURIField);
		
	
	var classButton = document.createElement("BUTTON");
		classButton.appendChild(document.createTextNode("Store Badge Class on FileService"));
		classButton.onclick = uploadBadgeClassToFileservice;
		classButton.style.width = '223px';
	var classButtonDL = document.createElement("BUTTON");
		classButtonDL.appendChild(document.createTextNode("Download Badge Class"));
		classButtonDL.onclick = downloadBadgeClass;
	var classButtonP = document.createElement("P");
	appendChildren(classButtonP, classButton, classButtonDL);
	
	appendChildren(badgeFileDiv, badgeFileTitleP, badgeFileTextP, badgeFileInputP);
	
	appendChildren(badgeDiv, textP, text2P, generalHR, issuerTitleP, issuerText, issuerNameTextP, issuerNameP, issuerWebTextP, issuerWebP, issuerButtonP, issuerHR, badgeFileDiv, badgeFileHR, badgeCriteriaTitleP, badgeCriteriaText, badgeCriteriaP, badgeCriteriaButtonP, badgeCriteriaHR, badgeClassTitleP, badgeNameText, badgeNameP, badgeDescriptionText, badgeDescriptionP, badgeCriteriaMRText, badgeCriteriaMRP, badgeImageURIText, badgeImageURIP, badgeCriteriaURIText, badgeCriteriaURIP, issuerURIText, issuerURIFieldP, classButtonP);
	
	elem.append(badgeDiv);
}


/**
 * function to append multiple children to a single DOM element
 *
 * @param {Object} elem the DOM element to append children to
 * @param {...Object} [arg] a child to append to the specified DOM Element
 */
function appendChildren(elem /*children can be passed here */){
    for (var i=1; i<arguments.length; i+=1){
        elem.appendChild(arguments[i]);
    }
}


/**
 * function to remove all children from a DOM element. 
 * can be used to clean up the UI when loading into a different view
 *
 * @param {Object} elem the DOM element to remove all children from.
 */
function removeAllChildren(elem){
    while (elem.firstChild){
        elem.removeChild(elem.firstChild);
    }
}


/**
 * function to apply multiple [attribute, value] pairs at once
 *
 * @param {Object} elem the DOM element to apply new attribute values to
 * @param {...string[]} arg a list containing an attribute and a value to set it to
 */
function setAttributes(elem /*[attribute, value] pairs can be passed here*/){
    for (var i=1; i<arguments.length; i+=1){
        elem.setAttribute(arguments[i][0], arguments[i][1]);
    }
}


/**
 * compare function used for sorting
 * result is 1 i first key is larger, -1 if second key is larger, 0 else
 * 
 * @param {string|number} a the first key
 * @param {string|number} b the second key
 */
function compareKeys(a, b){
    return a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0;
}


/**
 * function to translate file endings into MIME Type for uploading
 *  
 * @param {string} fileEnding the file ending to translate (example: ".json")
 */
function getMIMETypeFromFileEnding(fileEnding){
	switch(fileEnding){
		case ".json": return "application/json";
		case ".html": return "text/html";
		default: return "text/plain";
	}
}

/**
 * function to upload the Badge Class that results from various input
 * fields in the Open Badge Survey UI to the las2peer FileService.
 *
 * this function is specific to the respective UI elements and will not
 * work without them.
 */
function uploadBadgeClassToFileservice(){
	var nameField = document.getElementById("badgename"); // string
	var descField = document.getElementById("badgedescription"); // string
	var crMRField = document.getElementById("badgecriteriamr"); // + string
	var imagField = document.getElementById("badgeimageuri");  // url png
	var critField = document.getElementById("badgecriteriauri");   // url html
	var issuField = document.getElementById("issueruri");  // url json
	
	var jsonBadge = {
		"name": nameField.value,
		"description": descField.value + " ###MACHINE_READABLE###" + crMRField.value,
		"image": imagField.value,
		"criteria": critField.value,
		"issuer": issuField.value
	}
	
	var classForm = constructFormDataFromText(JSON.stringify(jsonBadge, null, 4), "badge_class_"+nameField.value, ".json");
	
	var time_modifier = (new Date()).getTime();
	
	classForm.append("identifier", "badge_class_"+nameField.value+time_modifier+".json");
	classForm.append("sharewithgroup", "");
	classForm.append("excludefromindex", false);
	classForm.append("description", "testdescription");
	
	sendFormDataToFileService(classForm);
	
}


/**
 * function to download the Badge Class that results from various input
 * fields in the Open Badge Survey UI.
 *
 * this function is specific to the respective UI elements and will not
 * work without them.
 */
function downloadBadgeClass(){
	var nameField = document.getElementById("badgename"); // string
	var descField = document.getElementById("badgedescription"); // string
	var crMRField = document.getElementById("badgecriteriamr"); // + string
	var imagField = document.getElementById("badgeimageuri");  // url png
	var critField = document.getElementById("badgecriteriauri");   // url html
	var issuField = document.getElementById("issueruri");  // url json
	
	var jsonBadge = {
		"name": nameField.value,
		"description": descField.value + " ###MACHINE_READABLE###" + crMRField.value,
		"image": imagField.value,
		"criteria": critField.value,
		"issuer": issuField.value
	}
	
	downloadFileFromText(JSON.stringify(jsonBadge, null, 4), "badge_class_"+nameField.value, ".json");
	
}


/**
 * function to upload the Badge Image an input field in the 
 * Open Badge Survey UI to the las2peer FileService.
 *
 * this function is specific to the respective UI elements and will not
 * work without them.
 */
function uploadBadgeImageToFileService(){
	var imageInput = document.getElementById("badgefileinput");
	
	if(!imageInput.files[0].name.endsWith(".png")){
		alert("Filetype not supported. Please follow the information onscreen.");
		return;
	}
	
	var imageForm = new FormData();
	
	var time_modifier = (new Date()).getTime();
	
	imageForm.append("filecontent", imageInput.files[0], "badge_image_"+imageInput.files[0].name.slice(0,-4)+time_modifier+".png");
	imageForm.append("identifier", "badge_image_"+imageInput.files[0].name.slice(0,-4)+time_modifier+".png");
	imageForm.append("sharewithgroup", "");
	imageForm.append("excludefromindex", false);
	imageForm.append("description", "testdescription");
	
	sendFormDataToFileService(imageForm, "badgeimageuri");
}


/**
 * function to upload the Badge Criteria file that results from various 
 * input fields in the Open Badge Survey UI to the las2peer FileService.
 *
 * this function is specific to the respective UI elements and will not
 * work without them.
 */
function uploadCriteriaToFileService(){
	var textField = document.getElementById("badgecriteria");
	
	var criteria = constructFormDataFromText(textField.value, "testcriteria", ".html");
	
	var time_modifier = (new Date()).getTime();
	
	criteria.append("identifier", "testcriteriaidentifier"+time_modifier+".html");
	criteria.append("sharewithgroup", "");
	criteria.append("excludefromindex", false);
	criteria.append("description", "testdescription");
	
	sendFormDataToFileService(criteria, "badgecriteriauri");
}


/**
 * function to download the Badge Criteria file that results from various 
 * input fields in the Open Badge Survey UI.
 *
 * this function is specific to the respective UI elements and will not
 * work without them.
 */
function downloadCriteria(){
	var textField = document.getElementById("badgecriteria");
	
	downloadFileFromText(textField.value, "testcriteria", ".html");
}


/**
 * function to upload the Issuer file that results from various 
 * input fields in the Open Badge Survey UI to the las2peer FileService.
 *
 * this function is specific to the respective UI elements and will not
 * work without them.
 */
function uploadIssuerDataToFileService(){
	var nameField = document.getElementById("issuername");
	var urlField = document.getElementById("issuerweb");
	
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
	
	sendFormDataToFileService(issuer, "issueruri");
}


/**
 * function to download the Issuer file that results from various 
 * input fields in the Open Badge Survey UI.
 *
 * this function is specific to the respective UI elements and will not
 * work without them.
 */
function downloadIssuerData(){
	var nameField = document.getElementById("issuername");
	var urlField = document.getElementById("issuerweb");
	
	var jsonData = {
		"name": nameField.value,
		"url": urlField.value
	}
	
	var ident = "issuer_"+nameField.value.replace(/ /g,"_");
	
	var issuer = constructFormDataFromText(JSON.stringify(jsonData, null, 4), ident, ".json");
	
	downloadFileFromText(JSON.stringify(jsonData, null, 4), ident, ".json");
}


/**
 * function to construct a File Object containing the given text.
 * The File is set to its respective MIMEType based on the fileEnding,
 * and finally added to a new FormData Object to allow uploading it.
 * 
 * @param {string} fileTextContent the content to store in a text-based File
 * @param {string} fileName the intended name for the File
 * @param {string} fileEnding the ending of the file used as part of the name and to determine the MIMEType
 */
function constructFormDataFromText(fileTextContent, fileName, fileEnding ){
	
	var MIMEType = getMIMETypeFromFileEnding(fileEnding);
	
	var file = new File(
			[fileTextContent],
			"filename"+fileEnding,
			{type: MIMEType});
	
	var formData = new FormData();
	
	formData.append("filecontent", file);
	
	return formData;
}

/**
 * function to upload the given FormData Object to the las2peer FileService.
 * Uses jQuery ajax to upload via xhr.
 *
 * @param {FormData} formData the object to upload to the FileService
 * @param {Object} [uriField] the optional DOM element to store the URL returned by the las2peer FileService on successful upload
 */
function sendFormDataToFileService(formData, uriField){
	
	if(uriField === undefined){
		uriField = "";
	}
	
	$.ajax({
		url: FILESERVICE,
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
			console.log("beforeSend triggered.")
		},
		success: function(data, textStatus){
			console.log("file submitted");
			console.log(textStatus);
			console.log(data);
			alert("Fileupload Successful at: "+FILESERVICE+"/"+data);
			if(uriField != ""){
				document.getElementById(uriField).value = FILESERVICE + "/" + data;
			}
			
		},
		error: function(jqxhr, status, error){
			console.log(jqxhr);
			console.log(status);
			console.log(error);
			alert("Fileupload Failed. See log for details.")
		}
	});
}


/**
 * function to download a new File generated from given text
 *
 * @param {string} fileTextContent the text to store in the new file
 * @param {string} fileName the name of the new File
 * @param {string} fileEnding the ending (example: ".json") of the file, used as part of the name and to determine the MIMEType of the new File
 */
function downloadFileFromText(fileTextContent, fileName, fileEnding){
	
	var MIMEType = getMIMETypeFromFileEnding(fileEnding);
	
	var file = new Blob(
			[fileTextContent],
			{type: MIMEType});
			
	if(window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveBlob(file)
	}else{
		var temp = window.document.createElement("a");
			temp.setAttribute("href", window.URL.createObjectURL(file));
			temp.download = fileName+fileEnding;
		document.body.appendChild(temp);
		temp.click();
		document.body.removeChild(temp);
		window.URL.revokeObjectURL(file);
	}
	
	
}


/**
 * function to make a connection check to the backend and store connection
 * details for later reference
 */
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


/**
 * function to make a connection check to the xAPI LRS via the backend
 * and store connection details for later reference. 
 * (setConnection() must be done first.)
 */
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


/**
 * function to set xAPI declarations to the current values of the various
 * input fields for later reference.
 *
 */

function setDeclarations(){
    
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


/**
 * function to add a Chart.js chart to the given canvas
 * 
 * @param {Canvas} canvas the canvas to attach the new Chart to
 * @param {Chart} chart a potentially existing chart which is to be deleted and replaced
 * @param {string} type the type of the chart to be displayed
 * @param {string[]} labels the labels of the datasets
 * @param {number[]} data the values for each label
 * @param {string} labelx the name of the x axis
 * @param {string} labely the name of the y axis
 */
function addChartToCanvas(canvas, chart, type, labels, data, labelx, labely){
	
	if(!typeof chart === "undefined"){
			chart.destroy();
		}
		
        chart = new Chart(canvas,
            {   
                type: type,
                data: {
                    labels: labels,
                    datasets: [
                        {
                            data: data
                        }
                    ]
                },
                options: {
                    scales: {
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: labelx,
                                type: 'time'
                            }
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: labely
                            }
                        }]
                    }
                }
            }
        );
	
}


/**
 * function to send a request to the backend containing any previously made
 * declarations.
 * The backend will communicate with the provided Learning Record Store to 
 * gather data, visualise it, and generate badge recommendations.
 */
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
        var canvas = document.getElementById("canvas1");
		
		addChartToCanvas(canvas, chart1, 'bar', labels, values, results.keyX, results.keyY);
        
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
            
			addChartToCanvas(canvas, chart2, 'bar', labels, values, results.keyX, results.keyY);

        }).fail(function(xhr, status, error){
            alert("Error: please check if a backend instance is running at the specified location.");
        });
    }
}

