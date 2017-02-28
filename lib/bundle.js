/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var DomNodeCollection = __webpack_require__(1);

	const _documentReadyCallbacks = [];
	let _documentReady = false;

	window.$hawk = arg => {
	  switch(typeof(arg)){
	    case "function":
	      return addDocumentReadyCallback(arg);
	    case "string":
	      return getNodesFromDom(arg);
	    case "object":
	      if(arg instanceof HTMLElement){
	        return new DomNodeCollection([arg]);
	      }
	  }
	};

	$hawk.extend = (object, ...addons) => {
	  addons.forEach(addon => {
	    for(var val in addon){
	      object[val] = addon[val];
	    }
	  });
	  return object;
	};

	$hawk.ajax = options => {
	  const xhr = new XMLHttpRequest();
	  const defaults = {
	    method: "GET",
	    url: "",
	    success: () => {},
	    error: () => {},
	    data: {}
	  };

	  options = $hawk.extend(defaults, options);
	  options.method = options.method.toUpperCase();
	  if (options.method === "GET") {
	    options.url += "?" + toQueryString(options.data);
	  }

	  xhr.open(options.method, options.url, true);
	  xhr.onload = e => (
	    xhr.status === 200 ?
	     options.success(xhr.response) :
	     options.error(xhr.response)
	  );

	  xhr.send(options.data);
	};

	toQueryString = object => {
	  let result = "";
	  for(let value in object){
	    if (object.hasOwnProperty(value)){
	      result += value + "=" + object[value] + "&";
	    }
	  }
	  return result.substring(0, result.length - 1);
	};

	addDocumentReadyCallback = callback => {
	  if(!_documentReady){
	    _documentReadyCallbacks.push(callback);
	  } else {
	    callback();
	  }
	};

	getNodesFromDom = selector => {
	  const nodes = document.querySelectorAll(selector);
	  const arr = Array.from(nodes);
	  return new DomNodeCollection(arr);
	};

	document.addEventListener('DOMContentLoaded', () => {
	  _documentReadyCallbacks.forEach( callback => callback() );
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	class DomNodeCollection {
	  constructor(nodes) {
	    this.nodes = nodes;
	  }

	  each(callback) {
	   this.nodes.forEach(callback);
	 }

	 on(event, callback) {
	   this.each(node => {
	     node.addEventListener(event, callback);
	     const key = `${event}`;
	     if (typeof node[key] === "undefined") {
	       node[key] = [];
	     }
	     node[key].push(callback);
	   });
	 }

	 off(event) {
	   this.each(node => {
	     const key = `${event}`;
	     if (node[key]) {
	       node[key].forEach(callback => {
	         node.removeEventListener(event, callback);
	       });
	     }
	     node[key] = [];
	   });
	 }

	 html(html) {
	   if (typeof html === "string") {
	     this.each(node => node.innerHTML = html);
	   } else {
	     if (this.nodes.length > 0) {
	       return this.nodes[0].innerHTML;
	     }
	   }
	 }

	 empty() {
	   this.html("");
	 }

	 append(children) {
	   if (this.nodes.length === 0) return;

	   if (typeof children === 'object' &&
	       !(children instanceof DomNodeCollection)) {
	     children = $hawk(children);
	   }

	   if (typeof children === "string") {
	     this.each(node => node.innerHTML += children);
	   } else if (children instanceof DomNodeCollection) {
	     this.each(node => {
	       children.each(childNode => {
	         node.appendChild(childNode.cloneNode(true));
	       });
	     });
	   }
	 }

	 remove() {
	   this.each(node => node.parentNode.removeChild(node));
	 }

	 attr(key, val) {
	   if (typeof val === "string") {
	     this.each( node => node.setAttribute(key, val) );
	   } else {
	     return this.nodes[0].getAttribute(key);
	   }
	 }

	 addClass(newClass) {
	   this.each(node => node.classList.add(newClass));
	 }

	 removeClass(oldClass) {
	   this.each(node => node.classList.remove(oldClass));
	 }

	 find(selector) {
	   let foundNodes = [];
	   this.each(node => {
	     const nodeList = node.querySelectorAll(selector);
	     foundNodes = foundNodes.concat(Array.from(nodeList));
	   });
	   return new DomNodeCollection(foundNodes);
	 }

	 children() {
	   let childNodes = [];
	   this.each(node => {
	     const childNodeList = node.children;
	     childNodes = childNodes.concat(Array.from(childNodeList));
	   });
	   return new DomNodeCollection(childNodes);
	 }

	 parent() {
	   const parentNodes = [];
	   this.each(parentNode => {
	     parentNode.visited ? parentNodes.push(parentNode) : parentNode.visited = true;
	   });
	   parentNodes.forEach(node => node.visited = false);
	   return new DomNodeCollection(parentNodes);
	 }
	}

	module.exports = DomNodeCollection;


/***/ }
/******/ ]);