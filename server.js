/** express module */
const express = require('express');

/** handlebars module */
const hbs = require('hbs');

/** File Share module */
const fs = require('fs');

const dbf = require('./database_functions.js');

/** localhost test port */
const port = process.env.PORT || 8080;

var app = express();

var session = require('client-sessions');
var getDB = require("./connect");
// handlebars setup
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));

// bodyparser setup
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
app.use(bodyParser.json())

// creates a session
app.use(session({
    cookieName: 'session',
    secret: 'our_secret_stuff',
    duration: 5 * 60 * 1000,
    activeDuration: 2 * 60 * 1000
}));

/**
 * @login
 * Checks database for the account, if it exists it moves to 'homePage.hbs'. if it does not it renders 'login.hbs' with a error message
 * @param {string} Username 
 * @param {string} Password 
 * Sets username and password
 * gets and renders the home.hbs file
 */
app.post('/login', function(req, res) {

    getDB.readFile({email: req.body.email}, function(err, user) {
    	if(user === 'failed') {
    		res.render('login.hbs', {
                error: 'Wrong email or password'
            });
    	} else {
            if (req.body.password === user.password) {
                req.session.user = user
                res.redirect('/homePage')
            } else {
                res.render('login.hbs', {
                    error: 'Wrong email or password'
                });
            }
        }
    });
});

// Renders the login page
app.get('/', (request, response) => {
    response.render('login.hbs')
});

// Renders the signup page
app.get('/SignupPage', (request, response) => {
    response.render('Signup.hbs')
});

/**
 * This takes the username and go to the home page at home.hbs
 * @name homePage
 * @function
 * @param {JSON} request
 * @param {JSON} response
 */
app.get('/homePage', function(req, res) {
	if(req.session && req.session.user){
		res.render('home.hbs', {
            email: req.session.user.email,
            lists: req.session.user.lists
        });
	} else {
		res.redirect('/');
	}
});

/** User input what grocery items they want and then click a button. 
The webpage then requests information from the database, which then response by sending that information back to the webpage. 
Next, the requested information is displayed on the webpage. 
 * @name ListPage
 * @function
 * @param {JSON} request
 * @param {JSON} response
 */
app.get('/listsPage', function(req, res) {
	if(req.session && req.session.user) {
		res.render('lists.hbs', {
            lists: req.session.user.lists
        });
	} else {
		res.redirect('/');
	}
});

/*
 * Start the account page
 */
// Doesn't need to connect to db
app.get('/account', (request, response) => {
    response.render('accountsettings.hbs')
});

// Doesn't need to connect to db
app.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect('/');
})

// Doesn't need to connect to db
function requiredLogin(req, res, next) {
    if (!req.user) {
        res.redirect('/')
    } else {
        next();
    }
}

app.listen(port, () => {
    console.log(`Server is up on the port ${port}`);
});



/*
 * For Unit Testing
 */
module.exports = app;