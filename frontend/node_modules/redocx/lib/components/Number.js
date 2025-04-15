'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Root2 = require('./Root');

var _Root3 = _interopRequireDefault(_Root2);

var _nodes = require('../utils/nodes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Creates list of numbers (currently unstable)
 */
var NumberItem = function (_Root) {
  _inherits(NumberItem, _Root);

  function NumberItem(root, props) {
    _classCallCheck(this, NumberItem);

    var _this = _possibleConstructorReturn(this, (NumberItem.__proto__ || Object.getPrototypeOf(NumberItem)).call(this, root, props));

    _this.root = root;
    _this.props = props;
    _this.adder = _this.root.doc.createListOfNumbers();
    return _this;
  }

  _createClass(NumberItem, [{
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
      var _ref = _asyncToGenerator(function* (align, styles) {
        yield (0, _nodes.renderNodes)(align, null, styles, this.adder, this.children, this.props);
      });

      function renderChildren(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return renderChildren;
    }()
  }, {
    key: 'render',
    value: function () {
      var _ref2 = _asyncToGenerator(function* (align, styles) {
        yield this.renderChildren(align, styles);
      });

      function render(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return render;
    }()
  }]);

  return NumberItem;
}(_Root3.default);

exports.default = NumberItem;