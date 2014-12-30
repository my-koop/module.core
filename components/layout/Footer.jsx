var React = require("react");

var __ = require("language").__;

var Footer = React.createClass({
  render: function() {
    return (
      <footer>
        <p className="text-center">2014 - {__("poweredBy")}MyKoop</p>
      </footer>
    );
  }
});

module.exports = Footer;
