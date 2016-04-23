/**
 * Copyright 2013-present NightWorld.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
	debug = require('debug')('oauth2-storage'),
	Schema = mongoose.Schema,
	model = module.exports;

//
// Schemas definitions
//


var OAuthRefreshTokensSchema = new Schema({
	refreshToken: { type: String },
	clientId:     { type: String },
	userId:       { type: String },
	expires:      { type: Date }
});

var OAuthClientsSchema = new Schema({
	_id:          { type: String },
	clientSecret: { type: String },
	grantTypes:   { type: Array },
	redirectUri:  { type: String }
});

var User = require('../model/User'),
	AccessToken = require('./AccessToken'),
	OAuthRefreshTokensModel = mongoose.model('OAuthRefreshTokens', OAuthRefreshTokensSchema),
	OAuthClientsModel = mongoose.model('OAuthClients', OAuthClientsSchema);

//
// oauth2-server callbacks
//
model.getAccessToken = function (bearerToken, callback) {
	debug('getAccessToken (bearerToken: ' + bearerToken + ')');

	AccessToken.findOne({ accessToken: bearerToken }, callback);
};

model.getClient = function (clientId, clientSecret, callback) {
	debug('getClient (clientId: ' + clientId + ', clientSecret: ' + clientSecret + ')');

	OAuthClientsModel.findOne({ _id: clientId }, function (err, client) {
		if (err) {
			console.error(err.stack);
			callback(err);
			return;
		}
		if (client && bcrypt.compareSync(clientSecret, client.clientSecret)) {
			callback(err, client);
			return;
		}
		callback(err, []);
	});
};

// This will very much depend on your setup, I wouldn't advise doing anything exactly like this but
// it gives an example of how to use the method to restrict certain grant types
model.grantTypeAllowed = function (clientId, grantType, callback) {
	debug('grantTypeAllowed (clientId: ' + clientId + ', grantType: ' + grantType + ')');

	OAuthClientsModel.findOne({ _id: clientId }, function (err, client) {
		if (err) {
			console.error(err.stack);
			callback(err, false);
			return;
		}
		if (client) {
			var found = (client.grantTypes.indexOf('password') !== -1);
			callback(err, found);
			return;
		}
		callback(err, false);
	});
};

model.saveAccessToken = function (token, clientId, expires, userId, callback) {
	debug('saveAccessToken (token: ' + token + ', clientId: ' + clientId + ', userId: ' + userId + ', expires: ' + expires + ')');

	var accessToken = new AccessToken({
		accessToken: token,
		clientId:    clientId,
		userId:      userId,
		expires:     expires
	});

	accessToken.save(function(err, result) {
		if(err) {
			callback(err);
			return;
		}
		return User.findByIdAndUpdate(userId, {oAuth: { accessToken: token, expires: expires}}, callback);
	});
};

/*
 * Required to support password grant type
 */
model.getUser = function (username, password, callback) {
	debug('getUser (username: ' + username + ', password: ' + password + ')');

	User.findOne({ _id: username }, function (err, user) {
		if (err) {
			callback(err);
			return;
		}
		if(user) {
			console.log("Have user verifying password ", user);
			if (bcrypt.compareSync(password, user.password)) {
				console.log("- Password verified");
				callback(null, user._id);
				return;
			}
		}
		callback(null, null);
	});
};

/*
 * Required to support refreshToken grant type
 */
model.saveRefreshToken = function (token, clientId, expires, userId, callback) {
	debug('saveRefreshToken (token: ' + token + ', clientId: ' + clientId + ', userId: ' + userId + ', expires: ' + expires + ')');

	var refreshToken = new OAuthRefreshTokensModel({
		refreshToken: token,
		clientId:     clientId,
		userId:       userId,
		expires:      expires
	});

	refreshToken.save(callback);
};

model.getRefreshToken = function (refreshToken, callback) {
	debug('getRefreshToken (refreshToken: ' + refreshToken + ')');

	OAuthRefreshTokensModel.findOne({ refreshToken: refreshToken }, callback);
};