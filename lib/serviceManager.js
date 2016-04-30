var ServiceManager = require('simple-service-manager');

ServiceManager.initialize(require('./config/services'));

/**
 * @type {ServiceManager}
 */
module.exports = ServiceManager.instance();