'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _componentValidators = require('../validators/componentValidators');

var _styles = require('../styles/styles');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This component wraps all the children (string, components) and renders them.
 * It only takes two props, 'align' for alignment of the document and 'info' for adding
 * document information like name of the author and description of the document. 
 */

var Document = function () {
  function Document(root, props) {
    _classCallCheck(this, Document);

    this.children = [];

    this.root = root;
    this.props = props;
    // Create a new paragraph
    this.adder = this.root.doc.createP();
    // Align the children which are of type string
    this.adder.options.align = this.props.align;
    // Add document information
    Object.assign(this.root.doc.options, this.props.info ? this.props.info : {});
    // Validate the component props
    (0, _componentValidators.validateDocProps)(this.props);
  }
  // Store all the children here


  _createClass(Document, [{
    key: 'appendChild',
    value: function appendChild(child) {
      this.children.push(child);
    }
  }, {
    key: 'removeChild',
    value: function removeChild(child) {
      var index = this.children.indexOf(child);
      this.children.splice(index, 1);
    }
  }, {
    key: 'renderChildren',
    value: function () {
      var _ref = _asyncToGenerator(function* () {
        for (var i = 0; i < this.children.length; i += 1) {
          if (typeof this.children[i] === 'string') {
            // If not a component, render it as a paragraph
            yield this.adder.addText(this.children[i], this.props.style ? (0, _styles.applyStyles)(this.props.style) : {});
          } else if (_typeof(this.children[i]) === 'object') {
            // Call render() for each component
            yield this.children[i].render(this.props.align, this.props.style ? this.props.style : {});
          }
        }
      });

      function renderChildren() {
        return _ref.apply(this, arguments);
      }

      return renderChildren;
    }()
  }, {
    key: 'render',
    value: function () {
      var _ref2 = _asyncToGenerator(function* () {
        yield this.renderChildren();
      });

      function render() {
        return _ref2.apply(this, arguments);
      }

      return render;
    }()
  }]);

  return Document;
}();

exports.default = Document;