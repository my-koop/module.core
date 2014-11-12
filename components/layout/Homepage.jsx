var React = require("react");
var Link = require("react-router").Link;
var BSCol = require("react-bootstrap/Col");
var BSButton = require("react-bootstrap/Button");
var BSModal = require("react-bootstrap/Modal");
var BSModalTrigger = require("react-bootstrap/ModalTrigger");

var MKLoginModal          = require("mykoop-user/components/LoginModal");
var MKUserPrivilegesModal = require("components/UserPrivilegesModal");
var MKMailingSendModal = require("components/MailingListSendModal");

var __ = require("language").__;

var Homepage = React.createClass({

  render: function() {
    return (
      <BSCol md={6} mdOffset={3}>
        <h3>
          {__("welcome")}
        </h3>
        <p>
          {__("homeMessage")}
        </p>
      </BSCol>
    );
  }

});

module.exports = Homepage;
