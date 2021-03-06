'use strict';

class AccessToken {

	/**
	 * @param {{}} options
	 * @param {string} options.accessToken
	 * @param {string} options.clientId
	 * @param {string} options.userId
	 * @param {Date} options.expires
	 */
	constructor(options) {
		this.accessToken = options.accessToken;
		this.clientId = options.clientId;
		this.userId = options.userId;
		this.expires = options.expires;
	}

}

module.exports = AccessToken;