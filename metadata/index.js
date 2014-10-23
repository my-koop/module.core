var utils = require("mykoop-utils");
var routes = require("./routes");
var translations = require("../locales/index");

var metaData = new utils.MetaData();
routes.addRoutes(metaData);

metaData.addData("translations", translations);

module.exports = metaData.get();
