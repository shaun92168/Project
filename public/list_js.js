// function doBackgroundRequest(type, url, data, onloadCallback) {
// 	var xhr = new XMLHttpRequest();
// 	xhr.open(type, url);
// 	xhr.setRequestHeader("Content-Type", "application/json");
// 	xhr.onload = function() {
// 	    onloadCallback(xhr);
// 	  };

// 	  xhr.send(JSON.stringify(data));
// }

// var whatToDoWhenRequestIsDone = function(xhr) {
//   if (xhr.status === 200) {
//       console.log("added");
//       var newElem = document.createElement("LI");
//       var newId = document.createTextNode(itemName);

//       newElem.id = itemName;
//       document.getElementById(categoryName).appendChild(newElem);

//       var newElem2 = document.createElement("INPUT");
//       newElem2.type = "checkbox";
//       newElem.appendChild(newElem2);
//       newElem.appendChild(newId);
//     } else {
//       console.log("Error, not saved on the server");
//     }
// }
// doBackgroundRequest('POST', '/add-new-item', dataToSend, whatToDoWhenRequestIsDone);

document.getElementById('newCategory').addEventListener('click', function() {
	var categoryName = prompt('Enter a new category name:');
	var myElem = document.getElementById(categoryName);
	if (myElem === null) {
		var newElem = document.createElement('UL');
		var newElem2 = document.createElement('H3')
		var newId = document.createTextNode(categoryName);
		newElem.appendChild(newElem2);
		newElem2.appendChild(newId)
		newElem.id = categoryName;
		document.getElementById('categories').appendChild(newElem);
	}
});

document.getElementById('newItem').addEventListener('click', function() {
	var categoryName = document.getElementById('chooseCategory').value
	var itemName = document.getElementById('chooseItem').value
	var myCategory = document.getElementById(categoryName)
	var myName = document.getElementById(itemName)	
	if (myCategory === null) {
		alert('Category does not exist!')
	} else {
		// problem: can be number
		if (myName === null && itemName.length > 0) {
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '/add-new-item');
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.onload = function() {
		    if (xhr.status === 200) {
		        console.log('added');
			    var newElem = document.createElement('LI');
				var newId = document.createTextNode(itemName)

				newElem.id = itemName
				document.getElementById(categoryName).appendChild(newElem)

				newElem.appendChild(newId)

		    }
		    else {
		        console.log('Error, not saved on the server');
		    }
		};

	    	xhr.send(JSON.stringify({
			    itemName: itemName,
			    category: categoryName
			}));

		} else {
			alert('Cant add item!')
		}
	}
});

document.getElementById('delCategory').addEventListener('click', function() {
	var categoryName = document.getElementById('chooseCategory').value
	var myCategory = document.getElementById(categoryName)
	if (myCategory === null) {
		alert('Category does not exist!')
	} else { 
		myCategory.parentNode.removeChild(myCategory);
	}
});

document.getElementById('delItem').addEventListener('click', function() {
	var itemName = document.getElementById('chooseItem').value
	var myItem = document.getElementById(itemName)
	if (myItem === null) {
		alert('Item does not exist!')
	} else { 
		myItem.parentNode.removeChild(myItem);
	}
});
