var app = require('http');
var fs = require('fs');
var pg = require('pg');
var qs = require('querystring');
var UserL = require('./js/UserLog');
var conString = "postgres://postgres:password@localhost:port/database";
var db = new pg.Client(conString);
var port = process.env.PORT || 5000;
var dir = process.cwd();

db.connect();

app.createServer(function (req, res) {

if ('/' == req.url) { //if home, req url =127.0.0.1:8080/
		UserL.LoginForm(res, fs);
		console.log("new user");//	
		
} else if ('/new' == req.url){
	UserL.NewUserForm(res, fs);
	
} else if ('/auth' == req.url) { //req url =127.0.0.1:8080/auth

	var body = '';	var tName;
	
	req.on('data', function (chunk) {	body += chunk;	});
	
	req.on('end', function (){

		var passwd = qs.parse(body).password; //break the data into pieces (password/ user..) ^
		if(passwd == 'aaaa'){
			var name = qs.parse(body).name; // user from recieved data ^^
			newuser = new UserL.User(name);
			tName = newuser.GetName();
		
		}		UserL.GetUsersHTML(res, fs, db, tName);
	});
		
} else if ('/newauth' == req.url) { //req url =127.0.0.1:8080/auth

	var body = '';	var tName;
	
	req.on('data', function (chunk) {	body += chunk;	});

	req.on('end', function (){

		var passwd = qs.parse(body).password; //break the data into pieces (password/ user..) ^
		if(passwd == 'aaaa'){
			var name = qs.parse(body).name; // user from recieved data ^^
			newuser = new UserL.User(name);
			tName = newuser.GetName();
		
		}	UserL.GetUsersHTML(res, fs, db, tName);		
	});		

} else if ('/logout' == req.url) {
		
	var tName = newuser.GetName();
	UserL.LogoutQ(db, tName); //update set on to 'false'(0)
	UserL.LogoutHTML(res, fs);
};
}).listen(port);	console.log(port);