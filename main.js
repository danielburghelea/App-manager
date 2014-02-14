var app = require('http');
var qs = require('querystring');
var	mysql = require('mysql');

var	config = require('./config');
var f = require('./functii');
	
var connection = mysql.createConnection(config);

app.createServer(function (req, res) {

	if ('/' == req.url) {
		f.FillForm(res);
		
	} else if ('/auth' == req.url && 'POST' == req.method ) {
	
			var body = '';				
			req.on('data', function (chunk) {
					body += chunk;
			});

		req.on('end', function (){
		
			if(qs.parse(body).password == 'aaaa'){

				var user = {
					nume: qs.parse(body).name,
					on: 1 
				};
						
		f.NewUser(connection,user);
								
			res.writeHead(200, { 'Content-Type': 'application/json'});
				res.end('Hello ' + qs.parse(body).name + '!');	
					res.write('Users online: ');
							
				console.log('Welcome ' + qs.parse(body).name+'!');
					console.log('Users online: ');
							
				f.GetUserQ(connection);	
				
	} else res.writeHead(404);
			res.end("Wrong password!");
});
}
}).listen(3000);
