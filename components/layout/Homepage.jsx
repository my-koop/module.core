var React = require("react");
var BSCol = require("react-bootstrap/Col");

var __ = require("language").__;

var Homepage = React.createClass({

  render: function() {
    return (
      <BSCol md={6} mdOffset={3}>
        <h3>
          {__("welcome")}
        </h3>
        <p>
          {__("homeMessage")}
        </p>
      </BSCol>
    );
  }

});

module.exports = Homepage;
