'use strict';
const LogEntry = require('../LogEntry'),
	_ = require('lodash');

class General extends LogEntry {

	constructor(options) {
		super(options);
		this.details = _.assign(this.details, {
			level: options.details.level,
			message: options.details.message,
			time: new Date(options.details.time),
			meta: options.details.meta
		});
	}
}

module.exports = General;