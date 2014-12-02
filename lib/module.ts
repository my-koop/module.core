import utils = require("mykoop-utils");
import _ = require("lodash");
import controllerList = require("./controllers/index");
var logger = utils.getLogger(module);
var DatabaseError = utils.errors.DatabaseError;

class Module extends utils.BaseModule implements mkcore.Module {
  db: mkdatabase.Module;
  init() {
    this.db = <mkdatabase.Module>this.getModuleManager().get("database");
    controllerList.attachControllers(new utils.ModuleControllersBinder(this));
  }

  getSettings(
    params: mkcore.GetSettings.Params,
    callback: mkcore.GetSettings.Callback
  ) {
    this.callWithConnection(this.__getSettings, params, callback);
  }
  __getSettings(
    connection: mysql.IConnection,
    params: mkcore.GetSettings.Params,
    callback: mkcore.GetSettings.Callback
  ) {
    var whereClause = params.keys ? "WHERE `key` IN (?)" : "";
    connection.query(
      "SELECT `key`, value FROM configuration " + whereClause,
      [params.keys],
      function(err, rows: any[]) {
        if(err) {
          return callback(new DatabaseError(err));
        }
        var result: any = {};
        _.each(rows, function(row) {
          result[row.key] = row.value;
        });
        callback(null, result);
      }
    );
  }

  setSettings(
    params: mkcore.SetSettings.Params,
    callback: mkcore.SetSettings.Callback
  ) {
    this.callWithConnection(this.__setSettings, params, callback);
  }
  __setSettings(
    connection: mysql.IConnection,
    params: mkcore.SetSettings.Params,
    callback: mkcore.SetSettings.Callback
  ) {
    var queryParams = [];
    var cases = _.reduce(params, function(cases, value, key) {
      queryParams.push(key);
      queryParams.push(value);
      return cases + " WHEN ? THEN ?";
    }, "");
    connection.query(
      "UPDATE configuration SET value = CASE `key` " + cases +
      " END WHERE `key` IN (?)",
      queryParams.concat([_.keys(params)]),
      function(err, result) {
        if(err) {
          return callback(new DatabaseError(err));
        }
        callback();
      }
    );
  }
}

export = Module;
