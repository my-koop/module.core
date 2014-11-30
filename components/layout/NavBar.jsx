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
var BSNavbar = require("react-bootstrap/Navbar");
var BSNav = require("react-bootstrap/Nav");
var BSNavItem = require("react-bootstrap/NavItem");

var MKIcon = require("../Icon");
var MKMenuItemLink = require("../MenuItemLink");
var MKNavItemLink = require("../NavItemLink");

//FIXME: Core shouldn't have to know about this.
var MKPermissionWrapper = require("mykoop-user/components/PermissionWrapper");

var actions = require("actions");
var localSession = require("session").local;
var website = require("website");

//To be removed after development.
//var MKDevMenu = require("components/DevMenu");

var language = require("language");
var __ = language.__;

var PropTypes = React.PropTypes;

function makeMenuElement(icon, text) {
  var showText = _.isFunction(text) ? text()() : __(text);

  return [
    <MKIcon
      key="icon"
      glyph={icon}
      fixedWidth
    />,
    " " + showText
  ];
}

function makeMenuLink(key, content, isSubMenu) {
  var component = isSubMenu ? MKMenuItemLink : MKNavItemLink;
  var link = content.link;
  var computedLink = {};

  if (_.isString(link)) {
    computedLink.to = link;
  } else if(_.isFunction(link)) {
    computedLink.to = link();
  } else if (_.isPlainObject(link)) {
    ["to", "params", "query"].forEach(function(prop) {
      computedLink[prop] = _.isFunction(link[prop]) ? link[prop]() : link[prop];
    });
  }

  return (
    <component
      key={key}
      to={computedLink.to}
      params={computedLink.params}
      query={computedLink.query}
    >
      {makeMenuElement(content.icon, content.text)}
    </component>
  );
}

function navBarFromHookPoint(hookpoint, baseBarName) {
  if (!uiHookData) {
    return [];
  }

  baseBarName = baseBarName || "navbar_main";
  var baseNavBar = uiHookData[baseBarName];
  var navBar = uiHookData[hookpoint];

  if (!baseNavBar && !navBar) {
    return [];
  }

  baseNavBar = baseNavBar || {};

  // Generate nav bar.
  return _(baseNavBar)
  .merge(navBar)
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
              if (!navSubItem.type) {
                console.warn("Invalid sub-navigation item:", navSubItem);
                return null;
              }

              var subContent;
              switch(navSubItem.type) {
                case "item":
                  if (navSubItem.content) {
                    if(navSubItem.content.children) {
                      console.warn(
                        "Nesting beyond two levels is not supported yet."
                      );
                      subContent = null;
                    } else {
                      subContent = makeMenuLink(
                        subItemIndex,
                        navSubItem.content,
                        true
                      );
                    }
                  } else {
                    subContent = <BSMenuItem key={subItemIndex} divider />;
                  }
                  break;

                case "custom":
                  // We expect a component getter built from a resolve
                  // descriptor.
                  subContent = navSubItem.content()();
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
                  navItem.content.text
                )}
              >
                {childrenContent}
              </BSDropdownButton>
            );
          } else {
            content = makeMenuLink(itemIndex, navItem.content);
          }
          break;

        case "custom":
          // We expect a component getter built from a resolve descriptor.
          content = navItem.content()();
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

  redirectToHomepage: function() {
    Router.transitionTo("home");
  },

  render : function() {
    var isInDashboard = this.props.dashboard;

    return (
      <div>
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
              navBarFromHookPoint("navbar_main_dashboard") :
              navBarFromHookPoint("navbar_main_public")
            }
          </BSNav>
          {/*FIXME: Hide on small viewports for now since it doesn't wrap.*/}
          <BSNav key={2} className="navbar-right hidden-xs">
            <BSNavItem onSelect={this.onLanguageToggle} key="language">
              <MKIcon glyph="globe" />{" "}
              {/*FIXME: Support more than one language.*/}
              {__("language::name", {lng: language.getAlternateLanguages()[0]})}
            </BSNavItem>
            {isInDashboard ?
              navBarFromHookPoint(
                "navbar_secondary_dashboard",
                "navbar_secondary"
              ) :
              navBarFromHookPoint(
                "navbar_secondary_public",
                "navbar_secondary"
              )
            }
          </BSNav>

          {/* To be removed after development. */}
          {/*<MKDevMenu />*/}
        </BSNavbar>
      </div>
    );
  }
});

module.exports = NavBar;
