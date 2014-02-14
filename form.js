var qs = require('querystring')
	, mysql = require('mysql');

// mysql connection

var connection = mysql.createConnection({
				host : '127.0.0.1',
				database: 'users',
				user : 'root',
				password : ''
				});

require('http').createServer(function (req, res) {

if ('/' == req.url) {


		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write('Connect to mySql\n');
		res.end([
		'<form method="POST" action="/url">'
		, '<h1>My form</h1>'
		, '<fieldset>'
		, '<label>Name</label>'
		, '<input type="text" name="name"><br>'
		, '<label>Password</label>'
		, '<input type="password" name="password">'
		, '<p><button>Submit</button></p>'
		, '</form>'
		].join(''));


		} else if ('/url' == req.url && 'POST' == req.method ) {

			var body = '';
			req.on('data', function (chunk) {
			body += chunk;
			});


	req.on('end', function () {
		if( qs.parse(body).password == 'aaaa'){

			var post = { nume: qs.parse(body).name,
						on: 1 };

			res.writeHead(200, { 'Content-Type': 'application/json'
								, 'Content-type': 'text/html'
							});


			var query_ins	=	connection.query('INSERT INTO users SET ?', post);

				console.log('Welcome ' + qs.parse(body).name+'!');

			var query1	=	connection.query('SELECT * FROM users WHERE users.on = 1');

				query1.on('error', function(err) {
				throw err;
				});


			console.log('Users online: ');
			res.write('Users online: ');

			query1.on('result', function (rows) {

			//console.log(' ', rows.nume);
			console.log(JSON.stringify(rows));
			res.write(JSON.stringify(rows));

			var a = rows.toString();
			res.write(rows.toString());
			//incerc sa scriu rows in browser, dar nu afiseaza nimic

			});

			res.end('<p>Hello <b>' + qs.parse(body).name + '</b></p>');
		} else res.writeHead(404);
		
			res.end("Wrong password!");
	});
	
} else {
		res.writeHead(404);
		res.end("Not Found");
	}

}).listen(3000);


