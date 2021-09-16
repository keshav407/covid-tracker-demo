
// import .env variables
require('dotenv').config();

var env = process.env.NODE_ENV || "development";

var config = require(__dirname + "/../config/config.json")[env];

module.exports = {
	env: config.NODE_ENV,
	port: config.PORT,
	jwtSecret: config.JWT_SECRET,
	jwtSecretAdmin: config.JWT_SECRET_ADMIN,
	jwtExpirationInterval: config.JWT_EXPIRATION_INTERVAL,
	mongo: {
		uri:
			config.NODE_ENV === 'test'
				? config.MONGO_URI_TESTS
				: config.MONGO_URI
	},
	logs: config.NODE_ENV === 'production' ? 'combined' : 'dev',
};
