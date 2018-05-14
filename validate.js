/*
 * List name validation using Regular Expressions
 */
var listNameVal;
function listNameValidate(inputId, errorId){
	var name = document.getElementById(inputId).value;
	
	// [A-Z] regex is a character range: Matches any single character in the range from first to last.
	// [\s\S] regex is a character set that matches any character including line breaks.
	// {2,50} regex is 2 to 50 characters long. 
	if (name.match(/^[A-Z][\s\S]{2,50}$/i) == null) {
		document.getElementById(errorId).innerHTML = "Invalid name.";
		document.getElementById(inputId).className += " errBorder"
		listNameVal = false;
	} else {
		document.getElementById(errorId).innerHTML = "";
		var newClass = document.getElementById(inputId).className.replace(/\berrBorder\b/g, '');
		document.getElementById(inputId).className = newClass;
		listNameVal = true;
	}
};

module.exports = {
	listNameValidate
}