var React = require("react");

var BSCol = require("react-bootstrap/Col");

var MKPageWrapper = require("./PageWrapper");
var MKSideBar = require("../layout/SideBar");

var DashboardWrapper = React.createClass({
  render: function() {
    return (
      <MKPageWrapper dashboard>
        {/* Side bar. */}
        <BSCol md={2} style={{padding: 0}}>
          <MKSideBar />
        </BSCol>

        {/* Main dashboard content. */}
        <BSCol md={10}>
          {this.props.activeRouteHandler()}
        </BSCol>
      </MKPageWrapper>
    );
  }
});

module.exports = DashboardWrapper;
