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
