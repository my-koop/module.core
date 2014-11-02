import utils = require("mykoop-utils");
import routes = require("./routes");
import translations = require("../locales/index");

var metaDataBuilder = new utils.MetaDataBuilder();
routes.addRoutes(metaDataBuilder);

metaDataBuilder.addData("translations", translations);

module.exports = metaDataBuilder.get();
