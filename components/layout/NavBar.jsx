var React = require("react/addons");
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

var DropdownButtonWrapper = React.createClass({
  componentDidMount: function() {
    this.checkIfNotEmpty();
  },

  componentDidUpdate: function() {
    this.checkIfNotEmpty();
  },

  componentWillReceiveProps: function() {
    this.setState({
      hidden: false
    });
  },

  getInitialState: function() {
    return {
      hidden: false
    };
  },

  checkIfNotEmpty: function() {
    var empty = false;

    if (this.getDOMNode().childNodes[1].childNodes[0].nodeName === "NOSCRIPT") {
      empty = true;
    }

    if (this.state.hidden !== empty) {
      this.setState({
        hidden: !this.state.hidden
      });
    }
  },

  render: function() {
    return React.addons.cloneWithProps(
      <BSDropdownButton
        className={this.state.hidden ? "hidden" : ""}
      >
        {this.props.children}
      </BSDropdownButton>,
      _.omit(this.props, ["children"])
    );
  }
});

// NavigationBar
var MKNavBar = React.createClass({
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

  renderMenuElement: function(icon, text, isSubMenu) {
    var showText = _.isFunction(text) ? text()() : __(text);

    return [
      <MKIcon
        key="icon"
        glyph={icon}
        fixedWidth
      />,
      <span className={!isSubMenu ? "hidden-sm" : ""}>
        {" " + showText}
      </span>
    ];
  },

  renderMenuLink: function(key, content, isSubMenu, extraClass) {
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
        className={extraClass}
      >
        {this.renderMenuElement(content.icon, content.text, isSubMenu)}
      </component>
    );
  },

  renderNavBarFromHookPoint: function (hookpoint, baseBarName, extraClass) {
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

    baseNavBar = baseNavBar ? _.cloneDeep(baseNavBar) : {};

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
                          self.navItemKey++,
                          navSubItem.content,
                          true,
                          extraClass
                        );
                      }
                    } else {
                      subContent = <BSMenuItem
                        className={extraClass}
                        key={self.navItemKey++}
                        divider
                      />;
                    }
                    break;

                  case "custom":
                    // We expect a component getter built from a resolve
                    // descriptor.
                    subContent = navSubItem.content()({key: self.navItemKey++});
                    break;

                  default:
                    console.warn(
                      "Invalid sub-navigation item type:",
                      navSubItem.type
                    );
                }

                return self.wrapWithPermissions(
                  self.navItemKey++,
                  subContent,
                  navSubItem.permissions
                );
              })
              .value();

              content = (
                <DropdownButtonWrapper
                  className={extraClass}
                  key={self.navItemKey++}
                  title={self.renderMenuElement(
                    navItem.content.icon,
                    navItem.content.text
                  )}
                >
                  {childrenContent}
                </DropdownButtonWrapper>
              );
            } else {
              content = self.renderMenuLink(self.navItemKey++, navItem.content, false, extraClass);
            }
            break;

          case "custom":
            // We expect a component getter built from a resolve descriptor.
            content = navItem.content()({className: extraClass, key: self.navItemKey++});
            break;

          default:
            console.warn("Invalid navigation item type:", navItem.type);
        }

        return self.wrapWithPermissions(
          self.navItemKey++,
          content,
          navItem.permissions
        );
      }
    )
    .value();
  },

  renderSecondaryBar: function(extraClass) {
    var isInDashboard = this.props.dashboard;
    return [
      <BSNavItem
        className={extraClass}
        onSelect={this.onLanguageToggle}
        key="language"
      >
        <MKIcon glyph="globe" />{" "}
        {/*FIXME: Support more than one language.*/}
        {__("language::name", {lng: language.getAlternateLanguages()[0]})}
      </BSNavItem>
    ].concat(
      isInDashboard ?
        this.renderNavBarFromHookPoint(
          "navbar_secondary_dashboard",
          "navbar_secondary",
          extraClass
        ) :
        this.renderNavBarFromHookPoint(
          "navbar_secondary_public",
          "navbar_secondary",
          extraClass
        )
    );
  },

  navItemKey: 0,
  render : function() {
    var isInDashboard = this.props.dashboard;
    this.navItemKey = 0;
    return (
      <BSNavbar
        toggleNavKey={1}
        key="mainNavBar"
        brand={<img
          src={configs.assetsUrl + "/coopbeciklogo.png"}
          className="pointer"
          title="Coop Bécik"
          alt="Coop Bécik logo"
          key="logo"
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
          {/*FIXME::Remove once toggleNavKey*/}
          {this.renderSecondaryBar("visible-xs")}
        </BSNav>
        {/*FIXME: Hide on small viewports for now since it doesn't wrap.*/}
        <BSNav key={2} className="navbar-right hidden-xs">
          {this.renderSecondaryBar()}
        </BSNav>

        {/* To be removed after development. */}
        {/*<MKDevMenu />*/}
      </BSNavbar>
    );
  }
});

module.exports = MKNavBar;
