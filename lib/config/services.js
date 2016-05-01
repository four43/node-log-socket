'use strict';
const EventEmitter = require('events');

module.exports = {
	config: Module('./config'),

	mongoDb: (sm) => {
		const MongoClient = require('mongodb').MongoClient;
		const dsn = sm.get('config').mongoDb.dsn;
		return MongoClient.connect(dsn);
	},

	logEntryParser: (sm) => {
		const logEntryTypes = sm.get('config').logEntryTypes;

		return (data) => {
			const Model = logEntryTypes[data.type];
			if(Model) return new Model(data);
			return null;
		}
	},

	eventHub: (sm) => {
		return new EventHub();
	}
};

function Module(path) {
	return () => require(path);
}

class EventHub extends EventEmitter {}