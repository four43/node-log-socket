const bodyParser = require('body-parser'),
	app = require('express')(),
	oAuthServer = require('node-oauth2-server'),
	http = require('http').Server(app),
	path = require('path'),
	io = require('socket.io')(http),
	redisSocketIo = require('socket.io-redis'),
	sm = require('./lib/serviceManager');

sm.get('mongoDb');
io.adapter(redisSocketIo(sm.get('config').redis));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

setupOauth2(app);

app.get('/',
	app.oauth.authorise(),
	function (req, res) {
		res.sendFile(path.join(__dirname, 'public', 'index.html'));
	});

require('socketio-auth')(io.of('/log/socket'), {
	authenticate: function (socket, data, callback) {
		console.log('Auth request...');
		const clientKey = data.clientKey;

		return callback(null, clientKey === 'abc123');
	},
	postAuthenticate(socket, data) {
		console.log('[socket] Authed Connection');

		socket.on('chat message', function (msg) {
			console.log('[socket] message: ' + JSON.stringify(msg));
		});

		socket.on('log', function (msg) {
			console.log('[socket][log]: ' + JSON.stringify(msg));
			socket.broadcast.emit('log', msg);
		});

		socket.on('disconnect', function () {
			console.log('[socket] Disconnected');
		});
	}
});

app.use(app.oauth.errorHandler());

http.listen(process.argv[2], function () {
	console.log(`listening on *:${process.argv[2]}`);
});

function setupOauth2(app) {
	app.oauth = oAuthServer({
		model: sm.get('authRepo'),
		grants: ['password'],
		debug: true
	});

	app.all('/oauth/token', app.oauth.grant());
}