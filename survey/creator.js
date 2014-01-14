// creator.js
// Generates a survey of questions to be created by survey.js
// Author: Avinash Anantharamu

var numQuestions = 0;
var tmpQuery = "";
var query = "";
var URL = "";


// Parse functions: These parses the questions to be created and ensures proper input.They are split into two types, text box, and questions with limited answers 
function parseTextBox() {
    var answer = document.getElementById("qText");
    if(answer && answer.value.match(/([A-z]|[0-9])/g)) {
	query += "q" + numQuestions.toString() + "=" + answer.value + "&type" + numQuestions.toString() + "=TextBox&";
	numQuestions += 1;
	document.body.innerHTML = '';
	return true;
    }
    else {
	alert("Please enter a question to ask!");
	return false;
    }
}

function parsePreQAndA(kind) {
    var number = document.getElementById("nText");
    var answer = document.getElementById("qText");
    if(number) {
	var numberI = parseInt(number.value);
	if(!isNaN(numberI)) {
	    if(!answer.value.match(/([A-z]|[0-9])/g)) {
		alert("Please enter a valid question to ask!");
		return;
	    }
	    tmpQuery = 'q' + numQuestions + '=' + answer.value + "&type" + numQuestions + "=";
	    createQAndA(numberI, kind);
	}
	else {
	    alert("Please enter a valid number!");
	    return;
	}
    }
    else {
	alert("Please enter a number!");
	return;
    }
}

function parseQAndA(kind) {
    var answer = "";
    var str = "";
    var i = 0;
    while(answer = document.getElementById("aText" + i.toString())) {
	if(!answer.value.match(/([A-z]|[0-9])/g)) {
	    alert("Please fill out all the answer fields!");
	    return false;
	}
	else {
	    str += "q" + numQuestions.toString() + "a" + i.toString() + "=" + answer.value + "&";
	}
	i += 1;
    }
    tmpQuery += kind + "&num" + numQuestions.toString() + "=" + (i).toString() + "&" + str;
    query += tmpQuery;
    tmpQuery = "";
    numQuestions += 1;
    document.body.innerHTML = '';
    return true;
}

function preQAndA(kind) {
    document.body.innerHTML = '';
    switch(kind) {
    case "drop down":
	var str = "<h1>Create Drop Down</h1><p>Number of answers: </p><input type=\"text\" id=\"nText\"/><br><p>Question to ask: </p><input type=\"text\" id=\"qText\"/><br><br><button type=\"button\" onclick=\"parsePreQAndA(\'drop down\')\">Next</button>";
	break;
    case "radio buttons":
	var str = "<h1>Create Radio Buttons</h1><p>Number of answers: </p><input type=\"text\" id=\"nText\"/><br><p>Question to ask: </p><input type=\"text\" id=\"qText\"/><br><br><button type=\"button\" onclick=\"parsePreQAndA(\'radio buttons\')\">Next</button>";
	break;
    case "check boxes":
	var str = "<h1>Create Check Boxes</h1><p>Number of answers: </p><input type=\"text\" id=\"nText\"/><br><p>Question to ask: </p><input type=\"text\" id=\"qText\"/><br><br><button type=\"button\" onclick=\"parsePreQAndA(\'check boxes\')\">Next</button>";
	break;
    }
    str += "<button type=\"button\" onclick=\"document.body.innerHTML=\'\'; addQuestion()\">Previous</button>"
    document.write(str);
}

// Create functions: These gather the necessary input for each question type to be added and sends the data to the parse functions 
function createQAndA(number, kind) {
    document.body.innerHTML = '';
    var str = "";
    for(i = 0; i < number; i++) {
	str = "<p>Answer " + (i+1).toString() + ": </p><input type=\"text\" id=\"aText" + i.toString() + "\"/><br>";
	document.write(str);
    }
    switch(kind) {
    case "drop down":
	str = "<br><button type=\"button\" onclick=\"(parseQAndA(\'DropDown\')) ? addQuestion() : 0 \">Create</button><button type=\"button\" onclick=\"document.body.innerHTML = \'\'; preQAndA(\'drop down\')\">Previous</button>";
	break;
    case "radio buttons":
	str = "<br><button type=\"button\" onclick=\"(parseQAndA(\'RadioButton\')) ? addQuestion() : 0 \">Create</button><button type=\"button\" onclick=\"document.body.innerHTML = \'\'; preQAndA(\'radio buttons\')\">Previous</button>";
	break;
    case "check boxes":
	str = "<br><button type=\"button\" onclick=\"(parseQAndA(\'CheckBox\')) ? addQuestion() : 0 \">Create</button><button type=\"button\" onclick=\"document.body.innerHTML = \'\'; preQAndA(\'check boxes\')\">Previous</button>";
	break;
    }
    document.write(str);
}

function createTextBox() {
    document.body.innerHTML = '';
    var str = "<h1>Create Text Box</h1><p>Question to ask: </p><input type=\"text\" id=\"qText\"/><button type=\"button\" onclick=\"(parseTextBox()) ? addQuestion() : 0 \">Create</button><br><br><button type=\"button\" onclick=\"document.body.innerHTML = \'\'; addQuestion()\">Previous</button>";
    document.write(str);
}

// Selects the proper question to be created based on user select box input
function parseQuestion() {
    var type = document.getElementById("iSel");
    if(type) {
	switch(type.value) {
	case "TextBox":
	    createTextBox();
	    break;
	case "DropDown":
	    preQAndA("drop down");
	    break;
	case "RadioButtons":
	    preQAndA("radio buttons");
	    break;
	case "CheckBoxes":
	    preQAndA("check boxes");
	    break;
	}
    }
}

// Sends the encoded survey information to survey.html to be created by survey.js
function goToSurvey() {
    if(numQuestions == 0) {
	alert("You must add at least one question to take the survey!");
	return;
    }
    else {
	query = query.substring(0, query.length-1);
	URL = "survey.html?" + "numQuestions=" + numQuestions.toString() + "&" + query;
	window.location.href = URL;
    }
}

// Begins the question creation process
function addQuestion() {
    var str = "<h1>Survey Creation</h1><p>Add a question: </p><select id=\"iSel\" name=\"nSel\"><option value=\"TextBox\">Text Box</option><option value=\"DropDown\">Drop Down</option><option value=\"RadioButtons\">Radio Buttons</option><option value=\"CheckBoxes\">Check Boxes</option></select><button type=\"button\" onclick=\"javascript:parseQuestion()\">Submit</button><br><br><button type=\"button\" onclick=\"javascript:goToSurvey()\">Take Survey</button>";
    document.write(str);
}

window.onload = function() {
    addQuestion();
};