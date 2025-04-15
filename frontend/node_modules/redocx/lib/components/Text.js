'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Root2 = require('./Root');

var _Root3 = _interopRequireDefault(_Root2);

var _styles = require('../styles/styles');

var _componentValidators = require('../validators/componentValidators');

var _nodes = require('../utils/nodes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * This component creates a new paragraph with every new instance and renders the children.
 * It wraps LineBreak and Image component as intermediate component and calls the corresponding 
 * render method. This behaviour may change depending on new use cases (from open office xml)
 */
var Text = function (_Root) {
  _inherits(Text, _Root);

  function Text(root, props) {
    _classCallCheck(this, Text);

    var _this = _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this, root, props));

    _this.setParent = function (node, childName) {
      return node.parent = node.name === childName ? 'Text' : null;
    };

    _this.root = root;
    _this.props = props;
    _this.adder = _this.root.doc.createP();
    (0, _componentValidators.validateTextProps)(_this.props);
    return _this;
  }

  _createClass(Text, [{
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
    key: 'renderIntermediateComponents',


    /**
     * Render intermediate components (LineBreak, Image and Hr)
     * Not enough use cases (couldn't derive more use cases from open office xml)
     */
    value: function () {
      var _ref = _asyncToGenerator(function* (child, instance) {
        switch (child.name) {
          case 'LineBreak':
            // LineBreak component should not be called as an independent component.
            yield instance.addLineBreak();
            break;
          case 'Image':
            // Here we keep track of render() method for Image component as this avoids rendering - 
            // the Image component twice because Document component also calls render() method on all -
            // of its children. So we set its parent to 'Text' component and it calls render() once -
            // and avoids a second render() call by setting its parent to 'Text'. By default, if we -
            // call Image component as an independent component, it has a parent null || 'Document' -
            // so it calls the render() only once.

            this.setParent(child, 'Image');
            // child.name === 'Image' ? (child.parent = 'Text') : (child.parent = null);
            yield instance.addImage(_path2.default.resolve(child.props.src), (0, _styles.applyImageProps)(child.props));
            break;
          case 'Hr':
            // Same thing happening here also!
            this.setParent(child, 'Hr');
            yield instance.addHorizontalLine();
            break;
          default:
            break;
        }
      });

      function renderIntermediateComponents(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return renderIntermediateComponents;
    }()
  }, {
    key: 'renderChildren',
    value: function () {
      var _ref2 = _asyncToGenerator(function* (align, styles) {
        (0, _nodes.alignChildren)(this.adder, align, this.props.align);

        for (var i = 0; i < this.children.length; i += 1) {
          if (typeof this.children[i] === 'string') {
            yield (0, _nodes.renderText)(this.children[i], this.props, styles, this.adder);
          } else {
            yield this.renderIntermediateComponents(this.children[i], this.adder);
          }
        }
      });

      function renderChildren(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return renderChildren;
    }()
  }, {
    key: 'render',
    value: function () {
      var _ref3 = _asyncToGenerator(function* (align, styles) {
        yield this.renderChildren(align, styles);
      });

      function render(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return render;
    }()
  }]);

  return Text;
}(_Root3.default);

exports.default = Text;