var React = require("react");

var BSRow = require("react-bootstrap/Row");

var MKDevNavBar = require("../layout/DevNavBar");
var MKGlobalSpinner = require("../Spinner");
var MKGlobalAlert  = require("../AlertTrigger");

var actions = require("actions");
var localSession = require("session").local;
var website = require("website");

var App = React.createClass({
  componentDidMount: function () {
    MKGlobalSpinner.registerGlobalInstance(this.refs.globalSpinner);
    MKGlobalAlert.registerGlobalInstance(this.refs.globalAlert);
    this.retrieveBackendUserSession();
  },

  retrieveBackendUserSession: function() {
    //FIXME: Once we allow modules to run bootstrap operations, the user module
    // should be the one doing this. At least make sure we have it here...
    if (!actions.user.current.getSession) {
      return;
    }

    actions.user.current.getSession(function(err, session) {
      if (err) {
        // Fail silently in production...
        return console.error(err);
      }

      if (session.id) {
        localSession.user = session;
        website.render();
      }
    });
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
