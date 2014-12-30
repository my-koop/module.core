var React = require("react");

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
    if(!_.isArray(feedbackList)) {
      feedbackList = [feedbackList]
    }
    this.setState({
      __feedback: {
        i18n: feedbackList,
        style: style
      }
    });
  },

  clearFeedback: function() {
    this.setState({
      __feedback: null
    });
  },

  renderFeedback: function(alertProps) {
    if(_.isEmpty(this.state.__feedback)) {
      return null;
    }

    var feedback = null;
    var length = this.state.__feedback.i18n.length;
    if(length === 1) {
      var f = this.state.__feedback.i18n[0];
      feedback = __(f.key, _.omit(f, "key"));
    } else if(length > 0) {
      feedback = _.map(this.state.__feedback.i18n, function(f, i) {
        return <li key={i}>{__(f.key, _.omit(f, "key"))}</li>;
      });
      feedback = <ul className="alert-list">{feedback}</ul>;
    }

    return (
      <MKAlert
        key="i18nFeedback"
        onHide={this.clearFeedback}
        bsStyle={this.state.__feedback.style}
        {...alertProps}
      >
        {feedback}
      </MKAlert>
    );
  }
}
