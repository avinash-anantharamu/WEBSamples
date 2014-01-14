// survey.js
// Simple JavaScript survey engine
// Parses survey questions encoded in the url to survey.html and dynamically generates a survey
// Written by: Avinash Anantharamu
// Globals
var s;
var next;
var prev;

// Function for getting URL parameters
function gup(name) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(decodeURIComponent(window.location.href));
    if(results == null)
	return "";
    else
	return results[1];
}

// Question Class
function Question(question) {
    this.question = question;
    this.answer = "";
}

Question.prototype.setQuestion = function(question) {
    this.question = question;
};

// QuestionWithSelection Class: This class handles survey questions that have a set number of answers Inherits from Question
function QuestionWithSelection(question, choices) {
    Question.call(this, question);
    this.choices = choices; //check for empty choices here
}

QuestionWithSelection.prototype = new Question();
QuestionWithSelection.prototype.constructor = QuestionWithSelection;

QuestionWithSelection.prototype.addChoice = function(choice) {
    var len = this.choices.length;
    this.choices[len] = choice;
};

QuestionWithSelection.prototype.replaceChoice = function(choice, index) {
    if(index < 0 || index > this.choices.length-1) {
	alert("Bad index!");
	return;
    }
    this.choices[index] = choice;
};

// RadioButton Class: Handles radio button survery questions and Inherits from QuestionWithSelection
function RadioButton(question, choices) {
    QuestionWithSelection.call(this, question, choices);
    this.type = 'radio';
}

RadioButton.prototype = new QuestionWithSelection();
RadioButton.prototype.constructor = RadioButton;

RadioButton.prototype.display = function() {
    var str = "<h1>Question " + (s.index+1).toString() + ":</h1><br><p>" + this.question + "</p>";
    document.write(str);
    for(i = 0; i < this.choices.length; i++) {
	if(this.answer == this.choices[i]) {
	    str = "<input type=\"" + this.type + "\" id=\"r\" name=\"rad\" checked=\"checked\" value=\"" + this.choices[i] + "\">" + this.choices[i] + "</input>";
	}
	else {
	    str = "<input type=\"" + this.type + "\" id=\"r\" name=\"rad\" value=\"" + this.choices[i] + "\">" + this.choices[i] + "</input>";
	}
	document.write(str);
    }
    str = "<br><button type=\"button\" onclick=\"javascript:next.call(s)\">Submit</button>";
    if(s.index != 0) {
	str += "<button type=\"button\" onclick=\"javascript:prev.call(s)\">Previous Question</button>";
    }
    document.write(str);
};

RadioButton.prototype.validate = function() {
    var answer = document.getElementsByName("rad");
    for(i = 0; i < answer.length; i++) {
	if(answer.item(i) && answer.item(i) != "" && answer.item(i).checked) {
	    this.answer = answer.item(i).value;
	}
    }
    if(!this.answer.match(/([A-z]|[0-9])/g)) {
	return false;
    }
    else {
	return true;
    }
};

// CheckBox Class : Handles check box survery questions and Inherits from QuestionWithSelection
function CheckBox(question, choices) {
    QuestionWithSelection.call(this, question, choices);
    this.type = 'checkbox';
    this.answer = new Array();
}

CheckBox.prototype = new QuestionWithSelection();
CheckBox.prototype.constructor = CheckBox;

CheckBox.prototype.display = function() {
    var str = "<h1>Question " + (s.index+1).toString() + ":</h1><br><p>" + this.question + "</p>";
    document.write(str);
    for(i = 0; i < this.choices.length; i++) {
	if(this.answer[i] == this.choices[i]) {
	    str = "<input type=\"" + this.type + "\" id=\"c\" name=\"chk\" checked=\"checked\" value=\"" + this.choices[i] + "\">" + this.choices[i] + "</input>";
	}
	else {
	    str = "<input type=\"" + this.type + "\" id=\"c\" name=\"chk\" value=\"" + this.choices[i] + "\">" + this.choices[i] + "</input>";
	}
	document.write(str);
    }
    str = "<br><button type=\"button\" onclick=\"javascript:next.call(s)\">Submit</button>";
    if(s.index != 0) {
	str += "<button type=\"button\" onclick=\"javascript:prev.call(s)\">Previous Question</button>";
    }
    
    document.write(str);
};

CheckBox.prototype.validate = function() {
    var answer = document.getElementsByName("chk");
    for(i = 0; i < answer.length; i++) {
	if(answer.item(i) && answer.item(i) != "" && answer.item(i).checked) {
	    this.answer[i] = answer.item(i).value;
	}
    }
    if(this.answer.length == 0) {
	return false;
    }
    else {
	return true;
    }
};

// DropDown Class : Handles drop down survery questions Inherits from QuestionWithSelection
function DropDown(question, choices) {
    QuestionWithSelection.call(this, question, choices);
    this.type = 'select';
}

DropDown.prototype = new QuestionWithSelection();
DropDown.prototype.constructor = DropDown;

DropDown.prototype.display = function() {
    var str = "<h1>Question " + (s.index+1).toString() + ":</h1><br><p>" + this.question + "</p><select id=\"s\">";
    document.write(str);
    for(i = 0; i < this.choices.length; i++) {
	
	if(this.answer == this.choices[i]) {
	    str = "<option value=\"" + this.choices[i] + "\" selected>" + this.choices[i] + "</option>";
	}
	else {
	    str = "<option value=\"" + this.choices[i] + "\">" + this.choices[i] + "</option>";
	}
	document.write(str);
    }
    str = "</select><br><button type=\"button\" onclick=\"javascript:next.call(s)\">Submit</button>";
    if(s.index != 0) {
	    str += "<button type=\"button\" onclick=\"javascript:prev.call(s)\">Previous Question</button>";
    }
    document.write(str);
};

DropDown.prototype.validate = function() {
    var answer = document.getElementById('s');
    if(answer && answer.value.match(/([A-z]|[0-9])/g)) {
	this.answer = answer.value;
	return true;
    }
    else {
	return false;
    }
};

// TextBox Class:Handles text box survery questions and Inherits from Question
function TextBox(question) {
    Question.call(this, question);
    this.type = 'text';
}

TextBox.prototype = new Question();
TextBox.prototype.constructor = TextBox;

TextBox.prototype.display = function() {
    if(this.answer == "") {
	var str = "<h1>Question " + (s.index+1).toString() + ":</h1><br><p>" + this.question + "</p><input type=\"" + this.type + "\" id=\"q\"/><br><button type=\"button\" onclick=\"javascript:next.call(s)\">Submit</button>";
    }
    else {
	var str = "<h1>Question " + (s.index+1).toString() + ":</h1><br><p>" + this.question + "</p><input type=\"" + this.type + "\" id=\"q\" value=\"" + this.answer + "\"/><br><button type=\"button\" onclick=\"javascript:next.call(s)\">Submit</button>";
    }

    if(s.index != 0) {
	str += "<br><button type=\"button\" onclick=\"javascript:prev.call(s)\">Previous Question</button>";
    }
    document.write(str);
};

TextBox.prototype.validate = function() {
    var answer = document.getElementById('q');
    if(answer && answer.value.match(/([A-z]|[0-9])/g)) {
	this.answer = answer.value;
	return true;
    }
    else {
	return false;
    }
};


// Survey Class: Contains an array of survey questions and implements operations on them
function Survey() {
    this.questions = new Array();
    this.index = 0;
}

Survey.prototype.addQuestion = function(question) {
    if(question instanceof Question) {
	this.questions[this.questions.length] = question;
    }
    else {
	alert("Attempted to add a question not of type Question!");
	return;
    }
};

Survey.prototype.removeQuestion = function(index) {
    if(index < 0 || index > this.questions.length-1) {
	alert("Attempted to delete a question that doesn't exist!");
	return;
    }
    this.questions = this.questions.splice(index, 1);
};

Survey.prototype.displayQuestion = function(index) {
    if(index < 0 || index > this.questions.length-1) {
	alert("Attemped to display a question that does not exist!");
	return;
    }
    this.questions[index].display();
};

Survey.prototype.displayAnswers = function() {
    document.body.innerHTML = '';
    var str = "<h1>Answers:</h1><br>";
    for(i = 0; i < this.index; i++) {
	str += "<p>Question " + (i+1).toString() + ": " + this.questions[i].question + "<br>Answer " + (i+1).toString() + ": ";
	if(Object.prototype.toString.call(this.questions[i].answer) === '[object Array]') {
	    for(k = 0; k < this.questions[i].answer.length; k++) {
		if(this.questions[i].answer[k]) {
		    str += this.questions[i].answer[k] + ", ";
		}
	    }
	    str = str.substring(0, str.length-2);
	    str += "</p>";
	}
	else {
	    str += this.questions[i].answer + "</p>";
	}
    }
    str += "<br><br><button type=\"button\" onclick=\"window.location.href=\'index.html\'\">Create Another Survey</button><button type=\"button\" onclick=\"window.location.reload()\">Take Survey Again</button>"
    document.write(str);
};

Survey.prototype.nextQuestion = function() {
    if(!this.questions[this.index].validate()) {
	alert("Please answer the question.");
	return;
    }
    document.body.innerHTML = '';
    this.index += 1;
    if(this.index < this.questions.length) {
	s.displayQuestion(this.index);
    }
    else {
	s.displayAnswers();
	return;
    }
};

Survey.prototype.previousQuestion = function() {
    if(this.index-1 < 0) {
	alert("Bad question index!");
	return;
    }
    else {
	document.body.innerHTML = '';
	this.index -= 1;
	s.displayQuestion(this.index);
    }
};

//Parse the encoded questions creating question objects in the survey
function parseSurvey() {
    var numQuestions = gup("numQuestions");
    var numQuestionsI = parseInt(numQuestions);
    var q = null;
    if(!isNaN(numQuestionsI)) {
	for(i = 0; i < numQuestionsI; i++) {
	    var type = gup("type" + i.toString());
	    if(!type.match(/([A-z]|[0-9])/g)) {
		alert("Malformed question type. Ending survey!");
		return;
	    }
	    var question = gup("q" + i.toString());
	    if(!question.match(/([A-z]|[0-9])/g)) {
		alert("Malformed question. Ending survey!");
		return;
	    }
	    switch(type) {
	    case "TextBox":
		q = new TextBox(question);
		s.addQuestion(q);
		break;
	    default:
		var numAnswers = gup("num" + i.toString());
		var numAnswersI = parseInt(numAnswers);
		if(isNaN(numAnswersI)) {
		    alert("Malformed number of answers received. Ending survey!");
		    return;
		}
		var answers = new Array();
		for(j = 0; j < numAnswersI; j++) {
		    var answer = gup("q" + i.toString() + "a" + j.toString());
		    if(!answer.match(/([A-z]|[0-9])/g)) {
			alert("Malformed answer. Ending survey!");
			return;
		    }
		    answers[j] = answer;
		}
		if(type == "DropDown") {
		    q = new DropDown(question, answers);
		}
		else if(type == "RadioButton") {
		    q = new RadioButton(question, answers);
		}
		else if(type == "CheckBox") {
		    q = new CheckBox(question, answers);
		}
		else {
		    alert("Malformed question type. Ending survey!");
		    return;
		}
		s.addQuestion(q);
		break;
	    }
	}
	s.displayQuestion(s.index);
    }
    else {
	alert("Malformed number of questions. Ending survey!");
	return;
    }
}

// Create a new survey and parse the encoded questions on page load
window.onload = function() {
    s = new Survey();
    next = s.nextQuestion;
    prev = s.previousQuestion;
    parseSurvey();
};

