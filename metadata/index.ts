import utils = require("mykoop-utils");
import routes = require("./routes");
import translations = require("../locales/index");
import uiHooks = require("./uiHooks");

var metaDataBuilder = new utils.MetaDataBuilder();
routes.addRoutes(metaDataBuilder);

metaDataBuilder.addData("translations", translations);
metaDataBuilder.addData("uihooks", uiHooks);

module.exports = metaDataBuilder.get();
