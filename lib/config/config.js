module.exports = {
	mongoDb: {
		dsn: 'mongodb://localhost/log_monster'
	},
	redis: {
		host: 'localhost',
		port: 6379
	},

	logEntryTypes: {
		HTTP: require('../model/LogEntry/Http'),
		GENERAL: require('../model/LogEntry/General')
	}
};