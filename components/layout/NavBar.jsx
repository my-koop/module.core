var React = require("react");
var Router = require("react-router");
var dynamicMetaData = require("dynamic-metadata");
var routeData = dynamicMetaData.routes;
var uiHookData = dynamicMetaData.uihooks;
var configs = require("mykoop-config.json5");

var _ = require("lodash");

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

//FIXME: Core shouldn't have to know about this.
var MKPermissionWrapper = require("mykoop-user/components/PermissionWrapper");

var actions = require("actions");
var getRouteName = require("mykoop-utils/frontend/getRouteName");
var localSession = require("session").local;
var website = require("website");

//To be removed after development.
//var MKDevMenu = require("components/DevMenu");

var language = require("language");
var __ = language.__;

var PropTypes = React.PropTypes;

var navBarHookPointsCache = {};

function makeMenuElement(icon, i18n) {
  return [
    <MKIcon
      key="icon"
      glyph={icon}
      fixedWidth
    />,
    " " + __(i18n)
  ];
}

function navBarFromHookPoint(hookpoint) {
  if (!uiHookData) {
    return [];
  }

  if (navBarHookPointsCache[hookpoint]) {
    return navBarHookPointsCache[hookpoint];
  }

  var navBar = uiHookData.navbar_main || {};

  // Generate nav bar.
  return navBarHookPointsCache[hookpoint] = _(navBar)
  .merge(uiHookData[hookpoint])
  .sortBy("priority").map(
    function (navItem, itemIndex) {
      if (!navItem.type || !navItem.content) {
        console.warn("Invalid navigation item:", navItem);
        return null;
      }

      var content;
      switch(navItem.type) {
        case "item":
          if (navItem.content.children) {
            var childrenContent = _(navItem.content.children)
            .sortBy("priority")
            .map(function (navSubItem, subItemIndex) {
              if (!navSubItem.type || !navSubItem.content) {
                console.warn("Invalid sub-navigation item:", navSubItem);
                return null;
              }

              var subContent;
              switch(navSubItem.type) {
                case "item":
                  if (navSubItem.content.children) {
                    console.warn(
                      "Nesting beyond two levels is not supported yet."
                    );
                    subContent = null;
                  } else {
                    subContent = (
                      <BSMenuItem
                        key={subItemIndex}
                        onSelect={Router.transitionTo.bind(
                          null,
                          navSubItem.content.link.name || 
                          navSubItem.content.link,
                          navSubItem.content.link.params,
                          navSubItem.content.link.query
                        )}
                      >
                        {makeMenuElement(
                          navSubItem.content.icon,
                          navSubItem.content.i18n
                        )}
                      </BSMenuItem>
                    );
                  }
                  break;

                case "custom":
                  // We expect a component getter built from a resolve descriptor.
                  subContent = navSubItem.content();
                  break;

                default:
                  console.warn(
                    "Invalid sub-navigation item type:",
                    navSubItem.type
                  );
                  subContent = null;
              }

              return subContent && navSubItem.permissions ? (
                <MKPermissionWrapper permissions={navSubItem.permissions}>
                  {subContent}
                </MKPermissionWrapper>
              ) : subContent;
            })
            .value();

            content = (
              <BSDropdownButton
                key={itemIndex}
                title={makeMenuElement(
                  navItem.content.icon,
                  navItem.content.i18n
                )}
              >
                {childrenContent}
              </BSDropdownButton>
            );
          } else {
            content = (
              <MKNavItemLink
                key={itemIndex}
                to={navItem.content.link.name || navItem.content.link}
                params={navItem.content.link.params}
                query={navItem.content.link.query}
              >
                {makeMenuElement(navItem.content.icon, navItem.content.i18n)}
              </MKNavItemLink>
            );
          }
          break;

        case "custom":
          // We expect a component getter built from a resolve descriptor.
          content = navItem.content();
          break;

        default:
          console.warn("Invalid navigation item type:", navItem.type);
          content = null;
      }

      return content && navItem.permissions ? (
        <MKPermissionWrapper permissions={navItem.permissions}>
          {content}
        </MKPermissionWrapper>
      ) : content;
    }
  )
  .value();
}


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

  onLanguageToggle: function() {
    var currentLanguage = language.getLanguage();
    language.setLanguage(language.getAlternateLanguages()[0]);
  },

  //FIXME: Once it's possible, the user module alone should take care of this
  // logic. See https://github.com/my-koop/service.website/issues/185
  onLogout: function() {
    delete localSession.user;
    website.render();

    if (!actions.user) {
      return;
    }

    // This is a fire and forget call to try to keep the backend in sync. No
    // error management is going to help us in production.
    actions.user.current.logout(function (err) {
      if (err) {
        console.error(err);
      }
    });
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

  redirectToHomepage: function() {
    Router.transitionTo(getRouteName(["public"]));
  },

  render : function() {
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
          brand={<img
            src={configs.assetsUrl + "/coopbeciklogo.png"}
            className="pointer"
            title="Coop Bécik"
            alt="Coop Bécik logo"
            onClick={this.redirectToHomepage}
          />}
          fixedTop
          fluid={this.props.dashboard}
        >
          <BSNav key={1} className="navbar-left">
            {isInDashboard ?
              navBarFromHookPoint("navbar_main_dashboard")
              /*
              [
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
              ]
              */
             : [
              // navBarFromHookPoint("navbar_main_public")
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
                key="searchform"
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
            <BSNavItem onSelect={this.onLanguageToggle} key="language">
              <MKIcon glyph="globe" />{" "}
              {/*FIXME: Support more than one language.*/}
              {__("language::name", {lng: language.getAlternateLanguages()[0]})}
            </BSNavItem>
            {isLoggedIn ?
              <BSDropdownButton
                key="usermenu"
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
            : [
              <MKNavItemLink
                to={routeData.simple.children.register.name}
                key={1}
              >
                <MKIcon glyph="check" /> Register
              </MKNavItemLink>,
              <BSNavItem onSelect={this.onMenuLogin} key={2}>
                <MKIcon library="glyphicon" glyph="log-in" /> Login
              </BSNavItem>
            ]}
          </BSNav>

          {/* To be removed after development. */}
          {/*<MKDevMenu />*/}
        </BSNavbar>
      </div>
    );
  }
});

module.exports = NavBar;
