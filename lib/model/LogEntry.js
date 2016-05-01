'use strict';
class LogEntry {

	constructor(options) {
		this.source = {
			appId: options.source.appId !== undefined ? options.source.appId : 'Default',
			service: options.source.service,
			serviceGroup: options.source.serviceGroup,
			serverId:  options.source.serverId,
			meta: options.source.meta
		};
		this.details = {
			type: options.details.type
		};
	}
}
LogEntry.TYPE_HTTP = 'HTTP';
LogEntry.TYPE_EVENT = 'ENTRY';
LogEntry.TYPE_GENERAL = 'GENERAL';

module.exports = LogEntry;