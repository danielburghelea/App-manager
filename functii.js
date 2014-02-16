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
				console.log(rows);
				res.write(JSON.stringify(rows.nume));
				res.write('<br>');
		});
};

module.exports.GetUserQ = GetUserQ;


var Logout = function(connectionn, usern){
	connection.query('UPDATE users SET on = :on WHERE nume = :nume',
                     {on: 0, nume: usern});
};

module.exports.Logout = Logout;


var NewUser = function (connection, user){
				var InsertQuery	= connection.query('INSERT INTO users SET ?', user);
};

module.exports.NewUser = NewUser;


var User = function (name) {
  this.nume = name;
};

module.exports.User = User;


var GetName = function() {
	return this.nume;
}

module.exports.GetName = GetName;
