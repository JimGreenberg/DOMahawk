var DomNodeCollection = require("./dom_node_collection.js");

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
