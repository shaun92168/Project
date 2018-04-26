// setup stuff
const express = require('express');
const hbs = require('hbs');
const fs = require('fs')
const mongodb = require('mongodb');

const port = process.env.PORT || 8080;

var app = express();

// handlebars setup
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));

// test text

// bodyparser setup
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(bodyParser.json())

// connects to the mongoDB

mongodb.MongoClient.connect('mongodb://Nick.s:student@ds014388.mlab.com:14388/grocery_list_project', function(err, client) {
	if(err) {
    	console.log(err);
  	} else {
  		console.log('We are connected to mongodb!');
  	}

  	//setup for DB
  	const db = client.db('grocery_list_project')
  	const collection = db.collection('nick')

  	// loads the users lists from the DB
  	var getFile = new Promise((resolve, reject) => {
	  	collection.findOne({name: 'Grocery List'}, function(err, result) {
	    	if (err) throw err;

	    	if (result == null) {
	    		console.log('failed to find file')
	    		reject()
	    	} else {
	    		resolve([result])
	    	}
	    })
	});

	// problem: does not load /home page, instead loads a clone of it.
	app.post('/login', function(req, res) {
	    var username = req.body.username;
	    var password = req.body.password;
	    var loginCredentials = JSON.parse(fs.readFileSync('login.json'));

	    if (username == loginCredentials.username && password == loginCredentials.password) {
	    	app.set('username', username)
	    	app.set('password', password)

	    	getFile.then((result) => {
	    		res.render('home.hbs', {
					username: app.settings.username,
					lists: result
	    		})
			});
	    } else {
			res.end('failed')
		}
	});

	app.post('/add-new-item', function(req, res) {
		console.log(req.body)
		res.send('ok')
	});

  	// Start of website - the login page
  	// problem: should be app.use
	/**
	 * This function render the loginPage
	 * @name loginPage
	 * @function 
	 * @param {JSON} request
	 * @param {JSON} response
	 */
  	app.get('/loginPage', (request, response) => {
		response.render('login.hbs')
	});

  	// Second page - login page moves user here
    app.get('/homePage', (request, response) => {
    	getFile.then((result) => {
   			response.render('home.hbs', {
				username: app.settings.username,
				lists: result
			});
    	})
	});

    // Third page - user edit lists here
	app.get('/listsPage', (request, response) => {
		getFile.then((result) => {
			response.render('lists.hbs', {
				lists: result
			})
		})
	})
});

app.listen(port, () => {
	console.log('Server is up on the port ${port}');
});