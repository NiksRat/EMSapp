'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This component adds a line break and should be called inside Text or List component
 */
var LineBreak = function LineBreak(root, props) {
  _classCallCheck(this, LineBreak);

  this.root = root;
  this.prop = props;
  this.name = 'LineBreak';
};

exports.default = LineBreak;