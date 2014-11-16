var React = require("react");
var Router = require("react-router");
var routeData = require("dynamic-metadata").routes;
var configs = require("mykoop-config.json5");

var BSButton = require("react-bootstrap/Button");
var BSDropdownButton = require("react-bootstrap/DropdownButton");
var BSInput = require("react-bootstrap/Input");
var BSMenuItem = require("react-bootstrap/MenuItem");
var BSModalTrigger = require("react-bootstrap/ModalTrigger");
var BSNavbar = require("react-bootstrap/Navbar");
var BSNav = require("react-bootstrap/Nav");
var BSNavItem = require("react-bootstrap/NavItem");

var MKIcon = require("../Icon");
var MKLoginModal = require("mykoop-user/components/LoginModal");
var MKNavItemLink = require("../NavItemLink");

var actions = require("actions");
var localSession = require("session").local;
var website = require("website");

//To be removed after development.
//var MKDevMenu = require("components/DevMenu");

var language = require("language");

var PropTypes = React.PropTypes;


// NavigationBar
var NavBar = React.createClass({
  propTypes: {
    dashboard: React.PropTypes.bool,
  },

  getDefaultProps: function() {
    return {
      dashboard: false
    };
  },

  getInitialState: function() {
    return {
      isLoggedIn: false
    };
  },

  onFakeLogin: function(nowLoggedIn) {
    //var nowLoggedIn = typeof nowLoggedIn === "boolean" ? nowLoggedIn : !this.state.isLoggedIn;
    //this.setState({isLoggedIn: nowLoggedIn});

    //FIXME: Temporaily switch current language here...
    var currentLanguage = language.getLanguage();
    language.setLanguage(currentLanguage === "en" ? "fr" : "en");
  },

  //FIXME: Once it's possible, the user module alone should take care of this
  // logic. See https://github.com/my-koop/service.website/issues/185
  onLogout: function() {
    delete localSession.user;
    website.render();

    if (!actions.user.current.logout) {
      return;
    }

    // This is a fire and forget call to try to keep the backend in sync. No
    // error management is going to help us in production.
    actions.user.current.logout(function (err) {
      if (err) {
        console.error(err);
      }
    });

    //FIXME: Do instead.
    //this.setState({loggedIn: false});
  },

  onSearch: function(e) {
    e.preventDefault();
    Router.transitionTo(
      routeData.public.children.shop.name,
      {},
      {filter: this.refs.searchtext.getInputDOMNode().value}
    );
  },

  onMenuLogin: function() {
    this.refs.loginmodal.show();
  },

  render : function() {
    //FIXME: var isLoggedIn = this.state.isLoggedIn;
    var isLoggedIn = false;
    var userEmail = "";

    if (localSession.user) {
      isLoggedIn = true;
      userEmail = localSession.user.email;
    }

    var isInDashboard = this.props.dashboard;

    return (
      <div>
        {/*FIXME: Dummy span so we can use the modal trigger... :( */}
        <BSModalTrigger ref="loginmodal" modal={<MKLoginModal />}><span /></BSModalTrigger>
        <BSNavbar
          toggleNavKey={1}

          //FIXME: Tried to wrap this with a Router Link and had weird rendering
          // errors, will try again later. The point is to click on the logo and
          // get to the homepage as well.
          brand={<img
            src={configs.assetsUrl + "/coopbeciklogo.png"}
            title="Coop Bécik"
            alt="Coop Bécik logo"

            //FIXME: Remove after prototype.
            onClick={this.onFakeLogin}
          />}
          fixedTop
          fluid={this.props.dashboard}
        >
          <BSNav key={1} className="navbar-left">
            {isInDashboard ? [
              <MKNavItemLink key={10} to={routeData.public.name}>
                <MKIcon glyph="users" fixedWidth /> Members
              </MKNavItemLink>,
              <MKNavItemLink
                key={20}
                to={routeData.dashboard.children.inventory.children.items.name}
              >
                <MKIcon glyph="bicycle" fixedWidth /> Items
              </MKNavItemLink>,
              <MKNavItemLink key={30} to={routeData.public.name}>
                <MKIcon glyph="book" fixedWidth /> Invoices
              </MKNavItemLink>,
              <MKNavItemLink key={40} to={routeData.dashboard.children.events.name}>
                <MKIcon glyph="calendar" fixedWidth /> Events
              </MKNavItemLink>,
              <MKNavItemLink key={50} to={routeData.dashboard.children.stats.name}>
                <MKIcon glyph="files-o" fixedWidth /> Reports
              </MKNavItemLink>,
              <BSDropdownButton
                key={60}
                title={
                  <span>
                    <MKIcon glyph="bolt" fixedWidth /> Quick Actions
                  </span>
                }
              >
                <BSMenuItem
                  key={10}
                  onSelect={Router.transitionTo.bind(
                    null,
                    routeData.public.name
                  )}
                >
                  <MKIcon glyph="plus" fixedWidth /> Add Member
                </BSMenuItem>
                <BSMenuItem
                  key={20}
                  onSelect={Router.transitionTo.bind(
                    null,
                    routeData.dashboard.children.mailing.children.send.name
                  )}
                >
                  <MKIcon glyph="envelope" fixedWidth /> Send Mass Message
                </BSMenuItem>
              </BSDropdownButton>
            ] : [
              <MKNavItemLink key={10} to={routeData.public.name}>
                <MKIcon glyph="home" /> Homepage
              </MKNavItemLink>,
              <MKNavItemLink key={20} to={routeData.public.children.shop.name}>
                <MKIcon glyph="shopping-cart" /> Shop
              </MKNavItemLink>,
              <MKNavItemLink key={30} to={routeData.public.children.aboutus.name}>
                <MKIcon glyph="question" /> About Us
              </MKNavItemLink>,
              <form
                className="navbar-form navbar-left"
                onSubmit={this.onSearch}
              >
                <BSInput
                  ref="searchtext"
                  type="text"
                  placeholder="Search..."

                  //FIXME: Placeholder until
                  // https://github.com/react-bootstrap/react-bootstrap/issues/201
                  // or a workaround.
                  addonAfter={<MKIcon glyph="search"/>}
                />
              </form>
            ]}
          </BSNav>
          {/*FIXME: Hide on small viewports for now since it doesn't wrap.*/}
          <BSNav key={2} className="navbar-right hidden-xs">
            {isLoggedIn ?
              <BSDropdownButton
                //FIXME: Hardcoded, temporary "username".
                title={<span><MKIcon glyph="user" /> {userEmail}</span>}
              >
                <BSMenuItem
                  key={10}
                  onSelect={Router.transitionTo.bind(
                    null,
                    routeData.public.children.myaccount.name
                  )}
                >
                  <MKIcon glyph="cog" fixedWidth /> My account
                </BSMenuItem>
                <BSMenuItem key={20} divider />
                <BSMenuItem key={30} onSelect={this.onLogout}>
                  <MKIcon glyph="sign-out" fixedWidth /> Logout
                </BSMenuItem>
              </BSDropdownButton>
            :
              <BSNavItem onSelect={this.onMenuLogin}>
                <MKIcon library="glyphicon" glyph="log-in" /> Login
              </BSNavItem>
            }
            {!isLoggedIn ?
              <MKNavItemLink to={routeData.simple.children.register.name}>
                <MKIcon glyph="check" /> Register
              </MKNavItemLink>
            : null}
            {!isInDashboard ? [
              <MKNavItemLink to={routeData.public.name}>
                <MKIcon glyph="globe" /> French
              </MKNavItemLink>,
              <MKNavItemLink to={routeData.public.name}>
                <MKIcon glyph="question-circle" /> Help
              </MKNavItemLink>
            ] : null}
          </BSNav>

          {/* To be removed after development. */}
          {/*<MKDevMenu />*/}
        </BSNavbar>
      </div>
    );
  }
});

module.exports = NavBar;
