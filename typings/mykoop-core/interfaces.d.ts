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

  export interface Note {
    date: Date;
    message: string;
    author: string;
  }

  module GetNotes {
    export interface Params {
      table: string;
      id: number;
    }
    export interface Result {
      notes: Note[];
    }
    export interface Callback {
      (err: Error, res?: Result): void
    }
  }

  module NewNote {
    export interface Params {
      table: string;
      targetId: number;
      authorId: number;
      message: string;
    }
    export interface Result {
      notes: Note[];
    }
    export interface Callback {
      (err: Error, res?: Result): void
    }
  }
}
