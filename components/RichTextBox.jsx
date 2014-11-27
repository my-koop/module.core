var React = require("react");

var _ = require("lodash");

var PageWrapper = React.createClass({

  propTypes: {
    initialContent: React.PropTypes.string,
    textAreaId: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      textAreaId: "nicEditorArea",
      initialContent: ""
    }
  },

  editor: null,
  instance: null,
  componentDidMount: function () {
    var self = this;
    require.ensure([], function(require) {
      // remove .min to debug, but icons won't show
      var nicEditor = require("exports?nicEditor!./nicEdit/nicEdit.min");
      self.editor = new nicEditor({fullPanel: true})
      self.editor.addEvent("add", function(instance) {
        self.instance = instance;
      });
      self.editor.panelInstance(self.props.textAreaId);
    });
  },

  getText: function() {
    return this.instance ? this.instance.getContent() : "";
  },

  render: function() {
    var props = _.omit(this.props, "textAreaId", "initialContent");
    return (
      <textarea
        {...props}
        id={this.props.textAreaId}
        onChange={this.onChange}
        defaultValue={this.props.initialContent}
      />
    );
  }
});

module.exports = PageWrapper;
