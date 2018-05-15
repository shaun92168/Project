var getDB = require('./connect.js')

/**
 * Checks the email for proper format, if this passes if checks to see if the email is in the database.
 * If this also passes it checks that the users password matchs the databases password.
 * @param {string} email the users email address
 * @param {string} password The users password
 * @param {callback} callback Sends a callback 
 */
function login(email, password, callback) {
    if (email.indexOf('@') > 0 && email.indexOf('.') > 0 && (email.indexOf('com') > 0 || email.indexOf('ca') > 0)) {
        getDB.readFile(email, (err, user) => {
            if(user === 'failed') {
                callback(err, 'failed')
            } else {
                if (password === user.password) {
                    callback(err, user)
                } else {
                    callback(err, 'failed')
                }
            }
        }); 
    } else {
        callback('failed')
    }
}

module.exports = {
    login,
}