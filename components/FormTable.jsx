//Component hierarchy
//FilterableItemList
//  FilterOptions
//    FilterOption
//  ItemList
//    ItemListHeader
//    ItemRow

var React = require("react");
var PropTypes = React.PropTypes;
var InputFactoryMethod = require("./FormInputFactory");
var BSTable = require("react-bootstrap/Table");

var _ = require("lodash");


var ItemRow = React.createClass({
  propTypes : {
    rowData : PropTypes.array.isRequired
  },

  render: function() {
    rowElements = this.props.rowData.map(function(rowElementData,key) {
      return (
         <td key={key}>{rowElementData} </td>
      );
    });
    return (
      <tr>
        {rowElements}
      </tr>
    );
  }

});

var ItemListHeader = React.createClass({
  propTypes : {
    headerList: PropTypes.array.isRequired
  },

  render: function() {
    headers = this.props.headerList.map(function(header, key) {
      if(_.isString(header)) {
        header = {
          title: header,
          props: {}
        };
      }

      return (
        <th key={key} {...header.props}> {header.title} </th>
      );
    });

    return (
      <thead>
        <tr>
          {headers}
        </tr>
      </thead>
    );
  }

});

var ItemList = React.createClass({
  propTypes: {
    tableHeader : PropTypes.array.isRequired,
    tableData : PropTypes.array.isRequired
  },
  render: function() {
    rows = this.props.tableData.map(function(data,key) {
      return (
          <ItemRow key={key} rowData={data} />
      );
    });
    return (
      <div>
        <BSTable responsive>
          <ItemListHeader headerList={this.props.tableHeader}/>
            <tbody>
              {rows}
            </tbody>
        </BSTable>
      </div>
    );
  }
});

var FilterableItemList = React.createClass({
  propTypes: {
    data          : PropTypes.array.isRequired,
    headers       : PropTypes.array.isRequired
  },

  render: function() {
    return (
      <div>
        <ItemList tableHeader={this.props.headers} tableData={this.props.data} />
      </div>
    );
  }
});
module.exports = FilterableItemList;
