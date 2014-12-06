import endpoints = require("../../metadata/endpoints");
import utils = require("mykoop-utils");

import _ = require("lodash");

export function attachControllers(
  binder: utils.ModuleControllersBinder<mkcore.Module>
) {
  var core = binder.moduleInstance;

  binder.attach(
    {
      endPoint: endpoints.settings.get,
      permissions: {
        //isRoot: true
      }
    },
    binder.makeSimpleController(core.getSettings, function(req) {
      var keys = req.param("keys", "");
      var params: any = {};
      if(!_.isEmpty(keys)) {
        console.log(keys);
        params.keys = keys.split(";");
      }
      return params;
    })
  );

  binder.attach(
    {
      endPoint: endpoints.settings.set,
      permissions: {
        //isRoot: true
      }
    },
    binder.makeSimpleController(core.setSettings, function(req) {
      var keys = req.param("keys", "");
      var params: any = {};
      if(!_.isEmpty(keys)) {
        _.each(keys.split(";"), function(key: any) {
          params[key] = req.param(key);
        });
      }
      return params;
    })
  );
}
