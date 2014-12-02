var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var utils = require("mykoop-utils");
var _ = require("lodash");
var controllerList = require("./controllers/index");
var logger = utils.getLogger(module);
var DatabaseError = utils.errors.DatabaseError;
var Module = (function (_super) {
    __extends(Module, _super);
    function Module() {
        _super.apply(this, arguments);
    }
    Module.prototype.init = function () {
        this.db = this.getModuleManager().get("database");
        controllerList.attachControllers(new utils.ModuleControllersBinder(this));
    };
    Module.prototype.getSettings = function (params, callback) {
        this.callWithConnection(this.__getSettings, params, callback);
    };
    Module.prototype.__getSettings = function (connection, params, callback) {
        var whereClause = params.keys ? "WHERE `key` IN (?)" : "";
        connection.query("SELECT `key`, value FROM configuration " + whereClause, [params.keys], function (err, rows) {
            if (err) {
                return callback(new DatabaseError(err));
            }
            var result = {};
            _.each(rows, function (row) {
                result[row.key] = row.value;
            });
            callback(null, result);
        });
    };
    Module.prototype.setSettings = function (params, callback) {
        this.callWithConnection(this.__setSettings, params, callback);
    };
    Module.prototype.__setSettings = function (connection, params, callback) {
        var queryParams = [];
        var cases = _.reduce(params, function (cases, value, key) {
            queryParams.push(key);
            queryParams.push(value);
            return cases + " WHEN ? THEN ?";
        }, "");
        connection.query("UPDATE configuration SET value = CASE `key` " + cases + " END WHERE `key` IN (?)", queryParams.concat([_.keys(params)]), function (err, result) {
            if (err) {
                return callback(new DatabaseError(err));
            }
            callback();
        });
    };
    return Module;
})(utils.BaseModule);
module.exports = Module;
