'use strict';
const bcrypt = require('bcrypt');

class User {
	constructor(options) {
		this.id = options.id || options._id;
		this.password = options.password;
		this.firstName = options.firstName;
		this.lastName = options.lastName;
		this.email = options.email;
	}

	verifyPassword(password, callback) {
		return bcrypt.compare(password, this.password, callback);
	}
}

module.exports = User;
