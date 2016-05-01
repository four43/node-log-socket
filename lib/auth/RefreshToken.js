'use strict';

class RefreshToken {

	/**
	 *
	 * @param {{}} options
	 * @param {string} options.refreshToken
	 * @param {string} options.clientId
	 * @param {string} options.userId
	 * @param {Date} options.expires
	 */
	constructor(options) {
		this.refreshToken = options.refreshToken;
		this.clientId = options.clientId;
		this.userId = options.userId;
		this.expires = options.expires;
	}
}

module.exports = RefreshToken;