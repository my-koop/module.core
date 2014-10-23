var Module = require("./module");
var utils = require("mykoop-utils");

var ModuleBridge = (function () {
    function ModuleBridge() {
    }
    ModuleBridge.prototype.getInstance = function () {
        return this.instance || (this.instance = new Module());
    };

    ModuleBridge.prototype.onAllModulesInitialized = function (moduleManager) {
        this.getInstance().init(moduleManager);
    };

    ModuleBridge.prototype.getModule = function () {
        return this.getInstance();
    };

    ModuleBridge.prototype.getMetaData = function (callback) {
        // Avoid hardcoding data as much as possible here. Use require calls
        // whenever possible.
        var metaData = new utils.MetaData();

        metaData.addRoute({
            idPath: ["public", "example", "somepage"],
            component: "Component1",
            name: "example",
            path: "/example"
        });

        metaData.addData("translations", require("../locales"));

        callback(null, metaData.get());
    };
    return ModuleBridge;
})();

var bridge = new ModuleBridge();
module.exports = bridge;
