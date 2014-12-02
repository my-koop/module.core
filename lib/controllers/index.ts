import endpoints = require("../../metadata/endpoints");
import utils = require("mykoop-utils");

import _ = require("lodash");

export function attachControllers(
  binder: utils.ModuleControllersBinder<mkcore.Module>
) {
  var core = binder.moduleInstance;

  binder.attach(
    {endPoint: endpoints.settings.get},
    binder.makeSimpleController(core.getSettings)
  );

  binder.attach(
    {endPoint: endpoints.settings.set},
    binder.makeSimpleController(core.setSettings, function(req) {
      var keys = req.param("keys", "").split(";");
      var params: any = {};
      if(!_.isEmpty(keys)) {
        _.each(keys, function(key) {
          params[key] = req.param(key);
        });
      }
      return params;
    })
  );
}
