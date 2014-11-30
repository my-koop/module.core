var utils = require("mykoop-utils");
var routes = require("./routes");
var translations = require("../locales/index");
var uiHooks = require("./uiHooks");
var metaDataBuilder = new utils.MetaDataBuilder();
routes.addRoutes(metaDataBuilder);
metaDataBuilder.addData("translations", translations);
metaDataBuilder.addData("uihooks", uiHooks);
module.exports = metaDataBuilder.get();
