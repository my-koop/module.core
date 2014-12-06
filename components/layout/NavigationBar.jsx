var React = require("react");
var Router = require("react-router");

var BSNavbar = require("react-bootstrap/Navbar");
var BSNav = require("react-bootstrap/Nav");

var MKNavItemLink = require("../NavItemLink");

var ajax = require("ajax");

var PropTypes = React.PropTypes;



// NavigationBar
var NavigationBar = React.createClass({
  propTypes: {
    links: PropTypes.array,
    contentUrl : PropTypes.string.isRequired
  },

  getInitialState: function () {
    return {
      links: []
    };
  },

  componentDidMount: function () {
    var self = this;

    ajax.request(
      {endpoint: this.props.contentUrl},
      function (err, body) {
        if (err) {
          console.error(this.props.contentUrl, status, err.toString());
          return;
        }

        if (body.links) {
          self.setState(body);
        }
      }
    );
  },
  render : function() {
    var links = this.state.links.map(function(link, index) {
      try {
        var href = Router.makeHref(link.url, link.params, link.query);
      } catch (e) {
        return;
      }
      return (
        <MKNavItemLink
          key={index}
          to={link.url}
          params={link.params}
          query={link.query}
          href={href}
        >
          {link.name}
        </MKNavItemLink>
      );
    });
    return (
      <div>
        <BSNavbar toggleNavKey={1}>
          <BSNav key={1}>
            {links}
          </BSNav>
        </BSNavbar>
      </div>
    );
  }
});

module.exports = NavigationBar;
