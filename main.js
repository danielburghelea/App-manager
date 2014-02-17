var app = require('http');
var qs = require('querystring');
var mysql = require('mysql');
var config = require('./config');
var UserL = require('./UserLog');	
var connection = mysql.createConnection(config);

app.createServer(function (req, res) {

	if ('/' == req.url) { //if home, req url =127.0.0.1:8080/
		UserL.FillForm(res);
		
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
			
		var user = { nume: newuser.nume, on: 1 }; // data to insert in db
			UserL.NewUser(connection, user); //actual insert
								
			res.writeHead(200, { 'Content-Type': 'text/html'});
			res.write('Hello <b>' + newuser.nume + '!<b><br><br>');	
			res.write('Users online: <br><br>');

			console.log('Welcome ' + newuser.nume +'!');
			console.log('Users online: ');
						
			var usern = newuser.nume;
				UserL.GetUserQ(connection, res, usern); // get online users from db
			} else {
				res.writeHead(404);
				res.end("Wrong password!");
				};				
		});		
	} else if ('/logout' == req.url) {	
		UserL.Logout(connection, newuser.GetName()); //update set on to 'false'(0)
		res.writeHead(200, { 'Content-Type': 'text/html'});
		res.write('<b>Logged out<br><br>');
		res.end('<a href=/>Back to login</a>');	
	} 	
}).listen(3000);
