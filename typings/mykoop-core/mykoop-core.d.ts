// Type definitions for mykoop-core
// Project: https://github.com/my-koop/module.core
// Definitions by: Michael Ferris <https://github.com/Cellule/>
// Definitions: https://github.com/my-koop/type.definitions

/// <reference path="../mykoop/mykoop.d.ts" />
/// <reference path="interfaces.d.ts" />
declare module mkcore {

  export interface Module extends mykoop.IModule {
    getSettings(
      params: GetSettings.Params,
      callback: GetSettings.Callback
    );
    __getSettings(
      connection: mysql.IConnection,
      params: GetSettings.Params,
      callback: GetSettings.Callback
    );

    setSettings(
      params: SetSettings.Params,
      callback: SetSettings.Callback
    );
    __setSettings(
      connection: mysql.IConnection,
      params: SetSettings.Params,
      callback: SetSettings.Callback
    );


    getNotesController(
      table: string,
      req: Express.Request,
      res: Express.Response
    );
    newNoteController(
      table: string,
      req: Express.Request,
      res: Express.Response
    );

    getNotes(
      params: mkcore.GetNotes.Params,
      callback: mkcore.GetNotes.Callback
    );
    __getNotes(
      connection: mysql.IConnection,
      params: mkcore.GetNotes.Params,
      callback: mkcore.GetNotes.Callback
    );

    newNote(
      params: mkcore.NewNote.Params,
      callback: mkcore.NewNote.Callback
    );
    __newNote(
      connection: mysql.IConnection,
      params: mkcore.NewNote.Params,
      callback: mkcore.NewNote.Callback
    );
  }
}
