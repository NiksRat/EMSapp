'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styleSerializer = exports.applyImageProps = exports.applyStyles = undefined;

var _chromaJs = require('chroma-js');

var _chromaJs2 = _interopRequireDefault(_chromaJs);

var _isHexadecimal = require('validator/lib/isHexadecimal');

var _isHexadecimal2 = _interopRequireDefault(_isHexadecimal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get the hex value or the color name
 * @param {string} value hex or color name
 */
function getHexOrColor(value) {
  if (typeof value === 'undefined') {
    return (0, _isHexadecimal2.default)('undefined');
  } else if ((0, _isHexadecimal2.default)(value)) {
    return value.replace('#', '');
  }
  return (0, _chromaJs2.default)(value).hex().replace('#', '');
}

/**
 * Function to apply the styles to a component
 * @param {Object} props Component props
 */
function applyStyles(props) {
  if (Object.keys(props) === 0) {
    return {};
  }

  var backgroundColor = props.backgroundColor,
      color = props.color,
      fontSize = props.fontSize,
      fontFace = props.fontFace,
      bold = props.bold,
      border = props.border,
      underline = props.underline,
      italic = props.italic,
      highlight = props.highlight,
      borderSize = props.borderSize,
      borderColor = props.borderColor,
      link = props.link;


  return {
    back: getHexOrColor(backgroundColor),
    color: getHexOrColor(color),
    highlight: getHexOrColor(highlight),
    italic: italic,
    underline: underline,
    bold: bold,
    border: border,
    borderColor: getHexOrColor(borderColor),
    borderSize: borderSize,
    font_size: fontSize,
    font_face: fontFace,
    link: link
  };
}

/**
 * Function to apply style attributes to <Image /> component
 * @param {Object} props Component props
 */
function imageProps(props) {
  var width = props.width,
      height = props.height;


  return {
    cx: parseInt(width, 10),
    cy: parseInt(height, 10)
  };
}

/**
 * Function to apply style attributes to <Image /> component without style prop 
 * @param {Object} Component props
 */
function addStyles(props) {
  return {
    cx: props.width ? parseInt(props.width, 10) : null,
    cy: props.height ? parseInt(props.height, 10) : null
  };
}

/**
 * Function to add <Image /> related attributes with or without using style prop
 * @param {Object} props Component props
 */
function applyImageProps(props) {
  return props.style ? imageProps(props.style) : addStyles(props);
}

/**
 * Function to serialize style properties for <Table /> component according to open office xml
 * @param {Object} values style attributes for table
 */
function styleSerializer(values) {
  var bold = values.bold,
      size = values.size,
      color = values.color,
      align = values.align,
      vAlign = values.vAlign,
      fontFamily = values.fontFamily,
      fill = values.fill,
      cellColWidth = values.cellColWidth;


  return {
    b: bold,
    sz: size,
    color: getHexOrColor(color),
    align: align,
    vAlign: vAlign,
    fontFamily: fontFamily,
    fill: getHexOrColor(fill),
    cellColWidth: cellColWidth
  };
}

exports.applyStyles = applyStyles;
exports.applyImageProps = applyImageProps;
exports.styleSerializer = styleSerializer;