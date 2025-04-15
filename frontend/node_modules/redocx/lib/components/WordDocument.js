'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _officegen = require('officegen');

var _officegen2 = _interopRequireDefault(_officegen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This creates the document instance
 */
var WordDocument = function WordDocument() {
  _classCallCheck(this, WordDocument);

  this.doc = (0, _officegen2.default)('docx');
};

exports.default = WordDocument;