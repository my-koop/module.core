var React = require("react");
var BSCol = require("react-bootstrap/Col");
var BSRow = require("react-bootstrap/Row");

var __ = require("language").__;

var Homepage = React.createClass({

  render: function() {
    return (
      <BSRow>
        <BSCol xs={12}>
          <h3>
            {__("dashboard.welcomeTitle")}
          </h3>
          <p>
            {__("dashboard.welcomeMessage")}
          </p>
        </BSCol>
      </BSRow>
    );
  }

});

module.exports = Homepage;
