const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://Nick.s:student@ds014388.mlab.com:14388/grocery_list_project'

	/*create: function(data, callback){
		MongoClient.connect(url, function(err, client) {
		if(err) {
	    	console.log(err);
	  	} else {
	  		console.log('We are connected to mongodb!');
	  	}
	  	//setup for DB
	  	const db = client.db('grocery_list_project')
	  	const collection = db.collection('nick')
	  	if(data.type === "findOne"){
	  		collection.findOne(data.data)....
	  		{
	  			callback(err, user)
	  			client.close();
	  		}
	  	}
	  })
	},*/
function readFile(data, callback){
	MongoClient.connect(url, function(err, client) {
		if(err) {
	    	console.log(err);
		}

	  	const db = client.db('grocery_list_project')
	  	const collection = db.collection('Users')

		collection.findOne(data, function(err, user) {
			if(!user) {
				callback(err, 'failed')
			} else {
				callback(err, user)
			}
			client.close();
		});
	});
}

// function dropCategory(user,list,category){
// 	MongoClient.connect(url, function(err, client) {
// 		if(err) {
// 	    	console.log(err);
// 		}
// 	const db = client.db('grocery_list_project')
// 	const collection = db.collection('Users')
// 	var myObj = collection.find({'user':user});
// 	//the indexes shouldnt be 0 they need to be the index of the thing were passing in
// 	var check = myObj.lists.indexOf(list);
// 	var secondIndex = myObj.lists[check].category.indexOf(category);
// 	if(check!=-1 && secondIndex!= -1 )
// 	{
// 		delete myObj.lists.[check].category[secondIndex];
// 		db.collection.replaceOne({'user':user,myObj)
// 	}
// 	//then have to update the collection


// }
function updateDb(email,data)
{
	MongoClient.connect(url, function(err, client) {
		if(err) {
	    	console.log(err);
		}

	  	const db = client.db('grocery_list_project')
	  	const collection = db.collection('Users')

	  	collection.replaceOne(email, data);

	  	client.close();
	  });
}

function deleteCategoryDb(email, listIndex, categoryIndex){

    readFile(email, function(err, user) {
    	
    	delete user.lists[listIndex].categories[categoryIndex];
    	
   		updateDb(email, user)

    })
}

function addCategoryDb(email, listIndex, categoryName) {
	readFile(email, function(err, user) {


		var categoryObj = {"name":categoryName,
							"items":[]};

		user.lists[listIndex].categories.push(categoryObj);

		console.log(user.lists[0].categories);

		updateDb(email, user)
	})
}

function addUserDb(record,table, callback){
    MongoClient.connect(url, function(err, client) {
        if(err) {
	    	console.log(err);
		}
        const db = client.db('grocery_list_project')

	    db.collection(table).insertOne(record, function(err, res) {
        if (err){
            callback("error");
            throw err;
        } else {
    	    console.log("1 document inserted");
            callback("success");
        }
    	});
        client.close();
    });
}

function deleteUserDb(record,table, callback){
    MongoClient.connect(url, function(err, client) {
        if(err) {
	    	console.log(err);
		}
        const db = client.db('grocery_list_project')
        
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
	readFile,
	addUserDb,
	updateDb,
    deleteUserDb,
    deleteCategoryDb,
    addCategoryDb
}