'use strict';
const bcrypt = require('bcrypt'),
	_ = require('lodash');

class Client {

	/**
	 * An OAuth Client, an App that uses the system.
	 *
	 * @param {{}} options
	 * @param {string} options.id
	 * @param {string} options.clientSecret
	 * @param {string[]} options.grantTypes
	 * @param {string} options.redirectUri
	 */
	constructor(options) {
		this.id = options.id;
		this.clientSecret = options.clientSecret;
		this.grantTypes = options.grantTypes;
		this.redirectUri = options.redirectUri;
	}

	/**
	 *
	 * @param {string} secret
	 * @param {function} callback
	 */
	verifySecret(secret, callback) {
		bcrypt.compare(secret, this.clientSecret, callback);
	}

	/**
	 *
	 * @param {string} grantType
	 * @returns {boolean}
	 */
	hasGrantType(grantType) {
		return this.grantTypes.indexOf(grantType) !== -1;
	}
}

module.exports = Client;