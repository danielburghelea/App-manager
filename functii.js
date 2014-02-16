var FillForm = function(res){
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
		
module.exports.FillForm = FillForm;

var GetUserQ =	function (connection, res, usern){
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

module.exports.GetUserQ = GetUserQ;

var Logout = function(connection, usern){
	connection.query('UPDATE users SET users.on = '+0+' WHERE users.nume = ' + usern);//, { on: 0, nume: usern});
};

module.exports.Logout = Logout;

var NewUser = function (connection, user){
				var InsertQuery	= connection.query('INSERT INTO users SET ?', user);
};

module.exports.NewUser = NewUser;

function User(name) {
  this.nume = name;
};

module.exports.User = User;

User.prototype.GetName = function() {
	return this.nume;
}

module.exports.GetName = User.prototype.GetName;
