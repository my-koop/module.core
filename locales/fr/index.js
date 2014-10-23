// Done manually for now, but technically modules can populate this however
// they want...

module.exports = {
  // To be merged with the "general" (default) namespace, not mandatory.
  general: require("./general"),

  mynamespace: require("./mynamespace")
}
