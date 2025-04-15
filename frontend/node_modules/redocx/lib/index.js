'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.Platform = exports.Footer = exports.Header = exports.Table = exports.LineBreak = exports.Hr = exports.PageBreak = exports.BulletItem = exports.NumberItem = exports.Document = exports.List = exports.Image = exports.Text = undefined;

var _render = require('./renderer/render');

var _platform = require('./utils/platform');

var _platform2 = _interopRequireDefault(_platform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Component name (input to createElement function call after transpilation with Babel)
 */
var Text = 'TEXT';
var Image = 'IMAGE';
var List = 'LIST';
var NumberItem = 'NUMBERITEM';
var BulletItem = 'BULLETITEM';
var LineBreak = 'LINEBREAK';
var PageBreak = 'PAGEBREAK';
var Document = 'DOCUMENT';
var Hr = 'HR';
var Table = 'TABLE';
var Header = 'HEADER';
var Footer = 'FOOTER';

/**
 * Main export
 */
exports.Text = Text;
exports.Image = Image;
exports.List = List;
exports.Document = Document;
exports.NumberItem = NumberItem;
exports.BulletItem = BulletItem;
exports.PageBreak = PageBreak;
exports.Hr = Hr;
exports.LineBreak = LineBreak;
exports.Table = Table;
exports.Header = Header;
exports.Footer = Footer;
exports.Platform = _platform2.default;
exports.render = _render.render;