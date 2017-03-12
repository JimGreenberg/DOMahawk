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

	window.$hawk = selectors => {
	  switch(typeof(selectors)){
	    case "function":
	      return _addDocumentReadyCallback(selectors);
	    case "string":
	      return _getNodes(selectors);
	    case "object":
	      if(selectors instanceof HTMLElement){
	        return new DomNodeCollection([selectors]);
	      }
	  }
	};

	window.$hawk.extend = (object, ...addons) => {
	  addons.forEach(addon => {
	    for(var key in addon){
	      object[key] = addon[key];
	    }
	  });
	  return object;
	};


	$hawk.ajax = options => {
	  const xhr = new XMLHttpRequest();
	  const defaults = {
	    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	    method: "GET",
	    url: "",
	    success: () => {},
	    error: () => {},
	    data: {},
	  };

	  options = $hawk.extend(defaults, options);
	  options.method = options.method.toUpperCase();

	  xhr.open(options.method, options.url);
	  xhr.onload = e => {
	    if (xhr.status === 200 || xhr.status === 300) {
	      options.success(JSON.parse(xhr.response));
	    } else {
	      options.error(xhr.response);
	    }
	  };

	  xhr.send(JSON.stringify(options.data));
	};


	toQueryString = object => {
	  let result = "";
	  for(let key in object){
	    if (object.hasOwnProperty(key)){
	      result += key + "=" + object[key] + "&";
	    }
	  }
	  return result.substring(0, result.length - 1);
	};

	_addDocumentReadyCallback = callback => {
	  if(!_documentReady){
	    _documentReadyCallbacks.push(callback);
	  } else {
	    callback();
	  }
	};

	_getNodes = selector => {
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

	  on(type, callback) {
	    this.nodes.forEach(el => {
	      el[`type-${type}`] = el[`type-${type}`] || [];
	      el[`type-${type}`].push(callback);
	      el.typeList = el.typeList || [];
	      el.typeList.push(`type-${type}`);

	      el.addEventListener(type, callback);
	    });
	  }

	  off(type = null) {
	    if (type === null) {
	      this.nodes.forEach(el => {
	        el.typeList.forEach(eventType => {
	          el[eventType].forEach(callback => {
	            el.removeEventListener(eventType.split("type-")[1], callback);
	          });
	          el[`type-${eventType}`] = [];
	        });
	      });
	    } else {
	      this.nodes.forEach(el => {
	        el[`type-${type}`].forEach(callback => {
	          el.removeEventListener(type, callback);
	        });
	        el[`type-${type}`] = [];
	      });
	    }
	  }

	  html(string = null) {
	    if (string !== null) {
	      this.nodes.forEach((el) => {el.innerHTML = string;});
	    } else {
	      return this.nodes[0].innerHTML;
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

	  attr(attributeName, setTo=null) {
	    if (!setTo) {
	      this.nodes[0].getAttribute(attributeName);
	    } else {
	      this.nodes.forEach(el => {
	        el.setAttribute(attributeName, setTo);
	      });
	    }
	  }

	  addClass(...classes) {
	    const newClasses = classes.join(" ");

	    this.nodes.forEach(el => {
	      let currentClasses = el.getAttribute("class");
	      let allClasses = newClasses;

	      if (currentClasses) {
	        allClasses = currentClasses + " " + newClasses;
	      }

	      el.setAttribute("class", allClasses);
	    });
	  }

	  removeClass(...classes) {
	    this.nodes.forEach(el => {
	      let currentClasses = el.getAttribute("class").split(" ");
	      let newClasses = [];
	      for (var i = 0; i < currentClasses.length; i++) {
	        if (!classes.includes(currentClasses[i])) {
	          newClasses.push(currentClasses[i]);
	        }
	     }
	     el.setAttribute("class", newClasses.join(" "));
	   });
	  }

	  toggleClass(toggleClass) {
	    this.each(node => node.classList.toggle(toggleClass));
	  }

	  children() {
	    const children = [];
	    this.nodes.forEach(el => {children.push(el.children);});
	    return new DomNodeCollection(children);
	  }

	  parent() {
	    const parents = [];
	    this.nodes.forEach(el => {
	      let parent = el.parentElement;

	      if (!parents.includes(parent) && parent !== null) {
	        parents.push(parent);
	      }
	    });
	    return new DOMNodeCollection(parents);
	  }

	  find(selector) {
	    let found = [];

	    this.nodes.forEach(el => {
	      let query = Array.from(el.querySelectorAll(selector));
	      found = found.concat(query);
	    });

	    return new DOMNodeCollection(found);
	  }

	  _parseContent(content) {
	    if (content instanceof DOMNodeCollection) {
	      return content.nodes;
	    } else if (content instanceof HTMLElement) {
	      return [content];
	    } else if (typeof content === 'string' || content instanceof String) {
	      return [content];
	    }
	  }

	}
	module.exports = DomNodeCollection;


/***/ }
/******/ ]);
