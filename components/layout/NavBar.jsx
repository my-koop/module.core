var React = require("react");
var Router = require("react-router");
var uiHookData = require("dynamic-metadata").uihooks;
var configs = require("mykoop-config.json5");

var _ = require("lodash");

var BSDropdownButton = require("react-bootstrap/DropdownButton");
var BSMenuItem = require("react-bootstrap/MenuItem");
var BSNavbar = require("react-bootstrap/Navbar");
var BSNav = require("react-bootstrap/Nav");
var BSNavItem = require("react-bootstrap/NavItem");

var MKIcon = require("../Icon");
var MKMenuItemLink = require("../MenuItemLink");
var MKNavItemLink = require("../NavItemLink");

//FIXME: Core shouldn't have to know about this.
var MKPermissionWrapper = require("mykoop-user/components/PermissionWrapper");

//To be removed after development.
//var MKDevMenu = require("components/DevMenu");

var language = require("language");
var __ = language.__;

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

  wrapWithPermissions: function(key, content, permissions) {
    return content && permissions ? (
      <MKPermissionWrapper key={key} permissions={permissions}>
        {content}
      </MKPermissionWrapper>
    ) : content;
  },

  renderMenuElement: function(icon, text) {
    var showText = _.isFunction(text) ? text()() : __(text);

    return [
      <MKIcon
        key="icon"
        glyph={icon}
        fixedWidth
      />,
      " " + showText
    ];
  },

  renderMenuLink: function(key, content, isSubMenu) {
    var component = isSubMenu ? MKMenuItemLink : MKNavItemLink;
    var link = content.link;
    var computedLink = {};

    if (_.isString(link)) {
      computedLink.to = link;
    } else if(_.isFunction(link)) {
      computedLink.to = link()();
    } else if (_.isPlainObject(link)) {
      ["to", "params", "query"].forEach(function(prop) {
        computedLink[prop] = _.isFunction(link[prop]) ?
          link[prop]()() :
          link[prop];
      });
      computedLink.onClick = _.isFunction(link.onClick) ?
          link.onClick() :
          link.onClick;
    }

    return (
      <component
        key={key}
        onClick={computedLink.onClick}
        to={computedLink.to}
        params={computedLink.params}
        query={computedLink.query}
      >
        {this.renderMenuElement(content.icon, content.text)}
      </component>
    );
  },

  renderNavBarFromHookPoint: function (hookpoint, baseBarName) {
    var self = this;

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
    .sortBy("priority")
    .map(function (navItem, itemIndex) {
        if (!navItem.type || !navItem.content) {
          console.warn("Invalid navigation item:", navItem);
          return null;
        }

        var content = null;
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

                var subContent = null;
                switch(navSubItem.type) {
                  case "item":
                    if (navSubItem.content) {
                      if(navSubItem.content.children) {
                        console.warn(
                          "Nesting beyond two levels is not supported yet."
                        );
                      } else {
                        subContent = self.renderMenuLink(
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
                }

                return self.wrapWithPermissions(
                  subItemIndex,
                  subContent,
                  navSubItem.permissions
                );
              })
              .value();

              content = (
                <BSDropdownButton
                  key={itemIndex}
                  title={self.renderMenuElement(
                    navItem.content.icon,
                    navItem.content.text
                  )}
                >
                  {childrenContent}
                </BSDropdownButton>
              );
            } else {
              content = self.renderMenuLink(itemIndex, navItem.content);
            }
            break;

          case "custom":
            // We expect a component getter built from a resolve descriptor.
            content = navItem.content()();
            break;

          default:
            console.warn("Invalid navigation item type:", navItem.type);
        }

        return self.wrapWithPermissions(
          itemIndex,
          content,
          navItem.permissions
        );
      }
    )
    .value();
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
              this.renderNavBarFromHookPoint("navbar_main_dashboard") :
              this.renderNavBarFromHookPoint("navbar_main_public")
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
              this.renderNavBarFromHookPoint(
                "navbar_secondary_dashboard",
                "navbar_secondary"
              ) :
              this.renderNavBarFromHookPoint(
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
