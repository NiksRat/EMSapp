"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Base class that keeps track of parent and child nodes
 */
var Root = function () {
  function Root(root, props) {
    _classCallCheck(this, Root);

    this.parent = null;
    this.children = [];

    this.root = root;
    this.props = props;
  }

  _createClass(Root, [{
    key: "appendChild",
    value: function appendChild(child) {
      child.parent = this;
      this.children.push(child);
    }
  }, {
    key: "removeChild",
    value: function removeChild(child) {
      var index = this.children.indexOf(child);

      child.parent = null;
      this.children.splice(index, 1);
    }
  }, {
    key: "renderChildren",
    value: function () {
      var _ref = _asyncToGenerator(function* () {
        for (var i = 0; i < this.children.length; i += 1) {
          yield this.children[i].render();
        }
      });

      function renderChildren() {
        return _ref.apply(this, arguments);
      }

      return renderChildren;
    }()
  }]);

  return Root;
}();

exports.default = Root;