var endpoints = require("../../metadata/endpoints");
var _ = require("lodash");
function attachControllers(binder) {
    var core = binder.moduleInstance;
    binder.attach({
        endPoint: endpoints.settings.get,
        permissions: {
            website: {
                settings: true
            }
        }
    }, binder.makeSimpleController(core.getSettings, function (req) {
        var keys = req.param("keys", "");
        var params = {};
        if (!_.isEmpty(keys)) {
            console.log(keys);
            params.keys = keys.split(";");
        }
        return params;
    }));
    binder.attach({
        endPoint: endpoints.settings.set,
        permissions: {
            website: {
                settings: true
            }
        }
    }, binder.makeSimpleController(core.setSettings, function (req) {
        var keys = req.param("keys", "");
        var params = {};
        if (!_.isEmpty(keys)) {
            _.each(keys.split(";"), function (key) {
                params[key] = req.param(key);
            });
        }
        return params;
    }));
}
exports.attachControllers = attachControllers;
