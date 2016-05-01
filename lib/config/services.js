module.exports = {
	config: Module('./config'),

	mongoDb: (sm) => {
		const MongoClient = require('mongodb').MongoClient;
		const dsn = sm.get('config').mongoDb.dsn;
		return MongoClient.connect(dsn);
	}
};

function Module(path) {
	return () => require(path);
}