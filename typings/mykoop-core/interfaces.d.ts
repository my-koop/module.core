declare module mkcore {

  module GetSettings {
    export interface Params {
      // optionnal when you only want a subset of the settings
      keys?: string[];
    }
    export interface Callback {
      (err?: Error, settings?: any): void
    }
  }

  module SetSettings {
    export interface Params {
      [key: string]: any;
    }
    export interface Callback {
      (err?: Error): void
    }
  }
}
