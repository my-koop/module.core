var React = require("react");

var BSRow = require("react-bootstrap/Row");

var MKDevNavBar = require("../layout/DevNavBar");
var MKGlobalSpinner = require("../Spinner");
var MKGlobalAlert  = require("../AlertTrigger");

var App = React.createClass({
  componentDidMount: function () {
    MKGlobalSpinner.registerGlobalInstance(this.refs.globalSpinner);
    MKGlobalAlert.registerGlobalInstance(this.refs.globalAlert);
  },

  render: function() {
    return (
      <div>
        <MKGlobalSpinner ref="globalSpinner" />
        <MKGlobalAlert ref="globalAlert" />
        {this.props.activeRouteHandler()}

        {/* To be removed after development. */}
        <BSRow>
          <MKDevNavBar hide />
        </BSRow>
      </div>
    );
  }
});

module.exports = App;
