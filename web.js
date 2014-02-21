var app = require('http');
var pg = require('pg');
var qs = require('querystring');
var UserL = require('./UserLog');

var client = new pg.Client(conString);
var port = process.env.PORT || 5000;

var conString = "postgres://postgres:1Ciocolata@localhost:5432/users";

client.connect();

app.createServer(function (req, res) {

	//res.writeHead(200, { 'Content-Type': 'text/html'});
	//res.write('Hello <b>!<b><br><br>');
	
if ('/' == req.url) { //if home, req url =127.0.0.1:8080/
		UserL.LoginForm(res);
		
		
} else if ('/auth' == req.url) { //req url =127.0.0.1:8080/auth

		var body = '';	
		
		req.on('data', function (chunk) { //recieve data (user and password)
			body += chunk;
		});

		req.on('data', function (){

			var passwd = qs.parse(body).password; //break the data into pieces (password/ user..) ^
			if(passwd == 'aaaa'){

				var name = qs.parse(body).name; // user from recieved data ^^
				newuser = new UserL.User(name);
				var tName = newuser.GetName();
				
				res.writeHead(200, { 'Content-Type': 'text/html'});
				res.write('Hello <b>' + tName + '!<b><br><br>');	
				res.write('Users online: <br>');
				
				UserL.NewUserQ(client, tName); //insert in db
				UserL.GetUserQ(client, res, tName); // view from db 'select'
				
			}
		});
} else if ('/logout' == req.url) {
		var tName = newuser.GetName();
		UserL.LogoutQ(client, tName); //update set on to 'false'(0)
		
		res.writeHead(200, { 'Content-Type': 'text/html'});
		res.write('<b>Logged out<br><br>');
		res.end('<a href=/>Back to login</a>');	
};
}).listen(port);