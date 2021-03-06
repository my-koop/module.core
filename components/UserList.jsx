var React = require("react");
var PropTypes = React.PropTypes;

var BSListGroup = require("react-bootstrap/ListGroup");
var BSListGroupItem = require("react-bootstrap/ListGroupItem");
var BSInput = require("react-bootstrap/Input");
var BSCol = require("react-bootstrap/Col");
var BSRow = require("react-bootstrap/Row");
var BSButton = require("react-bootstrap/Button");

var MKUserEmailInput = require("./UserEmailInput");
var MKIcon = require("./Icon");
var MKConfirmationTrigger = require("./ConfirmationTrigger");
var MKFeedbacki18nMixin = require("./Feedbacki18nMixin");

var _ = require("lodash");
var __ = require("language").__;
var actions = require("actions");
var async = require("async");

var UserList = React.createClass({
  mixins: [MKFeedbacki18nMixin],

  propTypes : {
    userList: React.PropTypes.array.isRequired,
    readOnly: React.PropTypes.bool,
    noAdd: React.PropTypes.bool,
    noDelete: React.PropTypes.bool,
    checkCanAddUser: React.PropTypes.func,
    onAddUser: React.PropTypes.func,
    onDeleteUser: React.PropTypes.func,
    maxLength: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      maxLength: 10
    };
  },

  getInitialState: function() {
    return {
      newUserEmail: null,
      newUserInfo: null
    }
  },

  render: function() {
    var self = this;
    var readOnly = this.props.readOnly;
    var onAdd = this.props.onAddUser || _.noop;
    var onDelete = this.props.onDeleteUser || _.noop;
    var users = _.sortBy(this.props.userList, function(user) {
      return user.name || user.firstName;
    });
    var checkCanAddUser = this.props.checkCanAddUser;
    var userListItems = _.map(users, function(user, i) {
      var name = user.name || user.firstName + " " + user.lastName;
      return (
        <BSListGroupItem key={i}>
          {user.id} &ndash; {name}
          {!readOnly && !self.props.noDelete ?
            <MKConfirmationTrigger
              message={__("areYouSure")}
              onYes={_.partial(onDelete, user)}
            >
              <span
                className="user-list-remove"
              >
                <MKIcon glyph="close" fixedWidth />
              </span>
            </MKConfirmationTrigger>
          : null}
        </BSListGroupItem>
      );
    });
    var emailLink = {
      value: this.state.newUserEmail,
      requestChange: function(newEmail, newUserInfo) {
        async.waterfall([
          function(next) {
            if(newUserInfo && checkCanAddUser) {
              return checkCanAddUser(newUserInfo, next);
            }
            next();
          },
          function(next) {
            if(newUserInfo) {
              // check if this user is already part of the list
              if(_.find(users, function(user) {
                  return user.id === newUserInfo.id;
                })
              ) {
                return next({key: "userListDuplicate"});
              }
            }
            next();
          }
        ], function(err) {
          if(!err) {
            self.clearFeedback();
          } else {
            self.setFeedback(err, "warning");
          }
          self.setState({
            newUserEmail: newEmail,
            newUserInfo: !err ? newUserInfo : null,
          });
        });
      }
    };
    function makeAddButton(isXs) {
      return (
        <BSButton
          bsStyle="success"
          className={isXs ? "visible-xs" : "pull-right hidden-xs"}
          block={isXs}
          disabled={!self.state.newUserInfo}
          onClick={_.partial(onAdd, self.state.newUserInfo)}
        >
          <MKIcon glyph="plus" fixedWidth />
          {" " + __("add")}
        </BSButton>
      );
    }
    var addUserInput = !readOnly && !this.props.noAdd && (
      <BSListGroupItem key="newUser">
        <BSRow>
          <BSCol xs={12}>
            <MKUserEmailInput
              email={emailLink.value}
              onEmailChanged={emailLink.requestChange}
              label={__("addNewUser")}
            />
          </BSCol>
        </BSRow>
        <BSRow>
          <BSCol xs={12}>
            {makeAddButton()}
            {makeAddButton(isXs = true)}
          </BSCol>
        </BSRow>
      </BSListGroupItem>
    );
    return (
      <div>
        {this.renderFeedback()}
        <div
          style={{maxHeight: 42*this.props.maxLength}}
          className="list-group-tight"
        >
          <BSListGroup>
            {userListItems}
          </BSListGroup>
        </div>
        {addUserInput}
      </div>
    );
  }
});

module.exports = UserList;
