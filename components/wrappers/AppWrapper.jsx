var React = require("react");

var BSRow = require("react-bootstrap/Row");

var MKDevNavBar;

if (__DEV__) {
  MKDevNavBar = require("../layout/DevNavBar");
} else {
  MKDevNavBar = React.DOM.noscript;
}

var MKGlobalSpinner = require("../Spinner");
var MKGlobalAlert  = require("../AlertTrigger");

var actions = require("actions");
var localSession = require("session").local;
var website = require("website");

var App = React.createClass({

  getInitialState: function() {
    return {
      receivedSessionResponse: false
    };
  },

  componentDidMount: function () {
    MKGlobalSpinner.registerGlobalInstance(this.refs.globalSpinner);
    MKGlobalAlert.registerGlobalInstance(this.refs.globalAlert);
    this.retrieveBackendUserSession();
  },

  retrieveBackendUserSession: function() {
    //FIXME: Once we allow modules to run bootstrap operations, the user module
    // should be the one doing this. At least make sure we have it here...
    if (!actions.user) {
      return;
    }
    var self = this;
    actions.user.current.getSession(function(err, session) {
      if (err) {
        // Fail silently in production...
        return console.error(err);
      }
      if (session.id) {
        localSession.user = session;
      }
      self.setState({
        receivedSessionResponse: true
      });
    });
  },

  render: function() {
    return (
      <div>
        <MKGlobalSpinner ref="globalSpinner" />
        <MKGlobalAlert ref="globalAlert" />
        {this.state.receivedSessionResponse && this.props.activeRouteHandler()}

        {/* To be removed after development. */}
        <BSRow>
          <MKDevNavBar hide />
        </BSRow>
      </div>
    );
  }
});

module.exports = App;
