// app/routes.js
var crypto = require('crypto');
var fs = require('fs');
var database = require('./Database');
module.exports = function(app, dbConnection) {


// =====================================
app.get('/', function(req, res) {
	res.sendfile('public/index.html'); 
});

app.post('/auth', function(req, res) {
	
	email = req.body.email;
	req.session.email = email;
	password = req.body.password;
	
	key = 'most random key';
	cipher = crypto.createCipher('aes-256-cbc', key);
 
	cipher.update(password, 'utf8', 'base64');
	var encryptedPassword = cipher.final('base64')
	
	console.log('email sssss :', req.session.email);
	console.log('email :', email);
	console.log('passwd :', encryptedPassword);
	database.AuthUserQ(dbConnection, req.session.email, encryptedPassword, function(err, result) {
		console.log("routes: "+result);
		if(result == 'available' && password.length > 0){
		
			database.UpdateUserQ(dbConnection, req.session.email);
			res.redirect('/profile');	
		}else{
			res.redirect('/');
		}
  });
});

//=====================================

app.get('/new', function(req, res) {
	res.sendfile('public/newuser.html');
});

app.post('/newUser', function(req, res) {

	email = req.body.email;
	req.session.email = req.body.email;
	
	password = req.body.password;

	key = 'most random key';
	cipher = crypto.createCipher('aes-256-cbc', key);
	cipher.update(password, 'utf8', 'base64');
	var encryptedPassword = cipher.final('base64');
	
	console.log('email :', req.body.email);
	console.log('passwd :', encryptedPassword);
	
	database.CheckUserQ(dbConnection, req.body.email, function(err, result) {
		console.log("routes: "+result);
		if(result == 'available' && password.length > 0){
			database.NewUserQ(dbConnection, req.body.email, encryptedPassword);
			res.redirect('/profile');
		}else{
			res.sendfile('public/newuser.html');
		}
  });
});

//========================================
//page for user list
app.get('/profile', isLoggedIn, function(req, res) {
	fs.readFile('public/getuser.html', function (err, html) {
				if (err) {
					throw err; 
				}
				res.write(html);
				database.GetUserAppsQ(dbConnection, res, req.session.email);
			});
			console.log('email sssss :', req.session.email);
			console.log('????????????????????	 :', req.session.email);
});

//========================================
app.get('/editApp', function(req, res) {
	res.sendfile('public/editApp.html');
});

app.post('/addApp', isLoggedIn, function(req, res) {
	//res.render('getuser.html'); // load the index.ejs file
	appName = req.body.appName;
		
	console.log('app name :', appName);
	console.log('app name :', req.session.email);
	database.CheckAppQ(dbConnection, appName, req.session.email, function(err, result) {
		
		console.log("routes: "+result);
		if(result == 'available' && appName.length > 0){
			console.log(1);
			database.AddAppQ(dbConnection, appName, req.session.email, function(err, result) {
				res.redirect('/profile');
			});
		}else{
			res.sendfile('public/editApp.html');
		}
  });
});

app.post('/removeApp', function(req, res) {
	console.log(req.body.appName);
	database.RemoveAppQ(dbConnection, req.body.appName, req.session.email, function(err, result) {
				res.redirect('/profile');
	})
});
// =====================================


// =====================================
app.get('/logout', function(req, res) {

	req.session.destroy();
	res.redirect('/');
});

};

// route middleware to make sure
function isLoggedIn(req, res, next) {

// if user is authenticated in the session, carry on
	if (req.session.email)
		return next();

// if they aren't redirect them to the home page
	res.redirect('/');
}
//=====================