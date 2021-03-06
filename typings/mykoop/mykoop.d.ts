// Type definitions for my-koop
// Project: https://github.com/my-koop/service.website
// Definitions by: Michael Ferris <https://github.com/Cellule/>
// Definitions: https://github.com/my-koop/type.definitions

declare var __DEV__: boolean;
declare var __PROD__: boolean;

declare module NodeJS {
  export interface Process {
    __DEV__: boolean;
    __PROD__: boolean;
    browser: boolean;
  }
}

declare module Express {
  export interface Router{}
  export interface Request{
    param (name: string, defaultValue?: any) : string;
    userHasPermissions(permissions);
  }
  export interface Response{
    error(err, status?: number);
  }
  export interface Session{
    user?: any;
  }
  export interface Handler{}
}

interface Error {
  stack ?: string;
}

declare module mykoop {

  export interface IModule {
    getModuleManager(): ModuleManager;
    setModuleManager(moduleManager: ModuleManager): void;
  }

  export interface ModuleDefinition {
    name: string;
    role: string;
    dependencies?: string[];
  }

  export class ModuleManager {
    // Retrieves the instance of a module, can be null if unavailable
    get(moduleName: string): IModule;
    // Get the meta data computed from loaded modules.
    getMetaData(callback: ModuleMetaDataCallback): void;
  }

  export interface IModuleBridge {
    // All modules are initialized and are available to use
    onAllModulesInitialized(moduleManager ?: ModuleManager): void;

    // Retrieve the instance of the module, may not be ready to be used
    getModule(): IModule;

    getMetaData?: (callback: ModuleMetaDataCallback) => void;
  }

  export interface ModuleMetaDataCallback {
    (err: Error, result: any) : void;
  }

  export interface IRouteMetaDataLeaf {
    handler?: {resolve: string; value?: string};
    name?: string;
    path?: string;
    default?: boolean;
  }

  export interface IRouteMetaDataParent extends IRouteMetaDataLeaf {
    children: {[id: string]: IRouteMetaDataLeaf};
  }

  export interface IModuleMetaData {
    // Route meta data.
    routes?: {[key: string]: IRouteMetaDataLeaf};
    translations?: {[key: string]: any};
    endpoints?: {[key: string]: any};

    // Other types of meta data...
    [key: string]: any;
  }

  // see http://expressjs.com/4x/api.html#router
  export interface RouterOptions{
    caseSensitive?: boolean;
    mergeParams?: boolean;
    strict?: boolean;
  }

  export interface ValidationResults {
    [id: string]: string[];
  }

  export interface RouteParams{
    endPoint: {
      path: string;
      method?: string;
      type?: string;
    };
    validation?: (obj: any) => ValidationResults;
    customPermissionDenied?: (
      req: Express.Request,
      callback: (err?: Error) => void
    ) => void;
    customPermissionGranted?: (
      req: Express.Request,
      callback: (err?: Error) => void
    ) => void;
    permissions?: any;
  }

  export interface Router extends IModule {
    addRoute(
      params: RouteParams,
      callback: Express.Handler[]
    );
  }
}

