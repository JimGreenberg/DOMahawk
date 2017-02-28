var DomNodeCollection = require("./dom_node_collection.js");

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
