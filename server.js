/** express module */
const express = require('express');

/** handlebars module */
const hbs = require('hbs');

/** File Share module */
const fs = require('fs');

/** Mongo Database module */
const MongoClient = require('mongodb').MongoClient;

/** Mongo Database url*/
const url = 'mongodb://Nick.s:student@ds014388.mlab.com:14388/grocery_list_project'

/** imports a serperate file with the database functions*/
const dbf = require('./database_functions.js');

/** localhost test port */
const port = process.env.PORT || 8080;

var app = express();

var session = require('client-sessions');

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

// creates a session
app.use(session({
	cookieName: 'session',
	secret: 'our_secret_stuff',
	duration: 5 * 60 * 1000,
	activeDuration: 5 * 30 * 1000
}));

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

  	app.use((req, res, next) => {
  		if (req.session && req.session.user) {
  			collection.findOne({email: req.session.user.email}, function(err, user) {
  				if (user) {
  					req.user = user;
  					delete req.user.password;
  					req.session.user = user;
  					res.locals.user = user;
  				}
  				next();
  			})
  		} else {
  			next();
  		}
  	});

  	function requiredLogin(req, res, next) {
  		if (!req.user) {
  			res.redirect('/')
  		} else {
  			next();
  		}
  	}

  	// Start of website - the login page
  	app.get('/', (request, response) => {
		response.render('login.hbs')
	});

	/**
	 * Sends back the html page
	 * @name login
	 * @function
	 */
	app.get('/login', function(req, res, next) {
	  res.render('login', {
	  		title: 'Login',
	  		message: 'You must login'
	  	});
	});

	/**
	 * @login
	 * Checks database for the account, if it exists it moves to 'homePage.hbs'. if it does not it renders 'login.hbs' with a error message
	 * @param {string} Username 
	 * @param {string} Password 
	 * Sets username and password
	 * gets and renders the home.hbs file
	 */
	app.post('/login', function(req, res) {
	    collection.findOne({email: req.body.email}, function(err, user) {
	    	if (!user) {
	    		res.render('login.hbs', {
	    			error: 'Wrong email or password'
	    		})
	    	} else {
	    		if (req.body.password === user.password) {
	    			req.session.user = user
	    			res.redirect('/homePage')
	    		} else {
	    			res.render('login.hbs', {
	    				error: 'Wrong email or password'
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
    
    // Second page - login page moves user here
    /**
     * This takes the username and go to the home page at home.hbs
     * @name homePage
     * @function
     * @param {JSON} request
     * @param {JSON} response
     */

    app.get('/homePage', requiredLogin, function(request, response) {
    	dbf.getFile(collection).then((result) => {
   			response.render('home.hbs', {
				email: request.user.email,
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
	app.get('/listsPage', requiredLogin, function(request, response) {
		dbf.getFile(collection).then((result) => {
			response.render('lists.hbs', {
				lists: result
			})
		})
	})

	app.get('/logout', (req, res) => {
		req.session.reset();
		res.redirect('/login');
	})
});


app.listen(port, () => {
	console.log(`Server is up on the port ${port}`);
});