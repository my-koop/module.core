﻿var React = require("react");
var Router = require("react-router");
var routeData = require("dynamic-metadata").routes;

var BSCol = require("react-bootstrap/Col");
var BSRow = require("react-bootstrap/Row");

var MKLogo = require("../Logo");
var MKFooter = require("../layout/Footer");

var RRLink = Router.Link;

var style = require("../../styles/grayBg.useable.less");

var SimplePage = React.createClass({
  componentDidMount: function(){
    style.use();
  },

  componentWillUnmount : function(){
    style.unuse();
  },

  render: function() {
    return (
      <div>
        <BSRow className="top-margin-10">
          <BSCol xs={12} sm={6} md={3} className="col-center-block">
            <RRLink to={routeData.public.name}><MKLogo /></RRLink>
          </BSCol>
        </BSRow>
        <BSRow className="top-margin-20">
          <div className="text-center">
            <RRLink to={routeData.public.name}>Back to homepage</RRLink>
          </div>
        </BSRow>
        <BSRow className="top-margin-20">
          <BSCol sm={6} md={4} className="col-center-block">
            {this.props.activeRouteHandler()}
          </BSCol>
        </BSRow>
        <BSRow>
          <MKFooter />
        </BSRow>
      </div>
    );
  }
});

module.exports = SimplePage;
