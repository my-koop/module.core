var React = require("react");

var BSCol = require("react-bootstrap/Col");

var MKPageWrapper = require("./PageWrapper");
var MKSideBar = require("../layout/SideBar");

var DashboardWrapper = React.createClass({
  render: function() {
    return (
      <MKPageWrapper dashboard>
        {/* Side bar. */}
        <BSCol>
          <MKSideBar />
        </BSCol>

        {/* Main dashboard content. */}
        <BSCol
          mdOffset={2}
          md={10}
          smOffset={3}
          sm={9}
          className="dashboard-content"
        >
          {this.props.activeRouteHandler()}
        </BSCol>
      </MKPageWrapper>
    );
  }
});

module.exports = DashboardWrapper;
