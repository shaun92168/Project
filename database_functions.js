// gets the file with the name grocery list from the db
function getFile(collection) {
	return new Promise((resolve, reject) => {
		collection.findOne({name: 'Grocery List'}, function(err, result) {
			if (err) throw err;

			if (result == null) {
				console.log('failed to find file')
				reject()
			} else {
				console.log('worked');
				resolve([result])
			}
		})
	})
}

function createTable(dbo, tableName) {
    dbo.createCollection(tableName, function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
    })
}

function createItem(dbo, tableName, newObj) {
    dbo.collection(tableName).insertOne(newObj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
    })
}

// put function name to export it
module.exports = {
	getFile, createTable, createItem
}