
class Module implements mkmodule.Module {
  moduleManager: mykoop.ModuleManager;

  init(moduleManager: mykoop.ModuleManager){
    this.moduleManager = moduleManager;
    //moduleManager.get("")
  }

  method1(par1: string): string{
    return "";
  }
}

export = Module;
