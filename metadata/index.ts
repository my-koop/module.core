import utils = require("mykoop-utils");
import routes = require("./routes");
var translations = require("../locales");
import uiHooks = require("./uiHooks");
import endpoints = require("./endpoints");

var metaDataBuilder = new utils.MetaDataBuilder();
routes.addRoutes(metaDataBuilder);

metaDataBuilder.addData("endpoints", endpoints);
metaDataBuilder.addData("translations", translations);
metaDataBuilder.addData("uihooks", uiHooks);

module.exports = metaDataBuilder.get();
