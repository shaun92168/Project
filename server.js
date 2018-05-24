/** express module */
const express = require('express');

/** handlebars module */
const hbs = require('hbs');

/** File Share module */
const fs = require('fs');

/** localhost test port */
const port = process.env.PORT || 8080;

/** 
 * shorthand for the express module 
 * @var {} app
 */
var app = express();

/** client-sessions module */
const session = require('client-sessions');

/**
 * imports the connect.js file
 * @var {} getDB
 */
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
    duration: 1 * 60 * 60 * 1000,
    activeDuration: 1 * 30 * 60 * 1000
}));

/**
 * sends the username and password to the DB for validation, if true it redirects to the homepage, 
 * else it renders the login page with a error message
 * @name login
 * @function
 * @param {JSON} request
 * @param {JSON} response
 */
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

/**
 * sends the signup data to the DB for validation, if true it redirects to the homepage, 
 * else it renders the signup page again
 * @name signup
 * @function
 * @param {JSON} request
 * @param {JSON} response
 */
app.post('/signup', function (req, res) {
    getDB.signup(req.body.username, req.body.email, req.body.password, req.body.repassword, (msg) => {
        if (msg === 'failed') {
            // res.render('signup.hbs')
        } else {
            req.session.msg = msg
            res.redirect('/')
        }
    });
});

/**
 * renders the login page
 * @name /
 * @function
 * @param {JSON} request
 * @param {JSON} response
 */
app.get('/', (request, response) => {
    response.render('login.hbs')
});

/**
 * renders the signup page
 * @name signup
 * @function
 * @param {JSON} request
 * @param {JSON} response
 */
app.get('/signup', (request, response) => {
    response.render('signup.hbs')
});

/**
 * This takes the username and go to the home page at home.hbs
 * @name homePage
 * @function
 * @param {JSON} request
 * @param {JSON} response
 */
app.get('/homePage', function(req, res) {
    if(req.session && req.session.user) {
        getDB.readFile(req.session.user.email, (user) => {
            req.session.user = user
            res.render('home.hbs', {
                username: req.session.user.username,
                lists: req.session.user.lists
            });
        });
    } else {
        res.redirect('/');
    }
});

/**
 * sends a lists old name and the new name to the DB to change it. if it returns true then the function sends a response to the webpage.
 * @name addList
 * @function
 * @param {JSON} request
 * @param {JSON} response
 */
app.post('/renameList', (req, res) => {
    var email = req.session.user.email
    var newList = req.body.newList
    var oldList = req.body.oldList
    getDB.renameDB(email, newList, oldList, (msg) => {
        if (msg === 'success') {
            res.send('ok')
        }
    });
});

/**
 * sends the new lists name to the DB to add it. if it returns true then the function sends a response to the webpage.
 * @name addList
 * @function
 * @param {JSON} request
 * @param {JSON} response
 */
app.post('/addList', (req, res) => {
    var email = req.session.user.email
    var list = req.body
    getDB.addListDB(email, list, (msg) => {
        if (msg === 'success') {
            res.send('ok')
        }
    });
});

/**
 * sends a the lists name to the DB to delete it. if it returns true then the function sends a response to the webpage.
 * @name deleteList
 * @function
 * @param {JSON} request
 * @param {JSON} response
 */
app.post('/deleteList', (req, res) => {
    var email = req.session.user.email
    var list = req.body.list
    getDB.deleteListDB(email, list, (msg) => {
        if (msg === 'success') {
            res.send('ok')
        }
    })
});

/**
 * sends a category and list to the DB to add the category to the list. 
 * if it returns true then the function sends a response to the webpage.
 * @name addCategory
 * @function
 * @param {JSON} request
 * @param {JSON} response
 */
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

/**
 * sends a category and list to the DB to delete the category from the list. 
 * if it returns true then the function sends a response to the webpage.
 * @name deleteCategory
 * @function
 * @param {JSON} request
 * @param {JSON} response
 */
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

/**
 * sends a category, item and list to the DB to add the item to the list. 
 * if it returns true then the function sends a response to the webpage.
 * @name addItem
 * @function
 * @param {JSON} request
 * @param {JSON} response
 */
app.post('/addItem', (req, res) => {
    var email = req.session.user.email
    var list = req.session.user.currentList
    var category = req.body.category
    var item = req.body.item
    getDB.addItemDB(email, list, category, item, (msg) => {
        if (msg === 'success') {
            res.send('ok');
        } else {
            res.send('not ok')
        }
    });
});

/**
 * sends a category, item and list to the DB to delete the item from the list. 
 * if it returns true then the function sends a response to the webpage.
 * @name deleteItem
 * @function
 * @param {JSON} request
 * @param {JSON} response
 */
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

/** 
 * User input what grocery items they want and then click a button. 
 * The webpage then requests information from the database, which then response by sending that information back to the webpage. 
 * Next, the requested information is displayed on the webpage. 
 * @name groceryListPage
 * @function
 * @param {JSON} request
 * @param {JSON} response
 */
app.post('/listPage', function(req, res) {
    if(req.session && req.session.user) {
        getDB.readFile(req.session.user.email, (user) => {
            req.session.user = user
            req.session.user.currentList = req.body.radioList
            listIndex = getDB.getListIndex(req.body.radioList, req.session.user)
            res.render('list.hbs', {
                list: req.session.user.lists[listIndex]
            });
        });
    } else {
        res.redirect('/');
    }
});

/**
 * renders the account page
 * @name /account
 * @function
 * @param {JSON} request
 * @param {JSON} response
 */
app.get('/account', (request, response) => {
    response.render('accountsettings.hbs')
});

/**
 * renders the about page
 * @name /about
 * @function
 * @param {JSON} request
 * @param {JSON} response
 */
app.get('/about', (request, response) => {
    response.render('about.hbs')
});

/**
 * deletes session data and redirects to login page
 * @name /logout
 * @function
 * @param {JSON} request
 * @param {JSON} response
 */
app.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is up on the port ${port}`);
});