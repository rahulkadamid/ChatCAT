"use strict"

if( process.env.NODE_ENV === 'production' ) {

  let redisURI = require('url').parse(process.env.REDIS_URL);
  // redis://redistogo:123JFIR23423545Gcsdfwe@asdfwerwe/6793
  let redisPass = redisURI.auth.split(':')[1];

	// Load all from .env file
	module.exports = {
		HOST: process.env.BASE_URL || "",
		DB_URI: process.env.DB_URI || "",
		SESSION_SECRET: process.env.SESSION_SECRET || "",
		FB: {
			APP_ID : process.env.FB_APP_ID || "",
			APP_SECRET: process.env.FB_APP_SECRET || "",
			CALLBACK_URL: process.env.BASE_URL + "auth/facebook/callback" || "",
			PROFILE_FIELDS: ["id", "displayName", "photos"]
		},
		TW: {
			API_KEY: process.env.TW_API_KEY || "",
			API_SECRET: process.env.TW_API_SECRET || "",
			CALLBACK_URL: process.env.BASE_URL + "auth/twitter/callback" || "",
			PROFILE_FIELDS: ["id", "displayName", "photos"]
    },
    REDIS: {
      HOST: redisURI.hostname,
      PORT: redisURI.port,
      PASSWORD: redisPass
    }
	}
} else {
	module.exports = require('./development.json');
}
