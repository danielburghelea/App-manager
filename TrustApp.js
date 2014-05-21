var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var pg = require('pg');
var qs = require('querystring');
var Server = require('./js/TrustServer');
var conString = "postgres://user:password@host:port/database";

var db = new pg.Client(conString);
var port = process.env.PORT || 5000;
var dir = process.cwd();
var connectionsArray = [];

db.connect();
app.listen(port);


function handler(req, res) {

if ('/' == req.url) { //if home, req url =127.0.0.1:8080/
		Server.LoginForm(res, fs);
		console.log("new user");//	
		
} else if ('/new' == req.url){
	Server.NewUserForm(res, fs);
	
} else if ('/auth' == req.url) { //req url =127.0.0.1:8080/auth

	var body = '';	var tName;
	
	req.on('data', function (chunk) {	body += chunk;	});
	
	req.on('end', function (){

		var passwd = qs.parse(body).password; //break the data into pieces (password/ user..) ^
		if(passwd == 'aaaa'){
			var name = qs.parse(body).name; // user from recieved data ^^
			newuser = new Server.User(name);
			tName = newuser.GetName();
		
		}		Server.GetUsersHTML(res, fs, db, tName);
	});
		
} else if ('/newauth' == req.url) { //req url =127.0.0.1:8080/auth

	var body = '';	var tName;
	
	req.on('data', function (chunk) {	body += chunk;	});

	req.on('end', function (){

		var passwd = qs.parse(body).password; //break the data into pieces (password/ user..) ^
		if(passwd == 'aaaa'){
			var name = qs.parse(body).name; // user from recieved data ^^
			newuser = new Server.User(name);
			tName = newuser.GetName();
		
		}	Server.GetUsersHTML(res, fs, db, tName);		
	});		

} else if ('/logout' == req.url) {
		
	var tName = newuser.GetName();
	Server.LogoutQ(db, tName); //update set on to 'false'(0)
	Server.LogoutHTML(res, fs);
}

}
console.log(port);

// creating a new websocket to keep the content updated without any AJAX request
io.sockets.on('connection', function(socket) {

  console.log('Number of connections:' + connectionsArray.length);
  // starting the loop only if at least there is one user connected
  if (!connectionsArray.length) {
	data = '';
    updateSockets(data);  
     pollingTimer = setTimeout(updateSockets, 3000);

        updateSockets(data);
	}

  socket.on('disconnect', function() {
    var socketIndex = connectionsArray.indexOf(socket);
    console.log('socket = ' + socketIndex + ' disconnected');
    if (socketIndex >= 0) {
      connectionsArray.splice(socketIndex, 1);
    }
  });

  console.log('A new socket is connected!');
  connectionsArray.push(socket);

});

var updateSockets = function(data) {
  // adding the time of the last update
	data = new Date();
  // sending new data to all the sockets connected
  connectionsArray.forEach(function(tmpSocket) {
    tmpSocket.volatile.emit('notification', data);
	console.log(data);
  });
};