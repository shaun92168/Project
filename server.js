/** express module */
const express = require('express');

/** handlebars module */
const hbs = require('hbs');

/** File Share module */
const fs = require('fs')

/** Mongo Database module */
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://Nick.s:student@ds014388.mlab.com:14388/grocery_list_project'
const dbf = require('./database_functions.js')

/** localhost test port */
const port = process.env.PORT || 8080;

var app = express();

// handlebars setup
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));

// bodyparser setup
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(bodyParser.json())


/** Connects to the mongo Database 
 * @name database
 */
MongoClient.connect(url, function(err, client) {
	if(err) {
    	console.log(err);
  	} else {
  		console.log('We are connected to mongodb!');
  	}

  	//setup for DB
  	const db = client.db('grocery_list_project')
  	const collection = db.collection('nick')

	/**
	 * Sends back the html page
	 * @name login
	 * @function
	 */
	app.get('/login', function(req, res, next) {
	  res.render('login', {title: 'Login', message: 'You must login'});
	});

	/**
	 * @login
	 * Reads the json file login.json to parse username and password
	 * @param {string} Username 
	 * @param {string} Password 
	 * Sets username and password
	 * gets and renders the home.hbs file
	 */
	app.post('/login', function(req, res) {
	    var email = req.body.email;
	    var password = req.body.password;
	    var loginCredentials = JSON.parse(fs.readFileSync('login.json'));

	    if (email == loginCredentials.email && password == loginCredentials.password) {
	    	app.set('email', email)
	    	app.set('password', password)

	    	dbf.getFile(collection).then((result) => {
	    		res.render('home.hbs', {
					email: app.settings.email,
					lists: result
	    		})
			});
	    } else {
			res.end('failed')
		}
	});
	
	app.post('/login', function(req, res) {
		collection.findOne({email:req.body.email}, function(err, user){
			if(!user){
				res.render('login.hbs',{
					error:'Wrong email or password'
				})
			} else {
				if(req.body.password === user.password) {
					req.session.user = user
					res.redirect('/homePage')
				} else {
					res.render('login.hbs', {
						error:'Wrong email or password'
					})
				}
			}
		})
	});

	/**
	 * respond with "ok" when a GET request is made to the add new item
	 * @name add new item
	 * @function
	 */
	app.post('/add-new-item', function(req, res) {
		console.log(req.body)
		res.send('ok')
	});

  	// Start of website - the login page
  	// problem: should be app.use
  	app.get('/loginPage', (request, response) => {
		response.render('login.hbs')
	});
    
    // Second page - login page moves user here
    /**
     * This takes the username and go to the home page at home.hbs
     * @name homePage
     * @function
     * @param {JSON} request
     * @param {JSON} response
     */

    app.get('/homePage', (request, response) => {
    	dbf.getFile(collection).then((result) => {
   			response.render('home.hbs', {
				email: app.settings.email,
				lists: result
			});
    	})
	});

    
    /** User input what grocery items they want and then click a button. 
    The webpage then requests information from the database, which then response by sending that information back to the webpage. 
    Next, the requested information is displayed on the webpage. 
     * @name ListPage
     * @function
     * @param {JSON} request
     * @param {JSON} response
     */
    // Third page - user edit lists here
	app.get('/listsPage', (request, response) => {
		dbf.getFile(collection).then((result) => {
			response.render('lists.hbs', {
				lists: result
			})
		})
	})
    
});


app.listen(port, () => {
	console.log(`Server is up on the port ${port}`);
});