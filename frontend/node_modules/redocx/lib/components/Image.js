'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _styles = require('../styles/styles');

var _nodes = require('../utils/nodes');

var _Root2 = require('./Root');

var _Root3 = _interopRequireDefault(_Root2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * We need the parent class because it keeps the track of the parent node and the -
 * Image component and calls the render method depending upon where the component -
 * lies. For example - If Image component is children of Text component -
 * then its parent is Text component not the main Document component so we avoid -
 * calling render method on it twice
 */
var Image = function (_Root) {
  _inherits(Image, _Root);

  function Image(root, props) {
    _classCallCheck(this, Image);

    var _this = _possibleConstructorReturn(this, (Image.__proto__ || Object.getPrototypeOf(Image)).call(this, root, props));

    _this.root = root;
    _this.props = props;
    _this.name = 'Image';
    return _this;
  }

  _createClass(Image, [{
    key: 'renderImage',
    value: function () {
      var _ref = _asyncToGenerator(function* (align) {
        this.adder = this.root.doc.createP();

        // Align the image with context by Document or through component prop 'align'
        (0, _nodes.alignChildren)(this.adder, align, this.props.align);

        yield this.adder.addImage(_path2.default.resolve(this.props.src), (0, _styles.applyImageProps)(this.props));
      });

      function renderImage(_x) {
        return _ref.apply(this, arguments);
      }

      return renderImage;
    }()
  }, {
    key: 'render',
    value: function () {
      var _ref2 = _asyncToGenerator(function* (align) {
        yield this.parent === null ? this.renderImage(align) : null;
      });

      function render(_x2) {
        return _ref2.apply(this, arguments);
      }

      return render;
    }()
  }]);

  return Image;
}(_Root3.default);

exports.default = Image;