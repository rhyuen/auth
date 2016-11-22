var nconf = require("nconf");

nconf.file("keys.json");

module.exports = {
  sessionSecret: process.env.sessionSecret || nconf.get("sessionSecret"),
  db: process.env.db|| nconf.get("db")
};
