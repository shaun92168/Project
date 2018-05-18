/* User input what lists they want and then click a button.
 * @name newList
 * @function
 */
function newList() {
	var chooseListInput = document.getElementById('chooseList');
	if (!chooseListInput.checkValidity()) {
        document.getElementById("demo").innerHTML = chooseListInput.validationMessage;
    }
	var listName = chooseListInput.value;
	chooseListInput.value = '';
	chooseListInput.focus();
	var myElem = document.getElementById(listName);
	if (myElem === null) {
		var newElem = document.createElement('form');
		var newElem2 = document.createElement('text');
		var newElem3 = document.createElement('input');
		var newId = document.createTextNode(listName);
		newElem.appendChild(newElem2);
		newElem2.appendChild(newElem3);
		newElem3.value = listName;
		newElem3.type = 'submit';
		newElem.action = '/listsPage/' + listName;
		newElem.id = listName;
		document.getElementById('lists').appendChild(newElem);
	}
}

var input = document.getElementById("chooseList");
input.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById("addList").click();
  }
});


document.getElementById('addList').addEventListener('click', function() {
	newList();
});