var endpoints = require("../../metadata/endpoints");
var _ = require("lodash");
function attachControllers(binder) {
    var core = binder.moduleInstance;
    binder.attach({ endPoint: endpoints.settings.get }, binder.makeSimpleController(core.getSettings));
    binder.attach({ endPoint: endpoints.settings.set }, binder.makeSimpleController(core.setSettings, function (req) {
        var keys = req.param("keys", "").split(";");
        var params = {};
        if (!_.isEmpty(keys)) {
            _.each(keys, function (key) {
                params[key] = req.param(key);
            });
        }
        return params;
    }));
}
exports.attachControllers = attachControllers;
