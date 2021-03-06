﻿var React = require("react/addons");
var PropTypes = React.PropTypes;

var OverlayMixin = require("react-bootstrap/OverlayMixin");
var cloneWithProps = React.addons.cloneWithProps;
var BSButton = require("react-bootstrap/Button");
var BSModal = require("react-bootstrap/Modal");

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
var ConfirmationTrigger = React.createClass({
  mixins: [OverlayMixin],

  propTypes: {
    // custom message to display in the confirmation box
    message: PropTypes.string.isRequired,
    // callback when user clicks yes
    onYes: PropTypes.func,
    // callback when user clicks no
    onNo: PropTypes.func,
  },

  getInitialState: function () {
    return {
      isOverlayShown: false
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

  refuse: function(){
    if(this.props.onNo){
      this.props.onNo();
    }
    this.hide();
  },

  accept: function(){
    if(this.props.onYes){
      this.props.onYes();
    }
    this.hide();
  },

  renderOverlay: function () {
    if (!this.state.isOverlayShown) {
      // a component must be returned , an error occurs if return null;
      return (<span />);
    }

    return (
      <BSModal title={__("confirm")} bsSize="small" onRequestHide={this.refuse}>
        <div className="modal-body">
          {this.props.message}
        </div>
        <div className="modal-footer">
          <BSButton onClick={this.accept} bsStyle="success">{__("yes")}</BSButton>
          <BSButton onClick={this.refuse} bsStyle="danger">{__("no")}</BSButton>
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

module.exports = ConfirmationTrigger;
