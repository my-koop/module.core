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
var ApplicationError = utils.errors.ApplicationError;
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
    Module.prototype.getNotesController = function (table, req, res) {
        var id = parseInt(req.param("id", NaN));
        if (isNaN(id)) {
            return res.error(new ApplicationError(null, { id: "invalid" }));
        }
        this.getNotes({
            table: table,
            id: id
        }, function (err, notes) {
            if (err) {
                return res.error(err);
            }
            res.send(notes);
        });
    };
    Module.prototype.newNoteController = function (table, req, res) {
        var authorId = req.session.user.id;
        var targetId = parseInt(req.param("id", NaN));
        var message = req.param("message", "");
        if (isNaN(targetId)) {
            return res.error(new ApplicationError(null, { targetId: "invalid" }));
        }
        this.newNote({
            table: table,
            authorId: authorId,
            targetId: targetId,
            message: message
        }, function (err) {
            if (err) {
                return res.error(err);
            }
            res.end();
        });
    };
    Module.prototype.getNotes = function (params, callback) {
        this.callWithConnection(this.__getNotes, params, callback);
    };
    Module.prototype.__getNotes = function (connection, params, callback) {
        // Trustworthy data coming from modules
        var table = params.table;
        connection.query("SELECT \
         t.date, \
         t.message, \
         concat(user.firstname,' ', user.lastname) as author \
       FROM " + table + " t\
       LEFT JOIN user ON t.authorId = user.id \
       WHERE t.targetId = ? \
       ORDER by t.date desc", [params.id], function (err, rows) {
            callback(err && new DatabaseError(err), { notes: _.map(rows, function (row) {
                return row;
            }) });
        });
    };
    Module.prototype.newNote = function (params, callback) {
        this.callWithConnection(this.__newNote, params, callback);
    };
    Module.prototype.__newNote = function (connection, params, callback) {
        // Trustworthy data coming from modules
        var table = params.table;
        var data = {
            targetId: params.targetId,
            authorId: params.authorId,
            message: params.message
        };
        connection.query("INSERT INTO ?? SET ?", [table, data], function (err, res) {
            callback(err && new DatabaseError(err));
        });
    };
    return Module;
})(utils.BaseModule);
module.exports = Module;
