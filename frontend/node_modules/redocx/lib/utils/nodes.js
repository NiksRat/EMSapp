'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderNodes = exports.alignChildren = exports.renderText = undefined;

/**
 * This function renders the text content and apply the corresponding styles to it
 * @param {string} child Child node
 * @param {Object} props Component props
 * @param {Object} styles Style attributes
 * @param {Object} instance Document instance
 */
var renderText = function () {
  var _ref = _asyncToGenerator(function* (child, props, styles, instance) {
    yield instance.addText(child, props.style ? (0, _styles.applyStyles)(props.style) : (0, _styles.applyStyles)(styles));
  });

  return function renderText(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * 
 * @param {Object} instance Document instance
 * @param {string} alignWithContext Align (Document component)
 * @param {string} alignThroughProp Align prop
 */


/**
 * This function renders all the text nodes
 * @param {string} alignWithContext Align (Document component)
 * @param {string} alignThroughProp Align prop
 * @param {Object} styles Style attributes
 * @param {Object} instance Document instance
 * @param {Array} children Child node
 * @param {Object} props Component props
 */
var renderNodes = function () {
  var _ref2 = _asyncToGenerator(function* (alignWithContext, alignThroughProp, styles, instance, children, props) {
    alignChildren(instance, alignWithContext, alignThroughProp);
    for (var i = 0; i < children.length; i += 1) {
      if (typeof children[i] === 'string') {
        yield renderText(children[i], props, styles, instance);
      }
    }
  });

  return function renderNodes(_x5, _x6, _x7, _x8, _x9, _x10) {
    return _ref2.apply(this, arguments);
  };
}();

var _styles = require('../styles/styles');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function alignChildren(instance, alignWithContext, alignThroughProp) {
  return instance.options.align = alignWithContext ? alignWithContext : alignThroughProp;
}exports.renderText = renderText;
exports.alignChildren = alignChildren;
exports.renderNodes = renderNodes;