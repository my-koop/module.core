var React = require("react");

var MKCollapsablePanel = require("../CollapsablePanel");
var MKFeedbacki18nMixin = require("../Feedbacki18nMixin");

var _ = require("lodash");
var actions = require("actions");
var traverse = require("traverse");

var coreMeta = require("dynamic-metadata").core;
var contributions = coreMeta && coreMeta.contributions;
var settingsContributions = _.toArray(
  contributions && contributions.settings
).filter(function(contribution) {
  return contribution.titleKey && _.isFunction(contribution.component);
}).map(function(contribution) {
  contribution.component = contribution.component();
  return contribution;
});

var SettingsPage = React.createClass({
  mixins: [MKFeedbacki18nMixin],

  getInitialState: function() {
    return {
      settingsRetrieved: false
    };
  },

  componentWillMount: function() {
    var self = this;
    actions.settings.get({
      i18nErrors: {},
    }, function(err, settings) {
      if(err) {
        return self.setFeedback(err.i18n, "danger");
      }
      self.setState({
        settingsRetrieved: true,
        settings: settings
      });
    });
  },

  onSave: function() {
    var self = this;
    self.clearFeedback();
    var data = _.merge.apply(
      [{}].concat(_.map(this.settingsGetters, function(getter) {
        return getter();
      }))
    );
    actions.settings.save({
      i18nErrors: {},
      data: this.state.settings,
    }, function(err) {
      if(err) {
        return self.setFeedback(err.i18n, "danger");
      }
      return self.setFeedback({key: "success"}, "success");
    });
  },

  settingsGetters: [],
  addSettingsGetter: function(settingsGetter) {
    if(_.isFunction(settingsGetter)) {
      return this.settingsGetters.push(settingsGetter);
    }
    console.warn(new Error("Settings getter is not a function"));
  },

  render: function() {
    var self = this;
    var panels = function() {
      return _.map(settingsContributions, function(contribution, i) {
        var Component = contribution.component;
        return (
          <MKCollapsablePanel header={__(contribution.titleKey)} key={i}>
            <Component
              settingsRaw={self.state.settings}
              addSettingsGetter={addSettingsGetter}
            />
          </MKCollapsablePanel>
        );
      });
    }
    return (
      <div>
        {this.renderFeedback()}
        <h1>
          {__("settingsPage")}
        </h1>
        {this.state.settingsRetrieved ?
          <div>
            <BSButton onClick={this.onSave}>
              {__("update")}
            </BSButton>
            {panels()}
          </div>
        : null}
      </div>
    );
  }
});

module.exports = SettingsPage;
