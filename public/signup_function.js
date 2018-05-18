/**
 * This check all the fields in the sign up page are filled in correctly
 * @name checkSignUp
 * @function
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string} repassword
 */
function checkSignUp(username, email, password, repassword){
	if(username === ""){
		//alert("username cannot be empty");
		return "Username cannot be empty"
	}

	if(email === ""){
		//alert("username cannot be empty");
		return "Email cannot be empty"
	}

	if(password === ""){
		//alert("password cannot be empty")
		return "Password cannot be empty"
	}

	if(repassword === ""){
		//alert("Re-enter Password cannot be empty")
		return "Re-enter Password cannot be empty"
	}

	if(email.indexOf('@') > 0 && email.lastIndexOf('.') > email.indexOf('@')  && (email.lastIndexOf('com') > email.indexOf('@') || email.lastIndexOf('ca') > email.indexOf('@')) && email.indexOf('@') === email.lastIndexOf('@')) {
		if(password != repassword){
			//alert("Passwords don't match")
			return "Passwords don't match"
		}
	} else {
		//alert("Email format incorrect")
		return "Email format incorrect"
	}

	return "Account Created!"
}

module.exports = {
	checkSignUp
}