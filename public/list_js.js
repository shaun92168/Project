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


/**
 * This function add a new category to the current list
 * @name addCategory
 * @function
 */
function addCategory() {
	var newCategory = prompt('Enter a new category name:');
	if (newCategory != null) {
		var xhr = new XMLHttpRequest();
		xhr.open('POST', '/addCategory');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
		    if (xhr.status === 200) {
				var newList = document.createElement('UL');
				var listStyle = document.createElement('H3');
				var categoryName = document.createTextNode(newCategory);

				newList.appendChild(listStyle);
				listStyle.appendChild(categoryName);
				newList.id = newCategory;
				document.getElementById('categories').appendChild(newList);
			} else {
			    swal('Error: change not saved, please try again.');
			}
		};
    	xhr.send(JSON.stringify({
		    category: newCategory
		}));
	}
}

/**
 * This function delete a specific category from the current list
 * @name delCategory
 * @function
 */
function delCategory() {
	var categoryName = document.getElementById('chooseCategory').value
	var myCategory = document.getElementById(categoryName)
	if (myCategory === null) {
		swal('Category does not exist!')
	} else { 
		var xhr = new XMLHttpRequest();
		xhr.open('POST', '/deleteCategory');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
		    if (xhr.status === 200) {
				myCategory.parentNode.removeChild(myCategory);
			} else {
			    swal('Error: change not saved, please try again.');
			}
		};
    	xhr.send(JSON.stringify({
		    category: categoryName
		}));
	}
}

/**
 * This function add a new item in the current category
 * @name addItem
 * @function
 */
function addItem() {
	var categoryName = document.getElementById('chooseCategory').value
	var itemName = document.getElementById('chooseItem').value
	var myCategory = document.getElementById(categoryName)
	var myName = document.getElementById(itemName)	
	if (myCategory === null) {
		swal('Category does not exist!')
	} else {
		// problem: can be number
		if (myName === null && itemName.length > 0) {
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '/addItem');
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.onload = function() {
			    if (xhr.status === 200) {
				    var newElem = document.createElement('LI');
					var newId = document.createTextNode(itemName)

					newElem.id = itemName
					document.getElementById(categoryName).appendChild(newElem)

					newElem.appendChild(newId)
			    } else {
			        alert('Error, not saved on the server');
			    }
			};
	    	xhr.send(JSON.stringify({
			    item: itemName,
			    category: categoryName
			}));
		} else {
			swal('Cant add item!')
		}
	}
}
 
/**
 * This function delete an item from the current category 
 * @name delItem
 * @function
 */
function delItem() {
	var categoryName = document.getElementById('chooseCategory').value
	var itemName = document.getElementById('chooseItem').value
	var myItem = document.getElementById(itemName)
	if (myItem === null) {
		swal('Item does not exist!')
	} else { 
		var xhr = new XMLHttpRequest();
		xhr.open('POST', '/deleteItem');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
		    if (xhr.status === 200) {
				myItem.parentNode.removeChild(myItem);
		    } else {
		        swal('Error, not saved on the server');
		    }
		}
    	xhr.send(JSON.stringify({
		    item: itemName,
		    category: categoryName
		}));
	}
}

document.getElementById('newCategory').addEventListener('click', function() {
	addCategory();
});

document.getElementById('newItem').addEventListener('click', function() {
	addItem();
});

document.getElementById('delCategory').addEventListener('click', function() {
	delCategory();
});

document.getElementById('delItem').addEventListener('click', function() {
	delItem();
});

/*
document.getElementById("categories").addEventListener("click", function(){
    document.getElementById("categories").addEventListener("keyup", function(){
        document.getElementById("categories").innerHTML = document.getElementById("categories").value;

    });
});
*/