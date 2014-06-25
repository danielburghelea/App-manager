exports.GetUserAppsQ = function(client, res, email){ //get all apps users but himself
	
	res.write('</div>' +'<h2><div class="page-header text-center">Logged in as:' + 
	'<div id="email">' + email + '</div></div></h2>');
	
	client.query('SELECT * FROM apps WHERE owner = $1 ORDER BY name', [email]) // name  = owner name

		.on('row', function(row) {
			console.log(JSON.stringify(row));
			res.write('<div class="col-sm-6 col-sm-offset-3"><div class="well">' + 
				row.name + '<hr><div id='+row.name+'></div>')
			if(row.country){
				res.write('<b>Last logged in near: </b>' + row.city + ', ' + row.country + '<br>');
				res.write('<b>From: </b>' + row.ua + '<br>');
				res.write('<b>O.S.: </b>' + row.platform + '<br>');
				res.write('<b>Client version: </b>' + row.vers + '<br>');
			}
			else
				res.write('Never loogen in.');
			res.write('<hr>' +	
				'<form method="POST" action="/removeApp">'+
					'<input type="hidden" name="appName" value="' + row.name + '">'+
					'<button type="submit" class="btn btn-warning"> Remove</button>'+
				'</form></div></div>'
			);
		})
		.on('end', function() {
			res.write('</body>');
			res.end('</html>');
		});	
};

// add new user
exports.NewUserQ = function (client, email, password){ 
	client.query('INSERT INTO users(email, password, logged) values($1, $2, $3)', [email, password, 1]);
};

// update logged
exports.UpdateUserQ = function (client, email){ 
	client.query('UPDATE users SET logged = $1 WHERE email =$2', [1, email]);
};

// check if email available for signup
exports.CheckUserQ = function (client, email, callback){ 

	client.query('SELECT * FROM users WHERE email = $1', [email], function(err, result) {
    console.log("Row count: %d",result.rows.length);
	
	if(result.rows.length == 0)
		 callback(null, 'available');
	else callback(null, 'not available');
	})
};

// check if email in database for login
exports.AuthUserQ = function (client, email, password, callback){ 

	client.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password], function(err, result) {
    console.log("Row count: %d",result.rows.length);
	
	if(result.rows.length == 0)
		 callback(null, 'not available');
	else callback(null, 'available');
	})
};

// check if app is not registered
exports.CheckAppQ = function (client, name, email, callback){ 

	client.query('SELECT * FROM apps WHERE owner = $1 AND name = $2', [email, name], function(err, result) {
		console.log("Row count: %d",result.rows.length);
		
		if(result.rows.length == 0)
			 callback(null, 'available');
		else callback(null, 'not available');
	})
};


// add app to my list
exports.AddAppQ = function (client, name, email, callback){ 

	client.query('INSERT INTO apps(name, logged, owner) values($1, $2, $3)', [name, 1, email], function(err, result) {
    console.log("Row count: %d",result.rows.length);
	
	if(result.rows.length == 0)
		 callback(null, 'error');
	else callback(null, 'done');
	})
};


// remove app to my list
exports.RemoveAppQ = function (client, appName, email, callback){ 

	client.query('DELETE FROM apps WHERE name = $1 AND owner = $2', [appName, email], function(err, result) {
    console.log("Row count: %d",result.rows.length);
	
	if(result.rows.length == 0)
		 callback(null, 'error');
	else callback(null, 'done');
	})
};

//update information for app NOT DONE
exports.UpdateAppQ = function(client, usern){ //set on to 0 when logout
	client.query('UPDATE users SET logged = $1 WHERE user_name =$2', [1, usern]);
};


// check if app is not registered
exports.CheckUserAppQ = function (client, name, email, callback){ 

	client.query('SELECT * FROM apps WHERE owner = $1 AND name = $2', [email, name], function(err, result) {
		console.log("Row count: %d",result.rows.length);
		
		if(result.rows.length == 0)
			 callback(null, 'not available');
		else callback(null, 'available');
	})
};


// add app to my list
exports.AddAppSpecQ = function (client, country, ua, platform, city, appVersion, owner, name){ //, callbac
	
	console.log(country, ua, platform, city, appVersion, owner, name)
	
	client.query('UPDATE apps SET country = $1, ua = $2, platform = $3, city = $4, vers = $5 , logged=1 WHERE owner =$6 and name = $7',
	[country, ua, platform, city, appVersion, owner, name])//, function(err, result) {
	
};