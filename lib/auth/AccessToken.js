var mongoose = require('mongoose');

var OAuthAccessTokensSchema = new mongoose.Schema({
	accessToken: { type: String },
	clientId:    { type: String },
	userId:      { type: String },
	expires:     { type: Date }
});

var OAuthAccessTokensModel = mongoose.model('OAuthAccessTokens', OAuthAccessTokensSchema);

module.exports = OAuthAccessTokensModel;