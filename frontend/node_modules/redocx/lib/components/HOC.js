'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _nodes = require('../utils/nodes');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * High order component for rendering header and footer
 * @param {string} component Component name
 * @param {string} fn Function name
 */
function hoc(component, fn) {
  var _Component = function () {
    function _Component(root, props) {
      _classCallCheck(this, _Component);

      this.children = [];

      this.root = root;
      this.props = props;
      this.adder = fn === 'getHeader' ? this.root.doc.getHeader().createP() : this.root.doc.getFooter().createP();
    }

    _createClass(_Component, [{
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
          yield (0, _nodes.renderNodes)(align, this.props.align, styles, this.adder, this.children, this.props);
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

    return _Component;
  }();

  return _Component;
}

exports.default = hoc;