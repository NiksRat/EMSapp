'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.WordRenderer = undefined;

var _RendererHostConfig;

var _emptyObject = require('fbjs/lib/emptyObject');

var _emptyObject2 = _interopRequireDefault(_emptyObject);

var _createElement = require('../utils/createElement');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /* eslint-disable */

var Reconciler = require('react-reconciler');

var RendererHostConfig = (_RendererHostConfig = {
	appendInitialChild: function appendInitialChild(parentInstance, child) {
		if (parentInstance.appendChild) {
			parentInstance.appendChild(child);
		} else {
			parentInstance.document = child;
		}
	},
	createInstance: function createInstance(type, props, internalInstanceHandle) {
		return (0, _createElement.createElement)(type, props);
	},
	createTextInstance: function createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
		return text;
	},
	finalizeInitialChildren: function finalizeInitialChildren(wordElement, type, props) {
		return false;
	},
	getPublicInstance: function getPublicInstance(inst) {
		return inst;
	},
	prepareForCommit: function prepareForCommit() {
		// noop
	},
	prepareUpdate: function prepareUpdate(wordElement, type, oldProps, newProps) {
		return true;
	},
	resetAfterCommit: function resetAfterCommit() {
		// noop
	},
	resetTextContent: function resetTextContent(wordElement) {
		// Redocx does not have a text node like DOM
	}
}, _defineProperty(_RendererHostConfig, 'createInstance', function createInstance(type, props, internalInstanceHandle) {
	// 'internalInstanceHandle' is not transparent here. So use host context methods
	// to get data from roots
	return (0, _createElement.createElement)(type, props);
}), _defineProperty(_RendererHostConfig, 'getRootHostContext', function getRootHostContext(instance) {
	// getHostContextNode here updates the internal state of createElement and stores a ref to current instance
	return (0, _createElement.getHostContextNode)(instance);
}), _defineProperty(_RendererHostConfig, 'getChildHostContext', function getChildHostContext() {
	return _emptyObject2.default;
}), _defineProperty(_RendererHostConfig, 'shouldSetTextContent', function shouldSetTextContent(type, props) {
	return false; // Redocx does not have a text node like DOM
}), _defineProperty(_RendererHostConfig, 'now', function now() {}), _defineProperty(_RendererHostConfig, 'useSyncScheduling', true), _defineProperty(_RendererHostConfig, 'mutation', {
	appendChild: function appendChild(parentInstance, child) {
		if (parentInstance.appendChild) {
			parentInstance.appendChild(child);
		} else {
			parentInstance.document = child;
		}
	},
	appendChildToContainer: function appendChildToContainer(parentInstance, child) {
		if (parentInstance.appendChild) {
			parentInstance.appendChild(child);
		} else {
			parentInstance.document = child;
		}
	},
	removeChild: function removeChild(parentInstance, child) {
		parentInstance.removeChild(child);
	},
	removeChildFromContainer: function removeChildFromContainer(parentInstance, child) {
		parentInstance.removeChild(child);
	},
	insertBefore: function insertBefore(parentInstance, child, beforeChild) {
		// noob
	},
	commitUpdate: function commitUpdate(instance, updatePayload, type, oldProps, newProps) {
		// noop
	},
	commitMount: function commitMount(instance, updatePayload, type, oldProps, newProps) {
		// noop
	},
	commitTextUpdate: function commitTextUpdate(textInstance, oldText, newText) {
		textInstance.children = newText;
	}
}), _RendererHostConfig);

var WordRenderer = Reconciler(RendererHostConfig);

exports.WordRenderer = WordRenderer;