/** Gets the users input and sends it to the server to add the list, if the server returns ok it updates the web page
 */
function addList() {
    var chooseListInput = document.getElementById('chooseList');
    if (!chooseListInput.checkValidity()) {
        swal('Please enter a list.');
    } else {
        var listName = chooseListInput.value;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/addList');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status === 200) {
                chooseListInput.value = '';
                chooseListInput.focus();

                var newListRadio = document.createElement('input');
                var newId = document.createTextNode(listName);
                newListRadio.setAttribute('type', 'radio')
                newListRadio.setAttribute('name', 'radioList')
                newListRadio.setAttribute('value', listName);
                document.getElementById('radioForm').appendChild(newRadio);
            } else {
                swal('Error: change not saved, please try again.');
            }
        };
        xhr.send(JSON.stringify({
            name: listName,
            categories: []
        }));
    }
}

/** Gets the users input and sends it to the server to delete the list, if the server returns ok it updates the web page
 */
function deleteList() {
	var chooseListInput = document.getElementById('chooseList');
    if (!chooseListInput.checkValidity()) {
        swal('Please enter a list.');
    } else {
    	var listName = chooseListInput.value;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/deleteList');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status === 200) {
                chooseListInput.value = '';
                chooseListInput.focus();

                listName.parentNode.removeChild(listName);
            } else {
                swal('Error: change not saved, please try again.');
            }
        };
        xhr.send(JSON.stringify({
            list: listName
        }));
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
    addList();
});

document.getElementById('delList').addEventListener('click', function() {
	deleteList();
});