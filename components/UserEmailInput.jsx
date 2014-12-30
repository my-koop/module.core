var React     = require("react");
var BSInput   = require("react-bootstrap/Input");

// My Koop components
var MKIcon              = require("./Icon");
var MKDebouncerMixin    = require("./DebouncerMixin");


// Utilities
var _ = require("lodash");
var actions = require("actions");
var util = require("util");
var EmailValidationState = require("../lib/frontend/EmailValidationState");

var UserEmailInput = React.createClass({
  mixins: [MKDebouncerMixin],

  propTypes: {
    readOnly: React.PropTypes.bool,
    email: React.PropTypes.string,
    onEmailChanged: React.PropTypes.func.isRequired,
    label: React.PropTypes.string
  },

  ////////////////////////////
  /// Life Cycle methods
  getInitialState: function(props) {
    props = props || this.props;
    var validationState = EmailValidationState.Initial;
    if(this.props.email) {
      validationState = EmailValidationState.Waiting;
      this.retrieveCustomerInfo(this.props.email);
    }
    return {
      validationState: validationState,
    }
  },

  ////////////////////////////
  /// component methods
  retrieveCustomerInfo: function(email) {
    var self = this;
    actions.user.customerInfo(
    {
      silent: true,
      data: {
        email: email
      }
    }, function(err, result) {
      // treat this response only if its the last we made
      var isValid = !err;
      var newState = !isValid ?
        EmailValidationState.Invalid
      : EmailValidationState.Valid;
      self.customerInfo = result;
      self.props.onEmailChanged(email, isValid ? result : null);
      self.setState({validationState: newState});
    });
  },

  customerInfo: null,
  ////////////////////////////
  /// Render method
  render: function() {
    var self = this;
    var readOnly = this.props.readOnly;

    var emailLink = !readOnly && {
      value: this.props.email,
      requestChange: function(newEmail) {
        self.customerInfo = null;
        self.props.onEmailChanged(newEmail, isValid = false);
        self.debounce([], "validationState", function() {
          if(newEmail === "") {
            return EmailValidationState.Initial;
          }
          self.retrieveCustomerInfo(newEmail);
          return EmailValidationState.Waiting;
        }, 1000, EmailValidationState.Waiting);
      }
    };

    var emailAddon = undefined;
    var inputStyle = undefined;
    var isWaiting = false;
    switch(self.state.validationState) {
      case EmailValidationState.Initial:
        break;
      case EmailValidationState.Invalid:
        inputStyle = "warning";
        emailAddon = <MKIcon glyph="close" />;
        break;
      case EmailValidationState.Waiting:
        isWaiting = true;
        inputStyle = "warning";
        //FIXME:: Waiting on https://github.com/my-koop/service.website/issues/261
        emailAddon = <MKIcon glyph="spinner" className="fa-spin" />;
        break;
      case EmailValidationState.Valid:
        inputStyle = "success";
        emailAddon = <MKIcon glyph="check" />;
        break;
    }

    return (
      !readOnly ?
        <BSInput
          type="email"
          valueLink={emailLink}
          label={this.props.label}
          bsStyle={inputStyle}
          addonBefore={<MKIcon glyph="envelope" fixedWidth />}
          addonAfter={emailAddon}
        />
      : <p key={2}>
          <label key={1}>{this.props.label}</label>
          {this.props.email}
        </p>
    );
  }

});

module.exports = UserEmailInput;
