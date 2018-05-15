const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://Nick.s:student@ds014388.mlab.com:14388/grocery_list_project'

/** Connects to our mongo database and returns an active client and collection.
 * @param {callback} callback Sends a callback
 */
function connectDB(callback) {
	MongoClient.connect(url, function(err, client) {
        if(err) {
            console.log(err);
        }
	    var db = client.db('grocery_list_project')
	    var collection = db.collection('Users')

	    callback(collection, db, client)
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

/** Finds the file associated with the email and returns it if it exists. If it does not exist it return the string 'failed'
 * @param {string} email the email address
 * @param {callback} callback Sends a callback
 */
function readFile(email, callback){
	connectDB(function(collection, db, client) {
		collection.findOne({email: email}, function(err, user) {
			if(!user) {
				callback(err, 'failed');
			} else {
				callback(err, user);
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
	connectDB(function(collection, db, client) {
		collection.replaceOne(email, data);
	  	client.close();
	})
}

/** Deletes a users specified category from the database.
 * @param {string} email The email address
 * @param {string} list The list you are deleting a category from
 * @param {string} category The category you wish to delete
 * @param {callback} callback Sends a callback
 */
function deleteCategoryDB(email, list, category, callback) {
    readFile(email, function(err, user) {
    	var listIndex = getListIndex(list, user);
    	var categoryIndex = getCategoryIndex(list, category, user);

    	// fix so it doesnt leave a null
    	delete user.lists[listIndex].categories[categoryIndex];
    	console.log(user.lists[0]);
   		// updateDb(email, user)

   		callback('success')
    });
}

// tests drop category function
// deleteCategoryDB('nick@123.ca', 'grocery list', 'Produce', (msg) => {
// 	console.log(msg)
// })

/** Adds a category to the specified list and saves it to database
 * @param {string} email The email address
 * @param {int} listIndex The index number for the list you are editing
 * @param {string} categoryName The name for the category you want to add
 */
function addCategoryDB(email, listIndex, categoryName) {
	readFile(email, function(err, user) {
		var categoryObj = {"name": categoryName, "items": [] };

		user.lists[listIndex].categories.push(categoryObj);
		console.log(user.lists[0].categories);

		updateDb(email, user)
	});
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
			    console.log("1 document inserted");
		        callback("success");
		    }
		    client.close();
   		});
	});
}

/** Deletes a user document from the database and returns a callback with either 'error' or '1 document deleted'
 * @param {json} record the users data to be deleted from the database
 * @param {string} table the collection name
 * @param {callback} callback Sends a callback
 */
function deleteUserDB(record, table, callback) {
	connectDB(function(collection, db, client) {
	    db.collection(table).deleteOne(record, function(err, res) {
	        if (err){
	            callback("error");
	            throw err;
	        } else {
	            console.log("1 document deleted");
	            callback("success");
	        }
  		});
  		client.close();
	});
}

module.exports = {
	getListIndex,
	getCategoryIndex,
	readFile,
	addUserDB,
	updateDB,
    deleteUserDB,
    deleteCategoryDB,
    addCategoryDB
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
// })