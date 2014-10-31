var React = require("react");
var PropTypes = React.PropTypes;
var Link = require("react-router").Link;
var BSCol = require("react-bootstrap/Col");
var routes = require("dynamic-metadata").routes;

var PlaceHolder = React.createClass({

  propTypes : {
    displayName : PropTypes.string
  },

  render: function() {
    var name = this.props.displayName || this.props.name || "Empty";
    return (
      <BSCol md={12}>
        <h1>
          {name}
        </h1>
        This is a placeholder with no interesting content what so ever <Link to={routes.public.name}>Go to homepage.</Link>
      </BSCol>
    );
  }
});

module.exports = PlaceHolder;
