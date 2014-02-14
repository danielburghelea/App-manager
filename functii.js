var FillForm = function(res){
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.write('Connect to mySql\n');
				res.end([
				'<form method="POST" action="/auth">'
				, '<h1>My form</h1>'
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


var GetUserQ =	function (connection){
					var GetUserQ = connection.query('SELECT * FROM users WHERE users.on = 1');
			
						GetUserQ.on('result', function (rows) {
							console.log(rows);
						});
};

module.exports.GetUserQ = GetUserQ;


var NewUser = function (connection, user){
				var InsertQuery	= connection.query('INSERT INTO users SET ?', user);
};

module.exports.NewUser = NewUser;