var React = require("react");

var BSGrid = require("react-bootstrap/Grid");
var BSRow = require("react-bootstrap/Row");

var MKFooter = require("../layout/Footer");
var MKNavBar = require("../layout/NavBar");

var PageWrapper = React.createClass({
  propTypes: {
    dashboard: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      dashboard: false
    };
  },

  render: function() {
    return (
      <div>
        {/* Navigation bar. */}
        <BSRow key="topNavBar">
          <MKNavBar dashboard={this.props.dashboard} />
        </BSRow>
        <BSGrid fluid={this.props.dashboard}>
          {/* Main site content. */}
          <BSRow key="mainContent">
            {this.props.children}
          </BSRow>

          {/* Footer. */}
          <BSRow key="footer">
            <MKFooter />
          </BSRow>
        </BSGrid>
      </div>
    );
  }
});

module.exports = PageWrapper;
