exports.LoginForm = function(res, fs){ // login form
	res.writeHead(200, { 'Content-Type': 'text/html' });

	fs.readFile('./html/index.html', function (err, html) {
		if (err) {
			throw err; 
		}
	res.write(html);
			
			setTimeout(function() {
				res.end();
				console.log("end timeout");
			}, 5000);
	});
	//res.end();
};

exports.NewUserForm = function(res, fs){
	res.writeHead(200, { 'Content-Type': 'text/html' });

	fs.readFile('./html/newuser.html', function (err, html) {
		if (err) {
			throw err; 
		}
	res.write(html);
	res.end();
	});
};

exports.User = function (name) { // setter for user
  this.nume = name;
};

exports.User.prototype.GetName = function() { // getter for user
	return this.nume;
};

exports.GetUserQ = function(client, res, fs, name){ //get all online users but himself

	client.query('SELECT * FROM users WHERE users.on_p = 1 AND name <> $1 ORDER BY name', [name])

		.on('row', function(row) {
			console.log(JSON.stringify(row));
			res.write('<li>'+JSON.stringify(row.name)+'</li>');res.write('');
			res.write('<br>');
		})
		.on('end', function() {
			res.write(['<button type="submit" class="button-secondary pure-button">Logout</button>'
						, '</form>'
						].join(''));
			res.write('</ul></div>');
			res.write('</body>');
			res.end('</html>');
		});	
};

exports.NewUserQ = function (client, user){ // add new user
	client.query('INSERT INTO users(name, on_p) values($1, $2)', [user, 1]);
};

exports.ExistingUsers = function(client, usern){ //set on to 0 when logout
	client.query('UPDATE users SET on_p = $1 WHERE name =$2', [1, usern]);
};

exports.LogoutQ = function(client, usern){ //set on to 0 when logout
	client.query('UPDATE users SET on_p = $1 WHERE name =$2', [0, usern]);
};