const bodyParser = require('body-parser'),
	app = require('express')(),
	oAuthServer = require('node-oauth2-server'),
	http = require('http').Server(app),
	path = require('path'),
	io = require('socket.io')(http);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mongoose = require('mongoose');

var uristring = 'mongodb://localhost/log_monster';

// Makes connection asynchronously. Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
	if (err) {
		console.log ('ERROR connecting to: ' + uristring + '. ' + err);
	} else {
		console.log ('Succeeded connected to: ' + uristring);
	}
});

app.oauth = oAuthServer({
	model: require('./lib/auth/MongoAuthRepo'),
	grants: ['password'],
	debug: true
});

app.all('/oauth/token', app.oauth.grant());

app.get('/',
	function (req, res) {
		res.sendFile(path.join(__dirname, 'public', 'index.html'));
	});


io
	.of('/log/other')
	.on('connection', function (socket) {
		console.log('[other] a user connected');
	});

io
	.of('/log/socket')
	.on('connection', function (socket) {
		console.log('[socket] a user connected');

		socket.on('chat message', function (msg) {
			console.log('[socket] message: ' + JSON.stringify(msg));
		});

		socket.on('log', function (msg) {
			console.log('[socket] log: ' + JSON.stringify(msg));
		});

		socket.on('disconnect', function () {
			console.log('[socket] a user disconnected');
		});
	});

app.use(app.oauth.errorHandler());

http.listen(3000, function () {
	console.log('listening on *:3000');
});