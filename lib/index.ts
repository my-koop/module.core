import Module = require("./module");
import utils = require("mykoop-utils");

class ModuleBridge implements mykoop.IModuleBridge {
  instance: Module;

  getInstance(): Module {
    return this.instance || (this.instance = new Module());
  }

  onAllModulesInitialized(moduleManager: mykoop.ModuleManager){
    this.getInstance().init(moduleManager);
  }

  getModule() : mykoop.IModule {
    return this.getInstance();
  }

  getMetaData(callback: mykoop.ModuleMetaDataCallback): void {
    // Avoid hardcoding data as much as possible here. Use require calls
    // whenever possible.
    var metaData = new utils.MetaData();

    metaData.addRoute({
      idPath: ["public","example","somepage"],
      component: "Component1",
      name: "example",
      path: "/example"
    });

    metaData.addData("translations", require("../locales"));

    callback(null, metaData.get());
  }
}

var bridge: mykoop.IModuleBridge = new ModuleBridge();
export = bridge;

