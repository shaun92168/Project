require('dotenv').config()

/** Mongoclient module */
const MongoClient = require('mongodb').MongoClient;

/** mongodb database url */
const url = process.env.DB_API
const db_client = process.env.DB

/** Verifiys the that the inputted email and password are correct format and match the ones in the database.
 * @param {string} email The users email address
 * @param {string} password The users password
 * @param {callback} callback Sends a callback
 */
function login(email, password, callback) {
    if (email.indexOf('@') > 0 && email.indexOf('.') > 0 && (email.indexOf('com') > 0 || email.indexOf('ca') > 0)) {
        readFile(email, (user) => {
            if(user === 'failed') {
                callback('failed')
            } else {
                if (password === user.password) {
                    callback(user)
                } else {
                    callback('failed')
                }
            }
        }); 
    } else {
        callback('failed')
    }
}

/**
 * This add the user to the database
 * @name signup
 * @function
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string} repassword
 * @param {callback} callback
 */
function signup(username, email, password, repassword, callback) {
    if (email.indexOf('@') > 0 && email.indexOf('.') > 0 && (email.indexOf('com') > 0 || email.indexOf('ca') > 0) && (email.indexOf('com') > email.indexOf('@') || email.indexOf('ca') > email.indexOf('@')) && (password === repassword) && (password != "") && (username != "")) {
        var user = {
                    "username": username,
                    "email": email,
                    "password": password,
                    "lists":[]
                };
        addUserDB(user, "Users", (msg) => {
            if(msg === 'error') {
                callback('failed')
            } else {
                callback('success')
            }
        }); 
    } else {
        callback('failed')
    }
}

/** Connects to our mongo database and returns an active client and collection.
 * @param {callback} callback Sends a callback
 */
function connectDB(callback) {
	MongoClient.connect(url, function(err, client) {
        if(err) {
            throw err;
        } else {
        	var db = client.db(db_client)
		    var collection = db.collection('Users')
		    callback(collection, db, client)
        }
	});
}

/** Finds the list's index number in the data file and returns it.
 * @param {string} list Name of the list
 * @param {JSON} data The users JSON file from the database.
 */
function getListIndex(list, data) {
    var lists = data.lists

    for (var i = 0; i < lists.length; i++) {
        if (lists[i].name === list) {
            return i
        }
    }
}

/** Finds the category's index number in the data file and returns it.
 * @param {string} list Name of the list
 * @param {string} category Name of the category
 * @param {JSON} data The users JSON file from the database.
 */
function getCategoryIndex(list, category, data) {
    var listIndex = getListIndex(list, data)
    var categories = data.lists[listIndex].categories

    for(var i = 0; i < categories.length; i++) {
        if (categories[i].name === category) {
            return i
        }
    }
}

/** Finds the category's index number in the data file and returns it.
 * @param {string} list Name of the list
 * @param {string} category Name of the category
 * @param {JSON} data The users JSON file from the database.
 */
function getItemIndex(list, category, item, data) {
    var listIndex = getListIndex(list, data)
    var categoryIndex= getCategoryIndex(list, category, data)
    var itemList = data.lists[listIndex].categories[categoryIndex].items

    for(var i = 0; i < itemList.length; i++) {
        if (itemList[i] === item) {
            return i
        }
    }
}

/** Finds the file associated with the email and returns it if it exists. If it does not exist it return the string 'failed'
 * @param {string} email the email address
 * @param {callback} callback Sends a callback
 */
function readFile(email, callback){
	connectDB(function(collection, db, client) {
		collection.findOne({email: email}, function(err, user) {
			if (err) {
				throw err;
			} else if (!user) {
				callback('failed');
			} else {
				callback(user);
			}
			client.close();
		});
	});
}

/** replaces the old database document with a new one.
 * @param {string} email The email address
 * @param {JSON} data The data to be uploaded to the database
 */
function updateDB(email, data) {
	connectDB((collection, db, client) => {
		collection.replaceOne({email: email}, data);
	  	client.close();
	});
}

/** Renames a list name
 * @param {string} email The users email address
 * @param {string} newName The lists new name
 * @param {string} oldName The lists old name
 */
function renameDB(email, newName, oldName, callback) {
	readFile(email, (user) => {
		listIndex = getListIndex(oldName, user)
		user.lists[listIndex].name = newName
		updateDB(email, user)
		callback('success')
	})
}

/** Adds a new user document to the database and returns a callback either 'error' or 'success'
 * @param {JSON} record The new users data to add to the database
 * @param {string} table the collection name
 * @param {callback} callback Sends a callback
 */
function addUserDB(record, table, callback) {
	connectDB(function(collection, db, client) {
		db.collection(table).insertOne(record, function(err, res) {
		    if (err){
		        callback("error");
		        throw err;
		    } else {
		        callback("success");
		    }
		    client.close();
   		});
	});
}


/** Deletes a user document from the database and returns a callback with either 'error' or '1 document deleted'
 * @param {json} record The users data to be deleted from the database
 * @param {string} table The collection name
 * @param {callback} callback Sends a callback
 */
function deleteUserDB(record, table, callback) {
	connectDB(function(collection, db, client) {

	    db.collection(table).deleteOne(record, function(err, res) {
	        if (err){
	            callback("error");
	            throw err;
	        } else {
	            callback("success");
	        }
	        client.close();
  		});
	});
}

/** Adds a new list to a users file and saves it to the database 
 * @param {string} email The users email address
 * @param {string} list The new lists name
 */
function addListDB(email, list, callback) {
	readFile(email, (user) => {
		user.lists.push(list);
		updateDB(email, user);
		callback('success')
	});
}

/** deletes a list from the users file and saves the change to the database
 * @param {string} email The users email address
 * @param {string} list The name of the list to be deleted
 */
function deleteListDB(email, list, callback) {
	readFile(email, (user) => {
		listIndex = getListIndex(list, user)
		user.lists.splice(listIndex, 1)
		updateDB(email, user)
		callback('success')
	})
}

/** Adds a category to the specified list and saves it to database
 * @param {string} email The email address
 * @param {int} listIndex The index number for the list you are editing
 * @param {string} categoryName The name for the category you want to add
 */
function addCategoryDB(email, list, category, callback) {
	readFile(email, (user) => {
		var listIndex = getListIndex(list, user)
		var categoryObj = {"name": category, "items": [] };

		user.lists[listIndex].categories.push(categoryObj);
		updateDB(email, user)

		callback('success')
	});
}

/** Deletes a users specified category from the database.
 * @param {string} email The email address
 * @param {string} list The list you are deleting a category from
 * @param {string} category The category you wish to delete
 * @param {callback} callback Sends a callback
 */
function deleteCategoryDB(email, list, category, callback) {
    readFile(email, (user) => {
    	var listIndex = getListIndex(list, user);
    	var categoryIndex = getCategoryIndex(list, category, user);

    	user.lists[listIndex].categories.splice(categoryIndex,1);
   		updateDB(email, user);

   		callback('success');
    });
}

/** adds an item to a users list under a category and saves it to the database
 * @param {string} email The users email address
 * @param {string} list The list to be edited
 * @param {string} category The category the item will be added under
 * @param {string} item The item to be added
 * @param {callback} callback Sends a callback
 */
function addItemDB(email, list, category, item, callback) {
	readFile(email, (user) => {
		var listIndex = getListIndex(list, user);
		var categoryIndex = getCategoryIndex(list, category, user);

		user.lists[listIndex].categories[categoryIndex].items.push(item)
		updateDB(email, user);

		callback('success');
	});
}

/** Deletes an item from the entered list, and category, from the database
 * @param {string} email The users email address
 * @param {string} list The list to be edited
 * @param {string} category The category the item will be added under
 * @param {string} item The item to be added
 * @param {callback} callback Sends a callback
 */
function deleteItemDB(email, list, category, item, callback) {
	readFile(email, (user) => {
		var listIndex = getListIndex(list, user);
		var categoryIndex = getCategoryIndex(list, category, user);
		var itemIndex= getItemIndex(list, category, item, user)

		user.lists[listIndex].categories[categoryIndex].items.splice(itemIndex, 1);
		updateDB(email, user);

		callback('success');
	});
}

/*
function renameListDB(newname, email){
  connectDB((collection, db, client) => {
      //readFile(email);
	
		collection.update({email: email},{$set:{name:newname}});
		//updateDB(email, user);

		callback('success');
	});
}
*/
    
module.exports = {
	login,
	signup,
	getListIndex,
	getCategoryIndex,
	getItemIndex,
	readFile,
	updateDB,
	renameDB,
	addUserDB,
    deleteUserDB,
    addListDB,
    deleteListDB,
    addCategoryDB,
    deleteCategoryDB,
    addItemDB,
    addListDB,
    deleteItemDB,
    deleteListDB

}


	


// henrys unittest example to me (nick)
// var obj = {
// 	id:expect.anything(),
// 	name:expect.anything()
// }

// test("dbRead", (done)=>{
// 	readFile({data:"stuff"}, (err, data)=>{
// 		expect(data).toBe("failed");
// 		expect(data).toEqual(obj);
// 		done();
// 	})
