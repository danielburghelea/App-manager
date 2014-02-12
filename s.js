var http = require('http');

var mysql = require('mysql');

// Create a connection to MySql Server and Database

var connection = mysql.createConnection({
  host : '127.0.0.1',
  //port : 3306,
  database: 'users',
  user : 'root',
 password : ''
});

http.createServer(function(req, res){
    
    res.writeHeader(200);
    res.write('Connect to mySql\n');
	    // Connect to mySql 
  
  connection.connect(function(err){
        if(err != null) {
            res.end('Error connecting to mysql: ' + err+'\n');
        }

    });
	
    var query = connection.query('SELECT * FROM users WHERE users.on = 0', function(err, rows){
	       
        if(err != null) {
		//console.log('The solution is: ', rows[0].solution);

            res.end("Query error: " + err);

        } else {

            //console.log(query.sql);
			console.log(rows);
			//res.write(rows[1]);
			

            res.end("Success!");

        }

        // Close connection

        connection.end();

    });

}).listen(8080);