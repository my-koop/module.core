var React = require("react");
var Router = require("react-router");
var uiHookData = require("dynamic-metadata").uihooks;

var BSListGroup = require("react-bootstrap/ListGroup");
var BSListGroupItem = require("react-bootstrap/ListGroupItem");

var MKIcon = require("../Icon");

//FIXME: Core shouldn't have to know about this.
var MKPermissionWrapper = require("mykoop-user/components/PermissionWrapper");

var __ = require("language").__;


var SideBar = React.createClass({
  goToPage: function(key, link) {
    //FIXME: Category headers would toggle expand/collapse the subitems.
    // See https://github.com/my-koop/service.website/issues/146
    link && Router.transitionTo(link.to || link, link.params, link.query);
  },

  renderListGroupItems: function() {
    var self = this;

    if (!uiHookData) {
      return [];
    }

    var sideBar = uiHookData.sidebar || [];

    return _(sideBar)
    .sortBy("priority")
    .reduce(function(result, sideBarItem) {
      if (!sideBarItem.type || !sideBarItem.content) {
        console.warn("Invalid side bar item:", sideBarItem);
        return result;
      }

      var content = [];
      switch(sideBarItem.type) {
        case "item":
          content.push(
            self.renderListGroupItem(result.length + 1, sideBarItem)
          );

          if (sideBarItem.content.children) {
            content = content.concat(
              _(sideBarItem.content.children)
              .sortBy("priority")
              .map(function(sideBarSubItem, itemIndex) {
                return self.renderListGroupItem(
                  result.length + itemIndex + 2,
                  _.merge(
                    {permissions: sideBarItem.content.permissions},
                    sideBarSubItem
                  ),
                  true
                );
              })
              .value()
            );
          }
          break;

        case "custom":
          console.warn("The sidebar doesn't support custom components yet.");
      }

      return result.concat(content);
    }, []);
  },

  renderListGroupItem: function(key, item, isSubItem) {
    var content = item.content
    var link = content.link;
    var text = content.text;
    var computedLink = {};

    if (_.isString(link)) {
      computedLink = link;
    } else if(_.isFunction(link)) {
      computedLink = link()();
    } else if (_.isPlainObject(link)) {
      ["to", "params", "query"].forEach(function(prop) {
        computedLink[prop] = _.isFunction(link[prop]) ?
          link[prop]()() :
          link[prop];
      });
      computedLink = Router.makeHref(
        computedLink.to,
        computedLink.params,
        computedLink.query
      );
    } else {
      computedLink = "";
    }

    var render = (
      <BSListGroupItem
        key={key}
        className={isSubItem && "sub-list-group-item"}
        href={computedLink}
      >
        <MKIcon glyph={content.icon} fixedWidth />
        {" "}
        {_.isFunction(text) ? text()() : __(text)}
      </BSListGroupItem>
    );

    return item.permissions ? (
      <MKPermissionWrapper key={key} permissions={item.permissions}>
        {render}
      </MKPermissionWrapper>
    ) : render;
  },

  render : function() {
    return (
      <div className="sidebar col-md-2 col-sm-3">
        <BSListGroup onClick={this.goToPage}>
          {this.renderListGroupItems()}
        </BSListGroup>
      </div>
    );
  }
});

module.exports = SideBar;
