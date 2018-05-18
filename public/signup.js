document.getElementById("createacc").addEventListener("click", function(){
	var username = document.getElementById('username').value
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;
	var repassword = document.getElementById('repassword').value;
	
	alert(checkSignUp(username, email, password, repassword));
});