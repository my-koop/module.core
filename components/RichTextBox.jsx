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
      initialContent: "test <b>content</b>"
    }
  },

  editor: null,
  instance: null,
  componentDidMount: function () {
    var self = this;
    require.ensure([], function(require) {
      var nicEditor = require("exports?nicEditor!./nicEdit");
      self.editor = new nicEditor({fullPanel: false})
      console.log(self.editor);
      self.editor.addEvent("add", function() {
          self.instance = self.editor.instanceById(self.props.textAreaId);
          console.log( self.instance.getContent() );
        });
      self.editor.panelInstance(self.props.textAreaId);

      /*self.editor;
      self.instance = self.editor.instanceById(self.props.textAreaId);
      console.log( self.instance.getContent() );
*/
    });
  },

  onChange: function(value) {
    console.log(value);
  },

  render: function() {
    var props = _.omit(this.props, "textAreaId", "initialContent");
    return (
      <textarea
        {...props}
        id={this.props.textAreaId}
        onChange={this.onChange}
        style={{width: "100%"}}
        defaultValue={this.props.initialContent}
      />
    );
  }
});

module.exports = PageWrapper;
