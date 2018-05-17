function checkSignUp(){
	console.log("checkSignUp")
	var username = document.getElementById('username').value
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;
	var repassword = document.getElementById('repassword').value;

	if(username === ""){
		alert("username cannot be empty")
	}

	if(password === ""){
		alert("password cannot be empty")
	}

	if(repassword === ""){
		alert("Re-enter Password cannot be empty")
	}

	if (email.indexOf('@') > 0 && email.indexOf('.') > 0 && (email.indexOf('com') > 0 || email.indexOf('ca') > 0)) {
		if(password != repassword){
			alert("Passwords don't match")
		}
	} else {
		alert("Email format incorrect")
	}
}

document.getElementById("createacc").addEventListener("click", function(){
	checkSignUp();
});