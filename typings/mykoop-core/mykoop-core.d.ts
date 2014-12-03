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
  }
}
