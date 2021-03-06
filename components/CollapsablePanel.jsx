var React  = require("react");
var BSPanel= require("react-bootstrap/Panel");
var MKIcon = require("./Icon");
var _ = require("lodash");

var CollapsablePanel = React.createClass({

  getDefaultProps: function(){
    return {
      defaultExpanded: false,
      hideIcon: false
    };
  },

  getInitialState: function(){
    return {
      expanded: this.props.defaultExpanded
    };
  },

  toggle: function(e){
    this.setState({
      expanded: !this.state.expanded
    });
  },

  render: function() {
    // correct way to do, but not yet supported
    //var {defaultExpanded, hideIcon, ...others} = this.props;
    var others = _.omit(this.props, "defaultExpanded", "hideIcon");
    var glyph = this.state.expanded ? "minus" : "plus";
    var header = !this.props.hideIcon ?
      (
        <span >
          <MKIcon glyph={glyph} style={{marginRight:"10px"}}/>
          {this.props.header}
        </span>
      )
      : this.props.header;
    return (
      <BSPanel {...others} header={header} collapsable expanded={this.state.expanded} onSelect={this.toggle}>
        {this.props.children}
      </BSPanel>
    );
  }
});

module.exports = CollapsablePanel;
