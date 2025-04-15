'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _styles = require('../styles/styles');

var _componentValidators = require('../validators/componentValidators');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This component renders a table with props 'headers', 'data' and 'style' for styling the table
 */
var Table = function () {
  // Stores headers and corresponding data for the headers
  function Table(root, props) {
    _classCallCheck(this, Table);

    this.TABLE_DATA = [];
    this.defaultStyles = {
      tableColWidth: 2500,
      tableSize: 24,
      tableColor: 'black',
      tableAlign: 'left',
      borders: true
    };

    this.root = root;
    this.props = props;
    (0, _componentValidators.validateTableProps)(this.props);
    (0, _componentValidators.headerValidators)(this.props);
    (0, _componentValidators.tableStyleValidators)(this.props);
  }

  // set the headers and serialize each cell's data (in accordance with open office xml)


  // Table styles (required for rendering a table)


  _createClass(Table, [{
    key: 'setHeaders',
    value: function setHeaders(props) {
      var headers = props.headers;


      headers.forEach(function (header) {
        header.val = header.value;
        header.opts = header.styles;
        header.opts = (0, _styles.styleSerializer)(header.opts);
        delete header.value;
        delete header.styles;
      });

      // for (let i of headers) {
      //   i.val = i.value;
      //   i.opts = i.styles;
      //   // serialize all the styles according to open office xml values
      //   i.opts = styleSerializer(i.opts);
      //   // Inefficient (performance bottleneck)
      //   delete i.value;
      //   delete i.styles;
      // }

      this.TABLE_DATA.push(headers);
    }

    // set the row data

  }, {
    key: 'setData',
    value: function setData(props) {
      var _this = this;

      var data = props.data;

      data.forEach(function (item) {
        _this.TABLE_DATA.push(item);
      });
    }

    // Set everything and finally render a table 😅

  }, {
    key: 'renderTable',
    value: function () {
      var _ref = _asyncToGenerator(function* () {
        this.setHeaders(this.props);
        this.setData(this.props);
        yield this.root.doc.createTable(this.TABLE_DATA, this.props.style || this.defaultStyles);
      });

      function renderTable() {
        return _ref.apply(this, arguments);
      }

      return renderTable;
    }()
  }, {
    key: 'render',
    value: function () {
      var _ref2 = _asyncToGenerator(function* () {
        yield this.renderTable();
      });

      function render() {
        return _ref2.apply(this, arguments);
      }

      return render;
    }()
  }]);

  return Table;
}();

exports.default = Table;