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

var _ = require("lodash");
var __ = require("language").__;
var actions = require("actions");

var UserList = React.createClass({

  propTypes : {
    userList: React.PropTypes.array,
    readOnly: React.PropTypes.bool,
    onAddUser: React.PropTypes.func,
    onDeleteUser: React.PropTypes.func,
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
    var users = _.map(this.props.userList, function(user, i) {
      var name = user.name || user.firstName + " " + user.lastName;
      return (
        <BSListGroupItem key={i}>
          {user.id} &ndash; {user.name}
          {!readOnly ?
            <span
              className="user-list-remove"
              onClick={_.partial(onDelete, user)}
            >
              <MKIcon glyph="close" fixedWidth />
            </span>
          : null}
        </BSListGroupItem>
      );
    });
    var emailLink = {
      value: this.state.newUserEmail,
      requestChange: function(newEmail, newUserInfo) {
        self.setState({
          newUserEmail: newEmail,
          newUserInfo: newUserInfo
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
    var addUserInput = !readOnly && (
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
        <BSListGroup>
          {users}
          {addUserInput}
        </BSListGroup>
      </div>
    );
  }
});

module.exports = UserList;
