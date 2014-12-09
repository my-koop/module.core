var React = require("react");

var __ = require("language").__;

var Homepage = React.createClass({

  render: function() {
    return (
      <div>
        <h1>
          {__("aboutus")}
        </h1>
        <p>
          {__("aboutUsMessage")}
        </p>
        <p>
          {__("poweredBy")}
          <a href="https://github.com/my-koop">
            My Koop
          </a>.
        </p>
      </div>
    );
  }

});

module.exports = Homepage;
