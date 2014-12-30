var React = require("react");
var Link = require("react-router").Link;
var BSCol = require("react-bootstrap/Col");

var ParentPlaceHolder = React.createClass({
  render: function() {
    return this.props.activeRouteHandler();
  }
});

module.exports = ParentPlaceHolder;
