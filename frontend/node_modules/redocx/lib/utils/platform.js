'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Platform = {
  OS: 'word',
  select: function select(obj) {
    return 'word' in obj ? obj.word : obj.default;
  }
};

exports.default = Platform;