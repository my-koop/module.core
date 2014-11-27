var React = require("react");

var BSGrid = require("react-bootstrap/Grid");
var BSRow = require("react-bootstrap/Row");
var BSPanel = require("react-bootstrap/Panel");

var MKFooter = require("../layout/Footer");
var MKNavBar = require("../layout/NavBar");

var rtb = require("../RichTextBox");

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
        <BSRow>
          <MKNavBar dashboard={this.props.dashboard} />
        </BSRow>
        <BSGrid fluid={this.props.dashboard}>
          {/* Main site content. */}
          <BSRow>
            <BSPanel>
              <rtb />
            </BSPanel>
            {this.props.children}
          </BSRow>

          {/* Footer. */}
          <BSRow>
            <MKFooter />
          </BSRow>
        </BSGrid>
      </div>
    );
  }
});

module.exports = PageWrapper;
