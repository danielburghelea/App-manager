exports.FillForm = function(res){ // login form
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.write('Connect to mySql\n');
				res.end([
				'<form method="POST" action="/auth">'
				, '<h1>form</h1>'
				, '<fieldset>'
				, '<label>Name</label>'
				, '<input type="text" name="name"><br>'
				, '<label>Password</label>'
				, '<input type="password" name="password">'
				, '<p><button>Submit</button></p>'
				, '</form>'
				].join(''));				
};
		
exports.GetUserQ =	function (connection, res, usern){ //get online (on = 1) user from DB
		var GetUserQ = connection.query('SELECT * FROM users WHERE users.on = 1 ORDER BY nume');
			
		GetUserQ.on('result', function (rows) {
		connection.pause();
			res.write(JSON.stringify(rows.nume));
			console.log(rows);
			res.write('<br>');
		connection.resume();
		}).on('end', function (){
			res.end('<a href=/logout>Logout</a>');
		});
};

exports.Logout = function(connection, usern){ //set on to 0 when logout
	connection.query("UPDATE users SET users.on = "+0+" WHERE users.nume ='" +usern+"'");
};

exports.NewUser = function (connection, user){ // add new user
				var InsertQuery	= connection.query('INSERT INTO users SET ?', user);
};

exports.User = function (name) { // setter for user
  this.nume = name;
};

exports.User.prototype.GetName = function() { // getter for user
	return this.nume;
};
