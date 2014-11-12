var React = require("react");
var configs = require("mykoop-config.json5");

var Logo = React.createClass({
  propTypes: {
    responsive: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      responsive: true
    };
  },

  render : function() {
    return (
      <img
        className={this.props.responsive ? "img-responsive" : ""}
        src={configs.assetsUrl + "/coopbeciklogo.png"}
        title="Coop Bécik"
        alt="Coop Bécik logo"
      />
    );
  }
});

module.exports = Logo;
