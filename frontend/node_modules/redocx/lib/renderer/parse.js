"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Render the component (passed to docx generator instance)
 * This is similar to react-pdf https://github.com/diegomura/react-pdf/blob/master/packages/react-pdf/src/index.js
 * @param {Object} input Root component
 */
var parse = function parse(input) {
  var parseComponent = function () {
    var _ref = _asyncToGenerator(function* (inputComponent) {
      // This property is accessed due to https://github.com/nitin42/redocx/blob/master/src/renderer/renderer.js#L32  
      var document = inputComponent.document;

      yield document.render();
      // Return the input component again because we rendered the children
      // which weren't wrapped inside a parent.
      // We async called the render method on all of the children.
      return inputComponent;
    });

    return function parseComponent(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var toBuffer = function () {
    var _ref2 = _asyncToGenerator(function* () {
      return yield parseComponent(input);
    });

    return function toBuffer() {
      return _ref2.apply(this, arguments);
    };
  }();

  return {
    toBuffer: toBuffer
  };
};

exports.default = parse;