/** Gets the users input and sends it to the server to add the list, if the server returns ok it updates the web page
 */
function addList() {
    var listName = prompt('please enter your lists name')
    if (listName === null) {
        return
    } else if (listName.length < 5) {
        swal('Your list must have a name longer than 5 characters')
    } else if (listName.length > 25) {
        swal('Your list name cannot be bigger than 25 characters')
    } else {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/addList');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status === 200) {
                var newListRadio = document.createElement('input');
                var newId = document.createTextNode(listName);
                newListRadio.setAttribute('type', 'radio');
                newListRadio.setAttribute('name', 'radioList');
                newListRadio.setAttribute('id', listName)
                newListRadio.setAttribute('value', listName)

                var newLabel = document.createElement('label');
                var newId = document.createTextNode(listName);
                newLabel.setAttribute('for', listName)
                newLabel.appendChild(newId);

                var sendButton = document.getElementById('sendButton');
                var radioForm = document.getElementById('radioForm');
                var br = document.createElement('br');

                radioForm.insertBefore(newListRadio, sendButton);
                radioForm.insertBefore(newLabel, sendButton);
                radioForm.insertBefore(br, sendButton)
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
    if (valid()) {
        var listName = document.querySelector('input[name="radioList"]:checked').id;
        if (confirm('Are you sure you want to delete' + ' ' + listName)) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/deleteList');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function() {
                if (xhr.status === 200) {

                var el = document.querySelector('input[name="radioList"]:checked');
                var labelEl = el.nextSibling;
                var br = labelEl.nextSibling;
                var parentNode = el.parentNode;
                parentNode.removeChild(el);
                parentNode.removeChild(labelEl);
                parentNode.removeChild(br);
                } else {
                    swal('Error: change not saved, please try again.');
                }
            };
            xhr.send(JSON.stringify({
                list: listName
            }));
        }
    }
}

function renameList() {
    if (valid()) {
        var listName = document.querySelector('input[name="radioList"]:checked').id;
        console.log(listName);
        var newName = prompt('Enter your new lists name')
        if (newName === null) {
        return
        } else if (newName.length < 5) {
            swal('Your list must have a name longer than 5 characters')
        } else if (newName.length > 25) {
            swal('Your list name cannot be bigger than 25 characters')
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/renameList');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function() {
                if (xhr.status === 200) {
                    lists = document.getElementById(listName)
                    lists.id = newName
                    lists.value = newName
                    list = lists.nextSibling
                    list.innerText = newName
                } else {
                    swal('Error: change not saved, please try again.');
                }
            };
            xhr.send(JSON.stringify({
            newList: newName,
            oldList: listName
            }));
        }
    }
}

function valid() {
    if (document.querySelector('input[name="radioList"]:checked') === null) {
        swal('Please choose a list')
        return false;
    } else {
        return true;
    }
}

document.getElementById('addList').addEventListener('click', function() {
    addList();
});

document.getElementById('delList').addEventListener('click', function() {
	deleteList();
});

document.getElementById('renameList').addEventListener('click', function() {
    renameList();    
});