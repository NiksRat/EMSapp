'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHostContextNode = exports.createElement = undefined;

var _index = require('../components/index');

// Stores the root container instance
var ROOT_NODE_INSTANCE = null;

/**
 * Updates the ref to ROOT_NODE_INSTANCE
 * @param {*} rootNode root instance
 */
function getHostContextNode(rootNode) {
  if (typeof rootNode !== 'undefined') {
    return ROOT_NODE_INSTANCE = rootNode;
  }

  console.warn(rootNode + ' is not an instance of officegen docx constructor.');
  // Lazily create the instance (escape hatch if the global state is mutated)
  return ROOT_NODE_INSTANCE = new _index.WordDocument();
}

/**
 * Creates an element for a document
 * @param {string} type Element type
 * @param {Object} props Component props
 * @param {Object} root Root instance
 */

function createElement(type, props) {
  // Hash table lookup is much better than evaluating each case with switch-case
  var COMPONENTS = {
    ROOT: function ROOT() {
      return new _index.WordDocument();
    },

    DOCUMENT: function DOCUMENT() {
      return new _index.Document(ROOT_NODE_INSTANCE, props);
    },

    TEXT: function TEXT() {
      return new _index.Text(ROOT_NODE_INSTANCE, props);
    },
    LIST: function LIST() {
      return new _index.List(ROOT_NODE_INSTANCE, props);
    },
    NUMBERITEM: function NUMBERITEM() {
      return new _index.NumberItem(ROOT_NODE_INSTANCE, props);
    },
    BULLETITEM: function BULLETITEM() {
      return new _index.BulletItem(ROOT_NODE_INSTANCE, props);
    },

    HR: function HR() {
      return new _index.Hr(ROOT_NODE_INSTANCE, props);
    },

    LINEBREAK: function LINEBREAK() {
      return new _index.LineBreak(ROOT_NODE_INSTANCE, props);
    },
    PAGEBREAK: function PAGEBREAK() {
      return new _index.PageBreak(ROOT_NODE_INSTANCE, props);
    },

    TABLE: function TABLE() {
      return new _index.Table(ROOT_NODE_INSTANCE, props);
    },

    IMAGE: function IMAGE() {
      return new _index.Image(ROOT_NODE_INSTANCE, props);
    },

    HEADER: function HEADER() {
      return new _index.Header(ROOT_NODE_INSTANCE, props);
    },
    FOOTER: function FOOTER() {
      return new _index.Footer(ROOT_NODE_INSTANCE, props);
    },

    default: undefined
  };

  return COMPONENTS[type]() || COMPONENTS.default;
}

exports.createElement = createElement;
exports.getHostContextNode = getHostContextNode;