document.getElementById("createacc").addEventListener("click", function(){
	var username = document.getElementById('username').value
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;
	var repassword = document.getElementById('repassword').value;
	
	var msg = checkSignUp(username, email, password, repassword);
	if (msg != "Account Created!"){
		swal(msg);
		document.getElementById('password').value = "";
		document.getElementById('repassword').value = "";
		if(msg === "Email format incorrect"){
			document.getElementById('email').value = "";
		}
	}
});