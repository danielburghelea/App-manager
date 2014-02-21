exports.LoginForm = function(res){ // login form
	res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write([
		'<form method="POST" action="/auth">'
		, '<h1>Login area</h1>'
		, '<fieldset>'
		, '<label>Name</label>'
		, '<input type="text" name="name"><br>'
		, '<label>Password</label>'
		, '<input type="password" name="password">'
		, '<p><button>Submit</button></p>'
		, '</form>'
		].join(''));
	res.end();
};

exports.User = function (name) { // setter for user
  this.nume = name;
};

exports.User.prototype.GetName = function() { // getter for user
	return this.nume;
};

exports.GetUserQ = function(client, res, name){ //get all online users but himself
	client.query('SELECT * FROM users WHERE users.on_p = 1 AND name <> $1 ORDER BY name', [name])

		.on('row', function(row) {
			console.log(JSON.stringify(row));
			res.write(JSON.stringify(row));
			res.write('<br>');
		})
		.on('end', function() {
			res.write('****');
			res.end('<br><a href=/logout>Logout</a>'); //link to logout
		});
};

exports.NewUserQ = function (client, user){ // add new user
	client.query('INSERT INTO users(name, on_p) values($1, $2)', [user, 1]);
};

exports.LogoutQ = function(client, usern){ //set on to 0 when logout
	client.query('UPDATE users SET on_p = $1 WHERE name =$2', [0, usern]);
};