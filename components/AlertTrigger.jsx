var React = require("react/addons");
var PropTypes = React.PropTypes;

var OverlayMixin = require("react-bootstrap/OverlayMixin");
var cloneWithProps = React.addons.cloneWithProps;
var BSButton = require("react-bootstrap/Button");
var BSModal = require("react-bootstrap/Modal");

// taken from react-bootstrap utils
var createChainedFunction = function createChainedFunction(one, two) {
  var hasOne = typeof one === 'function';
  var hasTwo = typeof two === 'function';

  if (!hasOne && !hasTwo) { return null; }
  if (!hasOne) { return two; }
  if (!hasTwo) { return one; }

  return function chainedFunction() {
    one.apply(this, arguments);
    two.apply(this, arguments);
  };
}

// Can be used with no children (need to use ref for show)
// or have a single clickable child that will trigger the message
var AlertTrigger = React.createClass({
  mixins: [OverlayMixin],

  propTypes: {
    // custom message to display in the confirmation box
    message: PropTypes.string,
    actionButtons: React.PropTypes.arrayOf(React.PropTypes.shape({
      content: React.PropTypes.renderable.isRequired,
      onClick: React.PropTypes.func,
      props: React.PropTypes.object
    })),
  },

  getInitialState: function () {
    return {
      message: this.props.message,
      isOverlayShown: false
    };
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({
      message: nextProps.message
    });
  },

  show: function (message) {
    this.setState({
      message: message || this.state.message,
      isOverlayShown: true
    });
  },

  hide: function (message) {
    this.setState({
      message: message || this.state.message,
      isOverlayShown: false
    });
  },

  toggle: function (message) {
    this.setState({
      message: message || this.state.message,
      isOverlayShown: !this.state.isOverlayShown
    });
  },

  onButtonClick: function(callback){
    if(callback){
      callback();
    }
    this.hide();
  },

  renderOverlay: function () {
    if (!this.state.isOverlayShown) {
      // a component must be returned , an error occurs if return null;
      return (<span />);
    }

    var self = this;
    var buttons = this.props.actionButtons.map(function(buttonDefinition) {
      return (
        <BSButton
          onClick={self.onButtonClick.bind(self, buttonDefinition.onClick)}
          {...buttonDefinition.props}
        >
          {buttonDefinition.content}
        </BSButton>
      )
    });

    return (
      <BSModal title="Confirm" bsSize="small" onRequestHide={this.hide}>
        <div className="modal-body">
          {this.state.message}
        </div>
        <div className="modal-footer">
          {buttons}
        </div>
      </BSModal>
    );
  },

  render: function () {
    if(this.props.children){
      var child = React.Children.only(this.props.children);

      var props = {};
      // Pass down handler if we don't redefine them
      props.onClick = createChainedFunction(child.props.onClick, this.toggle);
      props.onMouseOver = this.props.onMouseOver;
      props.onMouseOut = this.props.onMouseOut;
      props.onFocus = this.props.onFocus;
      props.onBlur = this.props.onBlur;

      return cloneWithProps(
        child,
        props
      );
    }
    return null;
  }

});


AlertTrigger.globalInstance = null;
AlertTrigger.latentAlert = null;
AlertTrigger.registerGlobalInstance = function(alertInstance) {
  AlertTrigger.globalInstance = alertInstance;
  if(alertInstance && AlertTrigger.latentAlert) {
    alertInstance.show(AlertTrigger.latentAlert);
    AlertTrigger.latentAlert = null;
  }
}
AlertTrigger.showAlert = function(message) {
  if(AlertTrigger.globalInstance) {
    AlertTrigger.globalInstance.show(message);
  } else {
    AlertTrigger.latentAlert = message;
  }
}


module.exports = AlertTrigger;
