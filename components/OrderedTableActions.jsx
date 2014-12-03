var React = require("react");

var MKListModButtons = require("./ListModButtons");

var _ = require("lodash");
var __ = require("language").__;

var OrderedTableActions = React.createClass({

  propTypes: {
    content: React.PropTypes.array.isRequired,
    index: React.PropTypes.number.isRequired,
    onContentModified: React.PropTypes.func.isRequired,

    deleteExtraConfig: React.PropTypes.object,
    upExtraConfig: React.PropTypes.object,
    downExtraConfig: React.PropTypes.object
  },

  render: function () {
    var content = this.props.content;
    var iContent = this.props.index;
    var length = content.length;
    var onContentModified = this.props.onContentModified;
    // Delete button
    var actionButtons = [
      {
        icon: "remove",
        tooltip: __("remove"),
        warningMessage: __("areYouSure"),
        callback: function() {
          content.splice(iContent, 1);
          onContentModified(content);
        }
      },
      {
        icon: "arrow-up",
        tooltip: __("moveUp"),
        hide: iContent === 0,
        callback: function() {
          content.splice(iContent - 1, 0, content.splice(iContent, 1)[0]);
          onContentModified(content);
        }
      },
      {
        icon: "arrow-down",
        tooltip: __("moveDown"),
        hide: iContent >= (length - 1),
        callback: function() {
          content.splice(iContent + 1, 0, content.splice(iContent, 1)[0]);
          onContentModified(content);
        }
      },
    ];
    actionButtons[0] = _.merge(actionButtons[0], this.props.deleteExtraConfig);
    actionButtons[1] = _.merge(actionButtons[1], this.props.upExtraConfig);
    actionButtons[2] = _.merge(actionButtons[2], this.props.downExtraConfig);

    return <MKListModButtons buttons={actionButtons} />;
  }
});

module.exports = OrderedTableActions;
