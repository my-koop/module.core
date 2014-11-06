var React = require("react");
var BSAlert = require("react-bootstrap/Alert");
var PropTypes = React.PropTypes;

/**
 * Inline emphasized alert message.
 * @constructor
 */
var Alert = React.createClass({
  /**
   * React properties
   */
  propTypes: {
    // Type of alert to display.
    bsStyle: PropTypes.oneOf(["warning", "danger", "success", "info"]),

    onHide: PropTypes.func,

    // Whether the alert message can be closed (dismissed) or not.
    permanent: PropTypes.bool,
    noReset: PropTypes.bool,
  },

  /**
   * React methods
   */

  getDefaultProps: function () {
    return {
      // Display an "info" alert.
      bsStyle: "info",

      // Allow the message to be dismissed.
      permanent: false
    };
  },

  getInitialState: function () {
    return {
      // Whether the alert message is displayed or not.
      display: true
    };
  },

  componentWillReceiveProps: function (nextProps) {
    if(!this.props.noReset) {
      this.setState({display: true});
    }
  },

  /**
   * Own methods
   */

  /**
   * Hides the alert.
   */
  hide: function() {
    this.setState({display: false}, function() {
      if (this.props.onHide) {
        this.props.onHide();
      }
    });
  },

  /**
   * React render
   */
  render: function() {
    // Message to display.
    var message = this.props.children;

    // Bootstrap style to use.
    var bsStyle = this.props.bsStyle;

    // Display the Bootstrap alert if necessary.
    if (this.state.display && message) {
      return (
        <BSAlert
          // Uses the same style as Bootstrap to define the
          // alert style.
          bsStyle={bsStyle}

          // React-Bootstrap will only display a close button
          // if the onDismiss event handler prop is defined.
          onDismiss={!this.props.permanent ? this.hide : undefined}
        >
          {message}
        </BSAlert>
      );
    }

    // If we're not displaying the alert, return an empty node.
    return null;
  }
});

module.exports = Alert;
