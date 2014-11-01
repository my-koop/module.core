var utils = require("mykoop-utils");
var routes = require("./routes");
var translations = require("../locales/index");

var metaDataBuilder = new utils.MetaDataBuilder();
routes.addRoutes(metaDataBuilder);

metaDataBuilder.addData("translations", translations);

module.exports = metaDataBuilder.get();
