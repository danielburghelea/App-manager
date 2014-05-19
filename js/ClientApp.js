var app = require('http');
var fs = require('fs');
var pg = require('pg');
var qs = require('querystring');
var UserL = require('./UserLog');
var conString = "postgres://postgres:1Ciocolata@localhost:5432/users";
var client = new pg.Client(conString);
var port = process.env.PORT || 5000;
//var io = require('socket.io').listen(app);

client.connect();

app.createServer(function (req, res) {

	
if ('/' == req.url) { //if home, req url =127.0.0.1:8080/
		UserL.LoginForm(res, fs);
		console.log("new user");//		

} else if ('/new' == req.url){
	UserL.NewUserForm(res, fs);
	
} else if ('/auth' == req.url) { //req url =127.0.0.1:8080/auth

	var body = '';	
	var tName;
	
	req.on('data', function (chunk) { //recieve data (user and password)
			body += chunk;
	});
	
	req.on('end', function (){

		var passwd = qs.parse(body).password; //break the data into pieces (password/ user..) ^
		if(passwd == 'aaaa'){
			var name = qs.parse(body).name; // user from recieved data ^^
			newuser = new UserL.User(name);
			tName = newuser.GetName();
		}

		res.writeHead(200, { 'Content-Type': 'text/html'});
		res.write('Hello <b>' + tName + '!<b><br><br>');	
		res.write('Users online: <br>');
	
		UserL.ExistingUsers(client, tName);
		UserL.GetUserQ(client, res, tName);
	});
				
} else if ('/newauth' == req.url) { //req url =127.0.0.1:8080/auth

	var body = '';	
	var tName;
	
	req.on('data', function (chunk) { //recieve data (user and password)
			body += chunk;
	});

	req.on('end', function (){

		var passwd = qs.parse(body).password; //break the data into pieces (password/ user..) ^
		if(passwd == 'aaaa'){
			var name = qs.parse(body).name; // user from recieved data ^^
			newuser = new UserL.User(name);
			tName = newuser.GetName();
		}

		res.writeHead(200, { 'Content-Type': 'text/html'});
		res.write('Hello <b>' + tName + '!<b><br><br>');	
		res.write('Users online: <br>');
	
		UserL.NewUserQ(client, tName);
		UserL.GetUserQ(client, res, tName);	
	});		

}else if ('/logout' == req.url) {
		
	var tName = newuser.GetName();
	UserL.LogoutQ(client, tName); //update set on to 'false'(0)
		
	res.writeHead(200, { 'Content-Type': 'text/html'});
	res.write('<b>Logged out<br><br>');
	res.end('<a href=/>Back to login</a>');	
};
}).listen(port);
console.log(port);
/*
io.sockets.on('connection', function (socket) {
    //our other events...
	
	socket.on('setPseudo', function (data) {
		socket.set('pseudo', data);
	});

});*/