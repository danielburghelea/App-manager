var app = require('http');
var fs = require('fs');
var pg = require('pg');
var qs = require('querystring');
var UserL = require('./js/UserLog');
var conString = "postgres://postgres:1Ciocolata@localhost:5432/users";
//var conString = "postgres://aypyxzurlxbjkr:SLghj-mrpPHGKg-1VMiEXhBOIz@ec2-54-204-45-196.compute-1.amazonaws.com:5432/d9n335rnhmdbf6";
var client = new pg.Client(conString);
var port = process.env.PORT || 5000;
//var io = require('socket.io').listen(app);
var dir = process.cwd();

client.connect();

app.createServer(function (req, res) {

	
if ('/' == req.url) { //if home, req url =127.0.0.1:8080/
		UserL.LoginForm(res, fs);
		console.log("new user");//	
console.log(dir);		

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
		
		fs.readFile('./html/getuser.html', function (err, html) { //page for user list
			if (err) {
				throw err; 
			}
			res.write(html);
	
			UserL.ExistingUsers(client, tName);
			UserL.GetUserQ(client, res, fs, tName);
		});
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

			fs.readFile('./html/getuser.html', function (err, html) {
		if (err) {
			throw err; 
		}
		res.write(html);
			
		UserL.NewUserQ(client, tName);
		UserL.GetUserQ(client, res, fs, tName);
		
});	});		

}else if ('/logout' == req.url) {
		
	var tName = newuser.GetName();
	UserL.LogoutQ(client, tName); //update set on to 'false'(0)
		
	res.writeHead(200, { 'Content-Type': 'text/html'});
	
	fs.readFile('./html/logout.html', function (err, html) {
		if (err) {
			throw err; 
		}
	res.write(html);
	res.end();
	});

};
}).listen(port);

console.log(port);

//console.log(port);
/*
io.sockets.on('connection', function (socket) {
    //our other events...
	
	socket.on('setPseudo', function (data) {
		socket.set('pseudo', data);
	});

});*/