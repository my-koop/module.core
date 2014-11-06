var React = require("react/addons");
var PropTypes = React.PropTypes;

var OverlayMixin = require("react-bootstrap/OverlayMixin");
var ReactSpinner = require("react-spinner");

// Can be used with no children (need to use ref for show)
// or have a single clickable child that will trigger the message
var Spinner = React.createClass({
  mixins: [OverlayMixin],

  propTypes: {
    visible: React.PropTypes.bool
  },

  getInitialState: function () {
    return {
      isOverlayShown: this.props.visible
    };
  },

  show: function () {
    this.setState({
      isOverlayShown: true
    });
  },

  hide: function () {
    this.setState({
      isOverlayShown: false
    });
  },

  toggle: function () {
    this.setState({
      isOverlayShown: !this.state.isOverlayShown
    });
  },

  renderOverlay: function () {
    if (!this.state.isOverlayShown) {
      // a component must be returned , an error occurs if return null;
      return (<span />);
    }

    return (
      <div>
        <ReactSpinner className="mk-spinner"/>
        <div className="modal-backdrop fade in" />
      </div>
    );
  },

  render: function () {
    return null;
  }

});

Spinner.globalInstance = null;
Spinner.isGlobalVisible = false;
Spinner.registerGlobalInstance = function(spinnerInstance) {
  Spinner.globalInstance = spinnerInstance;
  if(Spinner.isGlobalVisible) {
    spinnerInstance.show();
  }
}
Spinner.showGlobalSpinner = function() {
  Spinner.isGlobalVisible = true;
  if(Spinner.globalInstance) {
    Spinner.globalInstance.show();
  }
}
Spinner.hideGlobalSpinner = function() {
  Spinner.isGlobalVisible = true;
  if(Spinner.globalInstance) {
    Spinner.globalInstance.hide();
  }
}
Spinner.toggleGlobalSpinner = function() {
  Spinner.isGlobalVisible = !Spinner.isGlobalVisible;
  if(Spinner.globalInstance) {
    Spinner.globalInstance.toggle();
  }
}
module.exports = Spinner;
