var nicEdit = require("exports?" +
  "__," +
  "bkClass," +
  "nicEditorConfig," +
  "nicEditor" +
  "!./nicEdit"
);

/*FIXME: Until we figure out how to inject this we'll have to hardcore it...
var __ = nicEdit.__;
nicEdit.nicEditorConfig = nicEdit.bkClass.extend({
  buttons : {
    'bold' : {name : __('Click to Bold'), command : 'Bold', tags : ['B','STRONG'], css : {'font-weight' : 'bold'}, key : 'b'},
    'italic' : {name : __('Click to Italic'), command : 'Italic', tags : ['EM','I'], css : {'font-style' : 'italic'}, key : 'i'},
    'underline' : {name : __('Click to Underline'), command : 'Underline', tags : ['U'], css : {'text-decoration' : 'underline'}, key : 'u'},
    'left' : {name : __('Left Align'), command : 'justifyleft', noActive : true},
    'center' : {name : __('Center Align'), command : 'justifycenter', noActive : true},
    'right' : {name : __('Right Align'), command : 'justifyright', noActive : true},
    'justify' : {name : __('Justify Align'), command : 'justifyfull', noActive : true},
    'ol' : {name : __('Insert Ordered List'), command : 'insertorderedlist', tags : ['OL']},
    'ul' :  {name : __('Insert Unordered List'), command : 'insertunorderedlist', tags : ['UL']},
    'subscript' : {name : __('Click to Subscript'), command : 'subscript', tags : ['SUB']},
    'superscript' : {name : __('Click to Superscript'), command : 'superscript', tags : ['SUP']},
    'strikethrough' : {name : __('Click to Strike Through'), command : 'strikeThrough', css : {'text-decoration' : 'line-through'}},
    'removeformat' : {name : __('Remove Formatting'), command : 'removeformat', noActive : true},
    'indent' : {name : __('Indent Text'), command : 'indent', noActive : true},
    'outdent' : {name : __('Remove Indent'), command : 'outdent', noActive : true},
    'hr' : {name : __('Horizontal Rule'), command : 'insertHorizontalRule', noActive : true}
  },
  iconsPath : require("./nicEditorIcons.gif"),
  buttonList : ['save','bold','italic','underline','left','center','right','justify','ol','ul','fontSize','fontFamily','fontFormat','indent','outdent','image','upload','link','unlink','forecolor','bgcolor'],
  iconList : {"bgcolor":1,"forecolor":2,"bold":3,"center":4,"hr":5,"indent":6,"italic":7,"justify":8,"left":9,"ol":10,"outdent":11,"removeformat":12,"right":13,"save":24,"strikethrough":15,"subscript":16,"superscript":17,"ul":18,"underline":19,"image":20,"link":21,"unlink":22,"close":23,"arrow":25}
});
*/

module.exports = {
  nicEditor: nicEdit.nicEditor
};
