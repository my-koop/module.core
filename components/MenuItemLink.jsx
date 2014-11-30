var React = require("react");
var Router = require("react-router");
var BSMenuItem = require("react-bootstrap/MenuItem");

var MenuItemLink = React.createClass({
  mixins: [Router.ActiveState],

  propTypes: {
    to: React.PropTypes.string
  },

  getInitialState: function () {
    return {
      isActive: false
    };
  },

  updateActiveState: function() {
    this.setState({
      //isActive: false
      //FIXME: For now "/" is considered active when in "/users".
      isActive: MenuItemLink.isActive(this.props.to, this.props.params, this.props.query)
    });
  },

  render: function() {
    return this.transferPropsTo(
      <BSMenuItem
        onSelect={this.handleClick}
      >
        {this.props.children}
      </BSMenuItem>
    );
  },

  handleClick: function() {
    if (this.props.onClick) {
      return this.props.onClick();
    }

    Router.transitionTo(this.props.to, this.props.params, this.props.query);
  }
});

module.exports = MenuItemLink;
