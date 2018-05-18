/** express module */
const express = require('express');

/** handlebars module */
const hbs = require('hbs');

/** File Share module */
const fs = require('fs');

/** localhost test port */
const port = process.env.PORT || 8080;

var app = express();
var session = require('client-sessions');
var getDB = require('./connect.js');

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

app.post('/login', function(req, res) {
    getDB.login(req.body.email, req.body.password, (user) => {
        if (user === 'failed') {
            res.render('login.hbs', {
                error: 'Wrong email or password'
            });
        } else {
            req.session.user = user
            res.redirect('/homePage')
        }
    });
});

app.post('/signup', function (req, res) {
    getDB.signup(req.body.username, req.body.email, req.body.password, req.body.repassword, (msg) => {
        if (msg === 'failed') {
            //res.render('signup.hbs')
        } else {
            req.session.msg = msg
            res.redirect('/homePage')
        }
    });
});

// Renders the login page
app.get('/', (request, response) => {
    response.render('login.hbs')
});

// Renders the signup page
app.get('/signup', (request, response) => {
    response.render('Signup.hbs')
});

app.get('/maps',(request,response)=>{
	response.render('maps.hbs')
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
            username: req.session.user.username,
            lists: req.session.user.lists
        });
    } else {
        res.redirect('/');
    }
});

/** User input what items they want and then click a button.
 * @name ListPage
 * @function
 * @param {JSON} request
 * @param {JSON} response
 */
app.get('/listsPage/:listname', function(req, res) {
    if(req.session && req.session.user) {
        var allLists = req.session.user.lists;
        var listName = req.params.listname;
        var correctList = null;

        // GO TRHOUGH ALL LIST ITEMS
          // IF CURRENT LIST.name === listName
            // correctList = CURRENT LIST 
            // break;

        // IF correctLIST === null ???
            // render ERROR>HBS
        // ELSE
            // render list.hbs

            res.render('lists.hbs', {
            list: correctList
        });
    } else {
        res.redirect('/');
    }
});

app.post('/addCategory', (req, res) => {
    var email = req.session.user.email
    var list = req.session.user.currentList
    var category = req.body.category
    getDB.addCategoryDB(email, list, category, (msg) => {
        if (msg === 'success') {
            res.send('ok')
        }
    });
});

app.post('/deleteCategory', (req, res) => {
    var email = req.session.user.email
    var list = req.session.user.currentList
    var category = req.body.category
    getDB.deleteCategoryDB(email, list, category, (msg) => {
        if (msg === 'success') {
            res.send('ok');
        }
    });
});

app.post('/addItem', (req, res) => {
    var email = req.session.user.email
    var list = req.session.user.currentList
    var category = req.body.category
    var item = req.body.item
    getDB.addItemDB(email, list, category, item, (msg) => {
        if (msg === 'success') {
            res.send('ok');
        }
    });
});

app.post('/deleteItem', (req, res) => {
    var email = req.session.user.email
    var list = req.session.user.currentList
    var category = req.body.category
    var item = req.body.item
    getDB.deleteItemDB(email, list, category, item, (msg) => {
        if (msg === 'success') {
            res.send('ok');
        }
    });
});

/** User input what grocery items they want and then click a button. 
The webpage then requests information from the database, which then response by sending that information back to the webpage. 
Next, the requested information is displayed on the webpage. 
 * @name groceryListPage
 * @function
 * @param {JSON} request
 * @param {JSON} response
 */
app.get('/groceryListPage', function(req, res) {
    if(req.session && req.session.user) {
        req.session.user.currentList = req.session.user.lists[0].name
        res.render('grocerylist.hbs', {
            lists: req.session.user.lists
        });
    } else {
        res.redirect('/');
    }
});

/*
 * Start the account page
 */
app.get('/account', (request, response) => {
    response.render('accountsettings.hbs')
});

app.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`Server is up on the port ${port}`);
});


/*
 * For Unit Testing
 */
// module.exports = app;