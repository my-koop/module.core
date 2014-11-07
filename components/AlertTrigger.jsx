var React = require("react/addons");
var PropTypes = React.PropTypes;

var OverlayMixin = require("react-bootstrap/OverlayMixin");
var cloneWithProps = React.addons.cloneWithProps;
var BSButton = require("react-bootstrap/Button");
var BSModal = require("react-bootstrap/Modal");

var _ = require("lodash");
var __ = require("language").__;

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
    title: React.PropTypes.string,
    // custom message to display in the confirmation box
    message: PropTypes.string,
    actionButtons: React.PropTypes.arrayOf(React.PropTypes.shape({
      content: React.PropTypes.renderable.isRequired,
      onClick: React.PropTypes.func,
      props: React.PropTypes.object
    })),
    //Generic callback when the alert hides
    onHide: React.PropTypes.func
  },

  getStateFromProps: function(props) {
    var others = _.omit(props,
      "title",
      "message",
      "actionButtons",
      "onHide"
    );
    return {
      others: others,
      title: props.title,
      message: props.message,
      actionButtons: props.actionButtons || [],
      onHide: props.onHide,
      isOverlayShown: false
    };
  },

  getInitialState: function () {
    return this.getStateFromProps(this.props);
  },

  componentWillReceiveProps: function (nextProps) {
    return this.getStateFromProps(nextProps);
  },

  show: function () {
    this.setState({
      isOverlayShown: true
    });
  },

  hide: function () {
    var self = this;
    this.setState({
      isOverlayShown: false
    }, function() {
      if(self.state.onHide) {
        self.state.onHide();
      }
    });
  },

  toggle: function () {
    this.setState({
      isOverlayShown: !this.state.isOverlayShown
    });
  },

  onButtonClick: function(callback) {
    if(callback) {
      callback();
    }
    this.hide();
  },

  renderOverlay: function () {
    if (!this.state.isOverlayShown) {
      // a component must be returned , an error occurs if return null;
      return (<noscript />);
    }

    var self = this;
    var buttons = this.state.actionButtons.map(function(buttonDefinition, i) {
      return (
        <BSButton
          key={i}
          onClick={self.onButtonClick.bind(self, buttonDefinition.onClick)}
          {...buttonDefinition.props}
        >
          {buttonDefinition.content}
        </BSButton>
      )
    });

    return (
      <BSModal
        {...this.state.others}
        title={this.state.title}
        bsSize="small"
        onRequestHide={this.hide}
      >
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
    if(this.props.children) {
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

var globalDefaultProps = {
  title: __("alert"),
  actionButtons: [
    {
      content: __("ok"),
      props: {
        bsStyle: "success"
      }
    }
  ]
}
AlertTrigger.globalInstance = null;
AlertTrigger.latentAlertProps = null;

AlertTrigger.registerGlobalInstance = function(alertInstance) {
  AlertTrigger.globalInstance = alertInstance;
  if(alertInstance && AlertTrigger.latentAlertProps) {
    AlertTrigger.showAlert(AlertTrigger.latentAlertProps);
    AlertTrigger.latentAlertProps = null;
  }
}
AlertTrigger.showAlert = function(props) {
  if(AlertTrigger.globalInstance) {
    if(_.isString(props)) {
      props = {message: props};
    }
    var newState = AlertTrigger.globalInstance.getStateFromProps(
      _.assign(globalDefaultProps, props)
    );
    AlertTrigger.globalInstance.replaceState(
      newState,
      function() {
        AlertTrigger.globalInstance.show();
      }
    );
  } else {
    AlertTrigger.latentAlertProps = props;
  }
}


module.exports = AlertTrigger;
