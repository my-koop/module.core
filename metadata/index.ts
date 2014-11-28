import utils = require("mykoop-utils");
import routes = require("./routes");
import translations = require("../locales/index");

var metaDataBuilder = new utils.MetaDataBuilder();
routes.addRoutes(metaDataBuilder);

metaDataBuilder.addData("translations", translations);

metaDataBuilder.addData("uihooks", {
  navbar_main: {
    somebutton: {
      type: "item",
      content: {
        icon: "users",
        i18n: "whatever",
        children: {
          somebutton: {
            type: "item",
            content: {
              icon: "users",
              i18n: "whatever",
              link: "home"
            },
            priority: 200
          },
          someotherbutton: {
            type: "item",
            content: {
              icon: "calendar",
              i18n: "whateverelse",
              link: "home"
            },
            priority: 100
          }
        }
      },
      priority: 200
    },
    someotherbutton: {
      type: "item",
      content: {
        icon: "calendar",
        i18n: "whateverelse",
        link: "home"
      },
      priority: 100
    }
   }
});

module.exports = metaDataBuilder.get();
