var React = require("react");

var BSRow = require("react-bootstrap/Row");

var MKDevNavBar = require("../layout/DevNavBar");
var MKGlobalSpinner = require("../Spinner");
var MKAlertTrigger = require("../AlertTrigger");

var App = React.createClass({
  componentDidMount: function () {
    MKGlobalSpinner.registerGlobalInstance(this.refs.globalSpinner);
    MKAlertTrigger.registerGlobalInstance(this.refs.globalAlert);
  },

  render: function() {
    return (
      <div>
        <MKGlobalSpinner ref="globalSpinner" />
        <MKAlertTrigger ref="globalAlert" actionButtons={[]}/>
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
