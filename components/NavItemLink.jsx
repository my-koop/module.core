var React = require("react");
var Router = require("react-router");

var BSNavItem = require("react-bootstrap/NavItem");

var NavItemLink = React.createClass({
  mixins: [Router.ActiveState],

  getInitialState: function () {
    return {
      isActive: false
    };
  },

  updateActiveState: function() {
    this.setState({
      //isActive: false
      //FIXME: For now "/" is considered active when in "/users".
      //isActive: NavItemLink.isActive(this.props.to, this.props.params, this.props.query)
      isActive: this.props.to !== "home" &&
        NavItemLink.isActive(
          this.props.to,
          this.props.params,
          this.props.query
        )
    });
  },

  render: function() {
    return this.transferPropsTo(
      <BSNavItem
        active={this.state.isActive}
        onClick={this.handleClick}
        href={Router.makeHref(this.props.to, this.props.params, this.props.query)}
      >
        {this.props.children}
      </BSNavItem>
    );
  },

  handleClick: function(e) {
    e.preventDefault();

    if (this.props.onClick) {
      return this.props.onClick();
    }

    Router.transitionTo(this.props.to, this.props.params, this.props.query);
  }
});

module.exports = NavItemLink;
