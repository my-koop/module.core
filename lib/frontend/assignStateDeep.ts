/// <reference path="../../typings/tsd.d.ts" />
var traverse = require("traverse");

function assignStateDeep(self, callback, stateList, parseFunc, newValue) {
  traverse(self.state).set(stateList, parseFunc(newValue));
  //setState
  self.setState(self.state, callback);
}
export = assignStateDeep;
