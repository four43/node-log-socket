var debug = require('debug')('User'),
	mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	_id:       { type: String },
	password:  { type: String },
	oAuth:     {
		accessToken: { type: String },
		expires:     { type: Date }
	},
	firstName: { type: String },
	lastName:  { type: String },
	email:     { type: String, default: '' }
});

var User = mongoose.model('users', userSchema);

User.findByOauthMiddleware = function (req, res, next) {
	if (req.oauth && req.oauth.bearerToken && req.oauth.bearerToken.userId) {
		User.findOne({ _id: req.oauth.bearerToken.userId }, { password: 0 }, function (err, user) {
			debug('Middleware: Found User via Token: ' + req.oauth.bearerToken.userId);
			if (err) {
				console.error(err.stack);
			}
			req.user = user;
			next();
		});
	}
	else {
		next();
	}
};

User.findByToken = function (token, callback) {
	User.findOne({ 'oAuth.accessToken': token }, { password: 0 }, function (err, user) {
		if (err) {
			console.error(err.stack);
			callback(err);
		}
		callback(null, user);
	});
};

module.exports = User;
