var database 	= require('./Database');
var crypto 		= require('crypto');

module.exports = function(io, dbConnection, app) {

    io.sockets.on('connection', function (socket) {
				
		socket.on('join room', function (room) {

			console.log('room ' + room + ' saved');
			socket.join(room);
		});
		
		socket.on('joinRoom3', function (room) {

			room3 = decrypt(room);
			console.log('room ' + room3 + ' saved');
			socket.join(room3);
		});
		
		socket.on('joinRoom2', function (room, DH1) {
		
			var server = crypto.getDiffieHellman('modp5');
			
			server.generateKeys();
			var publicServer = server.getPublicKey('hex');
			//console.log('server public: ' + publicServer);
			
			var serverSecret = server.computeSecret(DH1, 'hex', 'hex');
			console.log(" ======================= " );
			console.log("SECRET SERVER: " + serverSecret);
			console.log(" =================== " );
			
			room2 = decrypt(room);
			
			console.log('room ' + room2 + ' saved');
			socket.join(room2);
			
			io.sockets.in(room2).emit('DH2', publicServer, serverSecret);
		});

		
		socket.on('clientData', function (data) {
		
			console.log(data.data);
			console.log(data.data.Email);
			
			decryptedEmail = decrypt(data.data.Email);
			
			data.data.Email = decryptedEmail;
			
			database.CheckUserAppQ(dbConnection, data.data.Host, decryptedEmail, function(err, result) {
				console.log("routes: "+result);
				if(result == 'available')
					io.sockets.in(decryptedEmail).emit('confirmation1', data.data);
			});
		});
			
		socket.on('confirmation2', function (data, ddata) {
		
			console.log(ddata);
			console.log(encrypt(ddata));
			eData = encrypt(ddata);
			io.sockets.in(data.Email).emit('confirmation3', eData)
			console.log(data.Email);
			if(ddata == 'granted')
				database.AddAppSpecQ(dbConnection, data.Country, data.UA, data.OS, data.City, data.From, data.Email, data.Host)//, callback)
		});
	});
};

function decrypt(data) {

	var key = 'buburuze si meduze';
	var decipher = crypto.createDecipher('aes-256-cbc', key);
				
	var decryptedData = decipher.update(data, 'base64', 'utf8');
	decryptedData += decipher.final('utf8');

return decryptedData;
}


function encrypt(data) {

	var key = 'buburuze si meduze';
	var cipher = crypto.createCipher('aes-256-cbc', key);

	var encryptedData = cipher.update(data, 'utf8', 'base64');
	encryptedData += cipher.final('base64');
 
return encryptedData;
}