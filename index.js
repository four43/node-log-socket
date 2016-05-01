const bodyParser = require('body-parser'),
	app = require('express')(),
	oAuthServer = require('node-oauth2-server'),
	http = require('http').Server(app),
	path = require('path'),
	io = require('socket.io')(http),
	MongoAuthRepo = require('./lib/auth/MongoAuthRepo'),
	redisSocketIo = require('socket.io-redis'),
	sm = require('./lib/serviceManager');


// Init distributed sockets
io.adapter(redisSocketIo(sm.get('config').redis));

// Init MongoDb
sm.get('mongoDb')
	.then((db) => {
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(bodyParser.json());

		setupOauth2(app, db);

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
				console.log('[socket][connect] Authed Connection');

				socket.on('log', function (msg) {
					console.log('[socket][log]: ' + JSON.stringify(msg));
					socket.broadcast.emit('log', msg);
				});

				socket.on('disconnect', function () {
					console.log('[socket][connect] Disconnected');
				});
			}
		});

		app.use(app.oauth.errorHandler());

		http.listen(process.argv[2], function () {
			console.log(`listening on *:${process.argv[2]}`);
		});
	});

/**
 *
 * @param app
 * @param {Db} db
 */
function setupOauth2(app, db) {

	app.oauth = oAuthServer({
		model: new MongoAuthRepo({
			mongoDb: db
		}),
		grants: ['password'],
		debug: true
	});

	app.all('/oauth/token', app.oauth.grant());
}