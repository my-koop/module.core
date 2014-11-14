var React = require('react');

var _ = require("lodash");

function assignStateDeep(self, callback, stateList, target, parseFunc, newValue) {
  // Find source
  var source = _.reduce(stateList, function(source, id) {
    return source[id];
  }, self.state);
  // Assign new value
  source[target] = parseFunc(newValue);
  //setState
  self.setState(self.state, callback);
}

module.exports = {
  // private debouncer map
  componentWillMount: function() {
    this.___debouncers___ = {};
  },

  // Assigns the newValue raw immediately then parse and reassign [delay]ms after
  // the last call
  //  stateList : Key chain down the state
  //  target: key of the last element down the state
  //  parsefunc: Function used to translate raw value to desired value
  //              (newValue) => parsedValue
  //  delay: Optionnal, delay(ms) after the last call to execute the treatment
  //          default = 500ms
  //  newValue: value to assign/parse to the target
  // Usage:
  //     to assign a value to this.state.key1.key2[5].key3 = parseFunc(newValue)
  //     use debounce(["key1", "key2", 5], "key3", parseFunc, optionnalDelay, newValue)
  //   To use with React valueLink
  //    var link = {
  //        value: this.state.key1.key2[5].key3,
  //        requestChange: _.bind(self.debounce, self, ["key1", "key2", 5], "key3",
  //          function(newValue) {
  //            return parseFloat(newValue) || 0;
  //          },
  //          500 /*Optionnal*/
  //        )
  //      }
  debounce: function(stateList, target, parseFunc, delay, newValue) {
    if(_.isString(stateList)) {
      stateList = [stateList];
    }
    if(!_.isArray(stateList)) {
      return console.warn("Debouncer stateList must be an array of keys");
    }
    if(newValue === undefined) {
      newValue = delay;
      delay = 500;
    }
    var self = this;

    var debouncerKey = stateList.join("") + target;
    // Find the debouncer for the target
    if(!this.___debouncers___[debouncerKey]) {
      // create a new one if doesn't exists
      this.___debouncers___[debouncerKey] = _.debounce(
        _.bind(assignStateDeep, null, self, _.noop),
        delay
      );
    }

    var debouncer = this.___debouncers___[debouncerKey];
    // Assign the raw value now, then make a call to the debouncer
    assignStateDeep(
      self,
      // Call to debouncer
      _.bind(debouncer, self, stateList, target, parseFunc, newValue),
      // parameter to set value now
      stateList, target, _.identity, newValue
    );
  }

}
