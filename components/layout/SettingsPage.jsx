var React = require("react");

var BSButton = require("react-bootstrap/Button");

var MKCollapsablePanel = require("../CollapsablePanel");
var MKFeedbacki18nMixin = require("../Feedbacki18nMixin");

var __ = require("language").__;
var _ = require("lodash");
var actions = require("actions");
var traverse = require("traverse");

var metaData = require("dynamic-metadata");
var contributions = metaData.contributions && metaData.contributions.core || {};
var settingsContributions = _(contributions.settings)
.filter(function(contribution) {
  return contribution.titleKey && _.isFunction(contribution.component);
})
.sortBy("priority")
.map(function(contribution) {
  contribution.component = contribution.component();
  return contribution;
})
.value();

var SettingsPage = React.createClass({
  mixins: [MKFeedbacki18nMixin],

  getInitialState: function() {
    return {
      settingsRetrieved: false
    };
  },

  componentWillMount: function() {
    this.settingsGetters = [];
    this.retrieveSettings();
  },

  retrieveSettings: function() {
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
    var newSettings = _.merge.apply(_,
      _.map(this.settingsGetters, function(getter) {
        return getter();
      })
    );
    data = _.merge(newSettings, {keys: _.keys(newSettings).join(";")});
    self.setState({
      settings: newSettings
    });
    self.clearFeedback();
    actions.settings.set({
      i18nErrors: {},
      data: data,
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
        var component = contribution.component;
        return (
          <MKCollapsablePanel header={__(contribution.titleKey)} key={i}>
            <component
              settingsRaw={self.state.settings}
              addSettingsGetter={self.addSettingsGetter}
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
            <BSButton onClick={this.onSave} bsStyle="primary">
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
