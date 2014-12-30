var React = require("react");

var BSCol = require("react-bootstrap/Col");
var BSRow = require("react-bootstrap/Row");

var BSButton = require("react-bootstrap/Button");
var BSPanel  = require("react-bootstrap/Panel");
var BSInput  = require("react-bootstrap/Input");

var MKAlert = require("./Alert");
var MKIcon = require("./Icon");

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
    readOnly: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      readOnly: false
    };
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
    if(this.state.notes === null) {
      return null;
    }


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

    if(_.isEmpty(notePanels)) {
      notePanels = <MKAlert bsStyle="warning">{__("notes::NoNotes")}</MKAlert>;
    }

    return (
      <div>
        <BSRow>
          <BSCol xs={12}>
            <form onSubmit={this.onSubmit}>
              {!this.props.readOnly ? [
                <BSInput
                  key="note"
                  type="textarea"
                  label={__("notes::InputLabel")}
                  valueLink={this.linkState("message")}
                />,
                <BSInput
                  key="send"
                  type="submit"
                  className="pull-right"
                  value={__("notes::Submit")}
                  bsStyle="success"
                  disabled={_.isEmpty(this.state.message)}
                />
              ]: null}
            </form>
          </BSCol>
        </BSRow>
        <BSRow className={!this.props.readOnly ? "top-margin-15" : ""}>
          <BSCol xs={12}>
            {notePanels}
            {this.state.sliceCount < _.size(this.state.notes) ?
              <BSButton
                bsStyle="default"
                block
                onClick={this.showMoreNotes}
              >
                <strong>
                  <MKIcon glyph="angle-double-down" />
                  {" " + __("notes::ShowMore") + " "}
                  <MKIcon glyph="angle-double-down" />
                </strong>
              </BSButton>
            : null}
            </BSCol>
        </BSRow>
      </div>
    );
  }

});

module.exports = Notes;
