import utils = require("mykoop-utils");
import _ = require("lodash");
import controllerList = require("./controllers/index");
var logger = utils.getLogger(module);
var DatabaseError = utils.errors.DatabaseError;
var ApplicationError = utils.errors.ApplicationError;

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

  getNotesController(table, req, res) {
    var id = parseInt(req.param("id", NaN));
    if(isNaN(id)) {
      return res.error(new ApplicationError(null, {id: "invalid"}));
    }
    this.getNotes({
      table: table,
      id: id
    }, function(err, notes) {
      if(err) {
        return res.error(err);
      }
      res.send(notes);
    });
  }

  newNoteController(table, req, res) {
    var authorId = req.session.user.id;
    var targetId = parseInt(req.param("id", NaN));
    var message = req.param("message", "");
    if(isNaN(targetId)) {
      return res.error(new ApplicationError(null, {targetId: "invalid"}));
    }
    this.newNote({
      table: table,
      authorId: authorId,
      targetId: targetId,
      message: message
    }, function(err) {
      if(err) {
        return res.error(err);
      }
      res.end();
    });
  }

  getNotes(
    params: mkcore.GetNotes.Params,
    callback: mkcore.GetNotes.Callback
  ) {
    this.callWithConnection(this.__getNotes, params, callback);
  }

  __getNotes(
    connection: mysql.IConnection,
    params: mkcore.GetNotes.Params,
    callback: mkcore.GetNotes.Callback
  ) {
    // Trustworthy data coming from modules
    var table = params.table;
    connection.query(
      "SELECT \
         t.date, \
         t.message, \
         concat(user.firstname,' ', user.lastname) as author \
       FROM " + table + " t\
       LEFT JOIN user ON t.authorId = user.id \
       WHERE t.targetId = ? \
       ORDER by t.date desc",
      [params.id],
      function(err, rows: any[]) {
        callback(err && new DatabaseError(err),
          { notes: _.map(rows, function(row) { return row; })}
        );
      }
    );
  }

  newNote(
    params: mkcore.NewNote.Params,
    callback: mkcore.NewNote.Callback
  ) {
    this.callWithConnection(this.__newNote, params, callback);
  }

  __newNote(
    connection: mysql.IConnection,
    params: mkcore.NewNote.Params,
    callback: mkcore.NewNote.Callback
  ) {
    // Trustworthy data coming from modules
    var table = params.table;
    var data = {
      targetId: params.targetId,
      authorId: params.authorId,
      message: params.message
    };
    connection.query(
      "INSERT INTO ?? SET ?",
      [table, data],
      function(err, res) {
        callback(err && new DatabaseError(err));
      }
    );
  }
}

export = Module;
