'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validatePath = exports.validateElement = exports.openDocApp = exports.Events = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-unused-expressions */
/**
 * Open the doc app
 */
function openDocApp(file) {
  _os2.default.platform() === 'darwin' ? _execa2.default.shell('open -a pages ' + _path2.default.resolve(file)) : null;
}

/**
 * Document element
 * @param {Object} element 
 */
function validateElement(element) {
  if (!element) {
    throw new Error('Render method expected an element.');
  }

  if (typeof element === 'string') {
    throw new Error("Invalid component element. Instead of passing string like 'text', pass a class or functional component. For example - <Document />");
  }

  return true;
}

/**
 * Filepath for the document
 * @param {string} filePath 
 */
function validatePath(filePath) {
  if (filePath === null || filePath === undefined) {
    throw new Error('Please specify a file path for the document');
  }

  var fileName = _path2.default.basename(filePath);
  var pattern = '*.docx';

  if (!(0, _minimatch2.default)(fileName, pattern)) {
    throw new Error('Invalid filename \'' + _path2.default.basename(filePath) + '\'. Make sure the extension is \'.docx\'');
  }
  return true;
}

function Events(filePath, resolve, reject) {
  return {
    finalize: function finalize() {
      console.log('\u2728  Word document created at ' + _path2.default.resolve(filePath) + '.');
      resolve();
    },
    error: function error() {
      console.log('An error occurred while generating the document.');
      reject();
    }
  };
}

exports.Events = Events;
exports.openDocApp = openDocApp;
exports.validateElement = validateElement;
exports.validatePath = validatePath;