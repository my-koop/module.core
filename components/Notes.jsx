var React      = require("react");
var BSCol      = require("react-bootstrap/Col");
var BSButton   = require("react-bootstrap/Button");
var BSPanel    = require("react-bootstrap/Panel");
var BSInput    = require("react-bootstrap/Input");
var MKAlertTrigger = require("mykoop-core/components/AlertTrigger");

var language   = require("language");
var __         = language.__;
var formatDate = language.formatDate;
var actions    = require("actions");

var sliceIncrement = 5;
var Notes = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    resourceId: React.PropTypes.number.isRequired,
    retrieveNotesAction: React.PropTypes.func.isRequired,
    addNoteAction: React.PropTypes.func.isRequired,
  },

  getInitialState: function() {
    return {
      notes: null,
      message: "",
      sliceCount: sliceIncrement,
    }
  },

  getNotes: function() {
    var self = this;
    this.props.retrieveNotesAction({
      i18nErrors: {},
      alertErrors: true,
      data: {
        id: self.props.resourceId
      }
    }, function(err, res) {
      if(!err) {
        _.each(res.notes, function(note) {
          note.date = new Date(note.date);
        });
        self.setState({
          notes: res.notes
        });
      }
    });
  },

  componentWillMount: function() {
    this.getNotes();
  },

  onSubmit: function(e) {
    e.preventDefault();
    var self = this;
    if(_.isEmpty(self.state.message)) {
      return;
    }
    this.props.addNoteAction({
      i18nErrors: {},
      alertErrors: true,
      data: {
        id: self.props.resourceId,
        message: self.state.message
      }
    }, function(err, res) {
      if(!err) {
        self.setState({
          message: ""
        }, function() {
          self.getNotes();
        });
      }
    });
  },

  showMoreNotes: function() {
    this.setState({
      sliceCount: this.state.sliceCount + sliceIncrement
    });
  },

  render: function() {
    var notePanels = _(this.state.notes)
      .first(this.state.sliceCount)
      .map(function(note, i) {
        var header = __("notes::Author") + " "
          + note.author + " "
          + __("notes::TimePrefix") + " "
          + formatDate(note.date, "LLL");
        return (
          <BSPanel key={i} header={header}>
            {note.message}
          </BSPanel>
        );
      })
      .value();

    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <BSInput
            type="textarea"
            label={__("notes::InputLabel")}
            valueLink={this.linkState("message")}
          />
          <BSInput
            type="submit"
            value={__("notes::Submit")}
            bsStyle="success"
            disabled={_.isEmpty(this.state.message)}
          />
        </form>
        {notePanels}
        { this.state.sliceCount < _.size(this.state.notes) ?
          <BSButton
            bsSize="small"
            bsStyle="primary"
            onClick={this.showMoreNotes}
          >
            {__("notes::ShowMore")}
          </BSButton>
        : null }
      </div>
    );
  }

});

module.exports = Notes;
