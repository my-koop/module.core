var React = require("react");

var MKFeedbacki18nMixin = require("./Feedbacki18nMixin");
var MKUserList          = require("./UserList");

var _ = require("lodash");
var actions = require("actions");

var UserListWrapper = React.createClass({
  mixins: [MKFeedbacki18nMixin],
  propTypes: {
    noAdd: React.PropTypes.bool,
    noDelete: React.PropTypes.bool,
    retrieveUsers: React.PropTypes.func.isRequired,
    onAddUser: React.PropTypes.func,
    onDeleteUser: React.PropTypes.func,
  },

  getInitialState: function() {
    return {
      users: [],
      isReady: false
    };
  },

  componentWillMount: function () {
    var self = this;
    this.props.retrieveUsers(function(err, users) {
      if(err) {
        return self.setFeedback(err.i18n, "danger");
      }
      self.setState({
        users: users,
        isReady: true
      });
    })
  },

  onAdd: function(user) {
    var self = this;
    this.clearFeedback();
    this.props.onAddUser(user, function(err) {
      if(err) {
        return self.setFeedback(err.i18n, "danger");
      }
      var users = self.state.users;
      users.push(user);
      self.setState({
        users: users
      });
    });
  },

  onDelete: function(user) {
    var self = this;
    this.clearFeedback();
    this.props.onDeleteUser(user, function(err) {
      if(err) {
        return self.setFeedback(err.i18n, "danger");
      }
      var users = self.state.users;
      users = _.reject(users, function(_user) {
        return _user.id == user.id
      });
      self.setState({
        users: users
      });
    });
  },

  render: function() {
    var userList = null;
    if(this.state.isReady) {
      userList = <MKUserList
        userList={this.state.users}
        noAdd={this.props.noAdd || !this.props.onAddUser}
        noDelete={this.props.noDelete || !this.props.onDeleteUser}
        onAddUser={this.onAdd}
        onDeleteUser={this.onDelete}
      />
    }
    return (
      <div>
        {this.renderFeedback()}
        {userList}
      </div>
    );
  }
});

module.exports = UserListWrapper;
