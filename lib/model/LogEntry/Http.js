'use strict';
const LogEntry = require('../LogEntry'),
	_ = require('lodash');

class Http extends LogEntry {

	constructor(options) {
		super(options);
		this.details = _.assign(this.details, {
			requestId: options.details.requestId,
			method: options.details.method,
			requestUrl: options.details.requestUrl,
			startTime: options.details.startTime,
			duration: options.details.duration,
			responseCode: options.details.responseCode,
			contentLength: options.details.contentLength,
			additionalHeaders: options.details.additionalHeaders,
			requestBody: options.details.requestBody,
			meta: options.details.meta
		});
	}
}

module.exports = Http;