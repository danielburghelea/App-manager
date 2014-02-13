var qs = require('querystring');

var mysql = require('mysql');

// Create a connection to MySql Server and Database

var connection = mysql.createConnection({
  host : '127.0.0.1',
  //port : 3306,
  database: 'users',
  user : 'root',
 password : ''
});

require('http').createServer(function (req, res) {
if ('/' == req.url) {

	//res.writeHeader(200); //mysql write
    
	
	connection.connect(function(err){  //connect mysql
        if(err != null) {
            res.end('Error connecting to mysql: ' + err+'\n');
        }

    });
	
	

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
	
	var post  = {
			nume: qs.parse(body).name,
			on: 1
	};
	
			res.writeHead(200, { 'Content-Type': 'text/html' });
			//var sql_body = '';
			
	var query_ins	=	connection.query('INSERT INTO users SET ?', post, function(err, result) {
							// Neat!
						});
						
					console.log('Welcome ' + qs.parse(body).name+'!');
			
	var query1	=	connection.query('SELECT * FROM users WHERE users.on = 1');
	
			query1.on('error', function(err) {
				throw err;
			});
			
			
			console.log('Users online: ');
			res.write('Users online: ');
			
			query1.on('result', function (rows) {
			//sql_body += rows;
			
			
	
			
				
				console.log(' ', rows.nume)
				var a = rows.toString();
				res.write(rows.nume.toString());
				//console.log(a);
					 //for (var i in rows) {
						//console.log(' ', rows[i].nume);
					//}
					
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




