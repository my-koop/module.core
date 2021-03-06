var React = require("react");
var PropTypes = React.PropTypes;

var BSRow = require("react-bootstrap/Row");
var BSCol = require("react-bootstrap/Col");
var BSInput = require("react-bootstrap/Input");
var BSTable = require("react-bootstrap/Table");
var BSButton = require("react-bootstrap/Button");
var MKIcon = require("./Icon");
var MKDebouncerMixin = require("./DebouncerMixin");

var _ = require("lodash");
var __ = require("language").__;

// Inequality function map for the filtering
var operators = {
    "<": function(x, y) { return x < y; },
    "<=": function(x, y) { return x <= y; },
    ">": function(x, y) { return x > y; },
    ">=": function(x, y) { return x >= y; },
    "=": function(x, y) { return x == y; }
};
var operandRegex = /^((?:(?:[<>]=?)|=))\s?([-]?\d+(?:\.\d+)?)$/;
var availableSlices = [5, 10, 20, 50, 100];
var defaultSliceChoice = 2;
// TableSorter React Component
var TableSorter = React.createClass({
  mixins: [MKDebouncerMixin],

  propTypes: {
    config: PropTypes.shape({
      sort: PropTypes.shape({
        column: PropTypes.string.isRequired,
        order: PropTypes.oneOf(["asc","desc"]).isRequired,
      }),

      columns: PropTypes.objectOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        defaultSortOrder: PropTypes.oneOf(["asc","desc",""]),
        headerProps: PropTypes.object,
        // Allows to customize the data used to filter this column
        // function(item, i): any
        customFilterData: PropTypes.oneOfType([PropTypes.func,PropTypes.bool]),
        // Overwrites the filter method
        // returns a function to filter this column. True means keep this data
        // Called only if filter text is present
        // function(filterText: string): (columnData: any) => boolean;
        customFilter: PropTypes.func,
        // default filter text
        filterText: PropTypes.string,
        // callback to create a custom cell content
        // function(item: Data, colIndex: number) : ReactComponent
        cellGenerator: PropTypes.func,
        // Alias for disableSorting, disableFiltering & disableDragging
        isStatic: PropTypes.bool,
        // Disable Sorting for this column only
        disableSorting: PropTypes.bool,
        // Disable Filtering for this column only
        disableFiltering: PropTypes.bool,
        // Disable Dragging for this column only
        disableDragging: PropTypes.bool,
      })).isRequired,
      // Default column ordering
      defaultOrdering: PropTypes.array.isRequired,
    }).isRequired,

    // Initial data in the table
    items: PropTypes.array,
    // Header repeat interval, 0 to disable
    headerRepeat: PropTypes.number,
    // Disable Sorting for this table
    disableSorting: PropTypes.bool,
    // Disable Filtering for this table
    disableFiltering: PropTypes.bool,
    // Disable Dragging for this table
    disableDragging: PropTypes.bool,
    hidePager: PropTypes.bool,
  },

  getDefaultProps: function() {
    return {
      config: {
        columns: []
      }
    }
  },

  componentWillReceiveProps: function (nextProps) {
    if(
      !_.isEqual(
        _.omit(this.props, "items"),
        _.omit(nextProps, "items"),
        function(a, b) {
          if(_.isFunction(a) && _.isFunction(b)) {
            return a.toString() === b.toString();
          }
        }
      )
    ) {
      this.props = nextProps;
      this.setState(this.getInitialState());
    } else {
      // Make sure to at least update the filtering
      this.setState({
        filteredItems: this.getFilteredItems(
          this.getColumnNames(),
          this.state.columns,
          nextProps.items
        )
      });
    }
  },

  getInitialState: function() {
    var columns = this.props.config.columns;

    if(this.props.config.defaultOrdering) {
      var columnsOrder = _.filter(this.props.config.defaultOrdering, function(col) {
        if(!columns[col]) {
          console.warn("TableSorter::Column [%s] from defaultOrdering is not defined in config.columns", col);
          return false;
        }
        return true;
      });
    } else {
      var columnsOrder = Object.keys(columns);
    }

    var self = this;
    return {
      sort: this.props.config.sort || { column: "", order: "" },
      columns: columns,
      columnsOrder: columnsOrder,
      fixedPositionColumns: columnsOrder.reduce(function(fixedPositionColumns, colName, i) {
        var col = columns[colName];
        if(!self.canDrag(col)) {
          fixedPositionColumns[colName] = i;
        }
        return fixedPositionColumns;
      }, {}),
      currentPage: 1,
      currentSlice: availableSlices[defaultSliceChoice],
      sliceChoice: defaultSliceChoice,
      filteredItems: this.getFilteredItems(
        columnsOrder,
        columns,
        this.props.items
      )
    };
  },

  canSort: function(col) {
    return !(this.props.disableSorting || col.isStatic || col.disableSorting);
  },

  canDrag: function(col) {
    return !(this.props.disableDragging || col.isStatic || col.disableDragging);
  },

  canFilter: function(col) {
    return !(this.props.disableFiltering || col.isStatic || col.disableFiltering);
  },

  handleFilterTextChange: function(column) {
    var self = this;
    return function(newValue) {
      self.debounce(["columns", column], "filterText", function(newValue) {
        var columns = self.state.columns;
        columns[column].filterText = newValue;
        self.setState({
          columns: columns,
          filteredItems: self.getFilteredItems(
            self.getColumnNames(),
            columns,
            self.props.items
          ),
          currentPage: 1,
          currentSlice: availableSlices[self.state.sliceChoice]
        });
      }, 250, newValue);
    };
  },

  getFilteredItems: function(columnNames, columns, items) {
    var self = this;
    var filters = {};

    var items = _.map(items, function(item, i) {
      return _.merge(item, {__indexFromOriginalArray: i});
    });

    var filteredItems = items;
    if(!self.props.disableFiltering) {
      var hasFilterText = false;
      columnNames.forEach(function(column) {
        var config = columns[column] ;
        var filterText = config.filterText;
        filters[column] = null;

        if (filterText && filterText.length > 0) {
          hasFilterText = true;
          if(config.customFilter) {
            filters[column] = _.partial(config.customFilter, filterText);
          } else {
            var operandMatch = operandRegex.exec(filterText);
            if (operandMatch && (operandMatch.length === 3) ) {
              filters[column] = function(match) {
                return function(x) {
                  return operators[match[1]](x, match[2]);
                };
              }(operandMatch);
            } else {
              filters[column] = function(x) {
                return ~(_(x).toString().toLowerCase().indexOf(filterText.toLowerCase()));
              };
            }
          }
        }
      });
      if(hasFilterText) {
        filteredItems = _.reduce(columnNames, function(filteredItems, c) {
          if(!filters[c]) {
            return filteredItems;
          }
          var filter = filters[c];
          var customFilterData = columns[c].customFilterData;
          var getter;
          if(customFilterData) {
            getter = _.isFunction(customFilterData) ?
              customFilterData : columns[c].cellGenerator;
          }
          getter = getter || function(item) {
            return item[c];
          };
          return _.filter(filteredItems, function(item) {
            return filter(getter(item, item.__indexFromOriginalArray));
          })
        }, items);
      }
    }
    return filteredItems;
  },

  getColumnNames: function() {
    return this.state.columnsOrder;
  },

  sortColumn: function(column) {
    var self = this;
    return function(event) {
      var newSortOrder
      if (self.state.sort.column !== column) {
        newSortOrder = self.state.columns[column].defaultSortOrder || "asc";
      } else {
        newSortOrder = (self.state.sort.order === "asc") ? "desc" : "asc";
      }

      self.setState({sort: { column: column, order: newSortOrder }});
    };
  },

  columnChangeEventID: "column change",

  dragStart: function(i, e) {
    var data = {
      index : i,
      event: this.columnChangeEventID
    }
    e.dataTransfer.setData("text", JSON.stringify(data));
  },

  onDrop: function(i, e) {
    var data = JSON.parse(e.dataTransfer.getData("text"));
    if(
      data.event === this.columnChangeEventID &&
      _.isNumber(data.index) &&
      (data.index >>> 0) < this.state.columnsOrder.length &&
      data.index !== i
    ) {
      var columnsOrder = this.state.columnsOrder;
      var draggedColumn = columnsOrder.splice(data.index, 1);
      columnsOrder.splice(i, 0, draggedColumn[0]);
      // makes sure static columns haven't moved
      if(!_.isEmpty(this.state.fixedPositionColumns)) {
        var l = columnsOrder.length;
        var self = this;
        var checkStaticColumn = function(i) {
          // check if static column is misplaced
          var colStaticIndex = self.state.fixedPositionColumns[columnsOrder[i]];
          if(colStaticIndex !== undefined && colStaticIndex !== i) {
            // put it back in its place
            var col = columnsOrder.splice(i, 1);
            columnsOrder.splice(colStaticIndex, 0, col[0]);
          }
        };

        // the traversing order is important depending on how the change was made
        if(i > data.index) {
          for (var i = l - 1; i >= 0; i--) {
            checkStaticColumn(i);
          };
        } else {
          for (var i = 0; i < l; i++) {
            checkStaticColumn(i);
          };
        }
      }
      this.setState({
        columnsOrder: columnsOrder
      });
    }
  },

  onPageChange: function(page) {
    var currentSlice = availableSlices[this.state.sliceChoice] * page;
    this.setState({
      currentPage: page,
      currentSlice: currentSlice
    });
  },

  nextPage: function() {
    var page = this.state.currentPage + 1;
    this.onPageChange(page);
  },

  previousPage: function() {
    var page = this.state.currentPage - 1;
    this.onPageChange(page);
  },

  chooseSlice: function(sliceChoice) {
    this.setState({
      currentPage: 1,
      currentSlice: availableSlices[sliceChoice],
      sliceChoice: sliceChoice
    });
  },

  render: function() {
    var self = this;
    var allRows = [];

    var columnNames = self.getColumnNames();
    var filteredItems = self.state.filteredItems;
    var totalItems = filteredItems.length;

    /////////////////////////////////////////////////////////////////////////
    // Sort data
    if(!self.props.disableSorting) {
      var sortedItems = _.sortBy(filteredItems, self.state.sort.column);
      if (self.state.sort.order === "desc")
        sortedItems.reverse();
    } else {
      var sortedItems = filteredItems;
    }
    /////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////
    // Pagination
    if(!this.props.hidePager) {
      var endSlice = this.state.currentSlice;
      var startSlice = endSlice - availableSlices[this.state.sliceChoice];
      endSlice = Math.min(endSlice, totalItems);
      sortedItems = sortedItems.slice(startSlice, endSlice);
    }
    /////////////////////////////////////////////////////////////////////////

    // Create headers
    var header = columnNames.map(function(col, i) {
      var columnConfig = self.state.columns[col];
      var headerName = self.state.columns[col].name;

      var headerRender;
      var enableSorting = self.canSort(columnConfig);
      if(enableSorting) {
        headerRender = function(extraIcon) {
          var sortIcon = "sort";
          var isSortingThisColumn = self.state.sort.column === col;
          if(isSortingThisColumn) {
            sortIcon += "-" + self.state.sort.order;
          }
          var icon = (<MKIcon glyph={sortIcon} />);
          return (
            <BSButton onClick={self.sortColumn(col)} bsStyle="link" block>
              {extraIcon} {headerName} {icon}{" "}
            </BSButton>
          );
        }
      } else {
        headerRender = function(extraIcon) {
          // FIXME:: Style is a quick fix for prototype, change when real style decided
          return (
            <div
              className="btn btn-link"
              style={{width: "100%", cursor: "default"}}
            >
              {extraIcon} {headerName}
            </div>
          );
        }
      }

      var enableDragging = self.canDrag(columnConfig);
      var dragProps = {};
      var extraIcon = null;
      if(enableDragging) {
        extraIcon = <MKIcon
          glyph="bars"
          onDragStart={self.dragStart.bind(null,i)}
          draggable
          className="draggable pull-left hidden-xs"
        />;
        dragProps = {
          onDrop: self.onDrop.bind(null,i),
          onDragOver: function(e) {e.preventDefault();},
        };
      }

      return (
        <th
          key={i}
          {...dragProps}
          {...columnConfig.headerProps}
        >
          {headerRender(extraIcon)}
        </th>
      );
    });

    // Create filter fields
    if(!self.props.disableFiltering) {
      var filterLink = function(column) {
        return {
          value: self.state.columns[column].filterText,
          requestChange: self.handleFilterTextChange(column)
        };
      };

      var filterInputs = columnNames.map(function(c, i) {
        if(self.canFilter(self.state.columns[c])) {
          return (
            <td key={i}>
              <BSInput
                type="text"
                valueLink={filterLink(c)}
                placeholder={__("filterBy") + self.state.columns[c].name}
              />
            </td>
          );
        }
        return <td key={i} />;
      });
    }

    // Extra header generator
    var headerExtra = function() {
      return columnNames.map(function(c, i) {
        return <th key={i}>{self.state.columns[c].name}</th>;
      }, self);
    };

    // Row generator
    var rowGenerator = function(item, iItem) {
      return columnNames.map(function(colName, i) {
        var cellGenerator = self.state.columns[colName].cellGenerator;

        if(cellGenerator) {
          return (
            <td key={i}>
              {cellGenerator.call(self, item, item.__indexFromOriginalArray)}
            </td>
          );
        } else {
          return (
            <td key={i}>
              {item[colName]}
            </td>
          );
        }
      });
    };

    // Create all rows
    sortedItems.forEach(function(item, i) {
      if (
        (self.props.headerRepeat > 0) &&
        (i > 0) &&
        (i % self.props.headerRepeat === 0)
      ) {
        allRows.push (
          <tr key={"extra" + i}>
            {headerExtra()}
          </tr>
        )
      }

      allRows.push(
        <tr key={i} {...item.__rowProps}>
          {rowGenerator(item, i)}
        </tr>
      );
    });

    var pager;
    if(!this.props.hidePager) {
      var currentPage = this.state.currentPage;
      var totalPages = Math.ceil(
        totalItems / availableSlices[this.state.sliceChoice]
      );
      function makeArrow(onClick, disabled, icon, srText) {
        return (
          <li key={srText} className={disabled ? "disabled": ""} title={srText}>
            <span onClick={!disabled && onClick}>
              <MKIcon glyph={icon} fixedWidth />
              <span className="sr-only">{srText}</span>
            </span>
          </li>
        );
      }
      var goToPreviousPage = makeArrow(
        _.partial(this.previousPage, 1),
        currentPage === 1,
        "angle-left",
        __("previous")
      );
      var goToNextPage = makeArrow(
        _.partial(this.nextPage, 1),
        currentPage === totalPages,
        "angle-right",
        __("next")
      );
      var goToFirstPage = makeArrow(
        _.partial(this.onPageChange, 1),
        currentPage === 1,
        "angle-double-left",
        __("first")
      );
      var goToLastPage = makeArrow(
        _.partial(this.onPageChange, totalPages),
        currentPage === totalPages,
        "angle-double-right",
        __("last")
      );
      var firstPageShown = Math.max(currentPage - 2, 1);
      var lastPageShown = Math.min(firstPageShown + 5, totalPages + 1);

      var pages = _.map(_.range(firstPageShown, lastPageShown), function(pageNumber) {
        var isCurrentPage = pageNumber === currentPage;
        var activeClass = isCurrentPage && "active" || undefined;
        var onClick = !isCurrentPage && _.partial(self.onPageChange, pageNumber);
        return (
          <li key={pageNumber} className={activeClass}>
            <span onClick={onClick}>
              {pageNumber}
            </span>
          </li>
        );
      });
      pager = (
        <nav>
          <ul className="pagination">
            {goToFirstPage}
            {goToPreviousPage}
            {pages}
            {goToNextPage}
            {goToLastPage}
          </ul>
        </nav>
      );
    } else {
      pager = null;
    }


    var others = _.omit(this.props,
      "config",
      "items",
      "headerRepeat",
      "disableSorting",
      "disableFiltering",
      "disableDragging",
      "className"
    );
    var className = _(this.props.className).toString() + " table-sorter";
    return (
      <div>
        <BSRow key="table">
          <BSCol xs={12}>
            <BSTable
              className={className}
              cellSpacing="0"
              {...others}
            >
              <thead>
                <tr>
                  {header}
                </tr>
                {!self.props.disableFiltering ? (
                  <tr className="table-sorter-filter-row">
                    {filterInputs}
                  </tr>
                ) : null }
              </thead>
              <tbody>
                {allRows}
              </tbody>
            </BSTable>
          </BSCol>
        </BSRow>
        {!this.props.hidePager ? [
          <BSRow key="pagerOptions">
            <BSCol xs={12}>
              <span>
                {__("showingResults", {
                  start: !endSlice ? 0 : startSlice + 1,
                  end: endSlice,
                  total: totalItems
                })}
              </span>
              <span className="pull-right">
                {__("resultPerPage")}
                {_.map(availableSlices, function(slice, i) {
                  var separator = i === availableSlices.length - 1 ? "" : ", ";
                  var link;
                  if(i === self.state.sliceChoice) {
                    var link = <span>{slice}</span>;
                  } else {
                    var link = (
                      <span
                        className="btn-link pointer"
                        onClick={_.partial(self.chooseSlice, i)}
                      >
                        {slice}
                      </span>
                    );
                  }
                  return (
                    <span key={i}>
                      {link}
                      {separator}
                    </span>
                  );
                })}
              </span>
            </BSCol>
          </BSRow>,
          <BSRow key="pager">
            <BSCol xs={12} className="text-center">
              {pager}
            </BSCol>
          </BSRow>
        ] : null}
      </div>
    );
  }
});

module.exports = TableSorter;
