module.exports = {
	config: Module('./config'),

	mongoDb: (sm) => {
		const mongoose = require('mongoose');
		// Makes connection asynchronously. Mongoose will queue up database
		// operations and release them when the connection is complete.
		const dsn = sm.get('config').mongoDb.dsn;
		mongoose.connect(dsn, function (err, res) {
			if (err) {
				console.log ('ERROR connecting to: ' + dsn + '. ' + err);
			} else {
				console.log ('Succeeded connected to: ' + dsn);
			}
		});
	},

	authRepo: Module('../auth/MongoAuthRepo')
};

function Module(path) {
	return () => require(path);
}