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

function createTable(newTable) {
	MongoClient.connect(url, function(err, client) {
		if(err) {
	    	console.log(err);
		}
		
		const db = client.db('grocery_list_project')
		
		db.createCollection(newTable, function(err, res) {
			if (err) throw err;
			console.log("Collection created!");
			client.close();
		});
	});
}

function addRecord(record,table){
    MongoClient.connect(url, function(err, client) {
        if(err) {
	    	console.log(err);
		}
        const db = client.db('grocery_list_project')

	    db.collection(table).insertOne(record, function(err, res) {
        if (err) throw err;
    	    console.log("1 document inserted");
    	});
        client.close();
    });
}   

module.exports = {
	readFile,
	addRecord,
	createTable
}

