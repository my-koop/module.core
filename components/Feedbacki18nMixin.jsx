var React = require('react');

var MKAlert = require("./Alert");
var __ = require("language").__;
var _ = require("lodash");

module.exports = {
  getInitialState: function() {
    return {
      __feedback: null
    };
  },

  setFeedback: function(feedbackList, style) {
    this.setState({
      __feedback: {
        i18n: _.toArray(feedbackList),
        style: style
      }
    });
  },

  clearFeedback: function() {
    this.setState({
      __feedback: null
    });
  },

  getFeedback: function(alertProps) {
    if(_.isEmpty(this.state.__feedback)) {
      return null;
    }

    var feedback = _.map(this.state.__feedback.i18n, function(f, i) {
      return <div key={i}>{__(f.key, _.omit(f, "key"))}</div>;
    });

    return (
      <MKAlert
        onHide={this.clearFeedback}
        bsStyle={this.state.__feedback.style}
        {...alertProps}
      >
        {feedback}
      </MKAlert>
    );
  }
}
