var React = require("react");

var _ = require("lodash");

var RichTextBox = React.createClass({

  propTypes: {
    initialContent: React.PropTypes.string,
  },

  getDefaultProps: function() {
    return {
      id: "nicEditorArea",
      rows: 8
    }
  },

  nicEditorInstance: null,
  componentDidMount: function () {
    var self = this;
    require.ensure([], function(require) {
      // remove .min to debug, but icons won't show
      var nicEditor = require("exports?nicEditor!./vendor/nicEdit.min");
      var editor = new nicEditor({fullPanel: true});
      editor.addEvent("add", function(nicEditorInstance) {
        self.nicEditorInstance = nicEditorInstance;
      });
      editor.panelInstance(self.props.id);
    });
  },

  getText: function() {
    return this.nicEditorInstance ? this.nicEditorInstance.getContent() : "";
  },

  render: function() {
    var props = _.omit(this.props, "initialContent");
    return (
      <textarea
        {...props}
        onChange={this.onChange}
        defaultValue={this.props.initialContent}
      />
    );
  }
});

module.exports = RichTextBox;
