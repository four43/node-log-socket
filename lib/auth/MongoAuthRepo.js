const bcrypt = require('bcrypt'),
	debug = require('debug')('oauth2-storage');

const AccessToken = require('./AccessToken'),
	Client = require('./Client'),
	RefreshToken = require('./RefreshToken'),
	User = require('../model/User');
//
// oauth2-server callbacks
//
/**
 *
 * @param {Db} mongoDb
 * @returns {{getAccessToken: getAccessToken, getClient: getClient, grantTypeAllowed: grantTypeAllowed, saveAccessToken: saveAccessToken, getUser: getUser, saveRefreshToken: saveRefreshToken, getRefreshToken: getRefreshToken}}
 */
module.exports = function (options) {

	const mongoDb = options.mongoDb;
	const accessTokenCollectionName = options.accessTokenCollectionName || 'oauth_access_tokens';
	const clientCollectionName = options.clientCollectionName || 'oauth_clients';
	const refreshTokenCollectionName = options.refreshTokenCollectionName || 'oauth_refresh_tokens';
	const usersCollectionName = options.usersCollectionName || 'users';

	return {
		getAccessToken: function (bearerToken, callback) {
			debug('getAccessToken (bearerToken: ' + bearerToken + ')');
			mongoDb.collection(accessTokenCollectionName, (err, collection) => {
				collection.find({accessToken: bearerToken}).limit(1).next((err, doc) => {
					callback(err, new AccessToken(doc));
				});
			});
		},

		getClient: function (clientId, clientSecret, callback) {
			debug('getClient (clientId: ' + clientId + ', clientSecret: ' + clientSecret + ')');

			mongoDb.collection(clientCollectionName, (err, collection) => {
				collection.find({_id: clientId}).limit(1).next((err, doc) => {
					if (err) return callback(err);
					const client = new Client(doc);
					client.verifySecret(clientSecret, (err, verified) => {
						if (err) return callback(err);
						if (verified) {
							return callback(null, client);
						}
						else {
							return callback(null, null);
						}
					});
				});
			});
		},

		// This will very much depend on your setup, I wouldn't advise doing anything exactly like this but
		// it gives an example of how to use the method to restrict certain grant types
		grantTypeAllowed: function (clientId, grantType, callback) {
			debug('grantTypeAllowed (clientId: ' + clientId + ', grantType: ' + grantType + ')');
			mongoDb.collection(clientCollectionName, (err, collection) => {
				collection.find({_id: clientId}).limit(1).next((err, doc) => {
					if (err) return callback(err);
					const client = new Client(doc);
					return callback(null, client.hasGrantType(grantType));
				});
			});
		},

		saveAccessToken: function (token, clientId, expires, userId, callback) {
			debug('saveAccessToken (token: ' + token + ', clientId: ' + clientId + ', userId: ' + userId + ', expires: ' + expires + ')');

			const accessToken = new AccessToken({
				accessToken: token,
				clientId: clientId,
				userId: userId,
				expires: expires
			});

			mongoDb.collection(accessTokenCollectionName, (err, collection) => {
				collection.insertOne(accessToken, (err, result) => {
					return callback(err, result);
				});
			});
		},

		/*
		 * Required to support password grant type
		 */
		getUser: function (username, password, callback) {
			debug('getUser (username: ' + username + ', password: ' + password + ')');

			mongoDb.collection(usersCollectionName, (err, collection) => {
				collection.find({_id: username}).limit(1).next((err, doc) => {
					if (err) return callback(err);
					const user = new User(doc);
					user.verifyPassword(password, (err, verified) => {
						if (err) return callback(err);
						if (verified) {
							return callback(null, user);
						}
						else {
							return callback(null, null);
						}
					});
				});
			});
		},

		/*
		 * Required to support refreshToken grant type
		 */
		saveRefreshToken: function (token, clientId, expires, userId, callback) {
			debug('saveRefreshToken (token: ' + token + ', clientId: ' + clientId + ', userId: ' + userId + ', expires: ' + expires + ')');

			const refreshToken = new OAuthRefreshTokensModel({
				refreshToken: token,
				clientId: clientId,
				userId: userId,
				expires: expires
			});

			mongoDb.collection(refreshTokenCollectionName, (err, collection) => {
				collection.insertOne(refreshToken, (err, result) => {
					return callback(err, result);
				})
			});
		},

		getRefreshToken: function (refreshToken, callback) {
			debug('getRefreshToken (refreshToken: ' + refreshToken + ')');

			mongoDb.collection(refreshTokenCollectionName, (err, collection) => {
				collection.find({accessToken: bearerToken}).limit(1).next((err, doc) => {
					callback(err, new AccessToken(doc));
				});
			});
		}
	};
};