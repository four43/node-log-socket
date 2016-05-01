const Guid = require('guid'),
	socket = require('socket.io-client')('http://localhost:3000/log/socket');

socket
	.on('connect', () => {
		console.log("Connected, authenticating...");

		socket.emit('authentication', {clientKey: 'abc123'});

		socket.on('authenticated', function() {
			console.log("Autenticated");
			sendLog();
		});

		socket.on('unauthorized', function(err){
			console.error("There was an error with the authentication:", err.message);
		});
	})
	.on('connect_error', (err) => {
		console.error(err);
	});

function sendLog() {
	console.log("Emitting log");
	socket.emit('log', {
		source: {
			appId: "maps",
			service: "tile-server",
			serviceGroup: "alerts-and-obs",
			serverId: "alerts-and-obs-v1111-4wbd9",
			meta: {
				version: "v1111"
			}
		},
		type: "HTTP",
		details: {
			requestId: Guid.create(),
			method: 'GET',
			requestUrl: "http://localhost/hello/world?foo=bar",
			startTime: Date.now(),
			duration: Math.random() * 0.5,
			responseCode: 200,
			contentLength: Math.round(100 + Math.random() * 1000),
			additionalHeaders: {},
			meta: {}
		}
	});
	setTimeout(() => {
		sendLog();
	}, 1000 + Math.random() * 10000);
}