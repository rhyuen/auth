var nconf = require("nconf");

nconf.file("keys.json");

module.exports = {
  sessionSecret: process.env.sessionSecret || nconf.get("sessionSecret"),
  db: process.env.db|| nconf.get("db"),
  twitter: {
    consumerKey: process.env.twitterConsumerKey || nconf.get("twitter:consumerKey"),
    consumerSecret: process.env.twitterConsumerSecret || nconf.get("twitter:consumerSecret"),
    callbackURL: process.env.twitterCallbackURL || nconf.get("twitter:callbackURL")
  },
  github: {
    clientID: process.env.githubClientID || nconf.get("github:clientID"),
    clientSecret : process.env.githubClientSecret || nconf.get("github:clientSecret"),
    callbackURL: process.env.githubCallbackURL || nconf.get("github:callbackURL")
  }
};
