class DomNodeCollection {
  constructor(nodes) {
    this.nodes = nodes;
  }

  each(callback) {
    this.nodes.forEach(callback);
 }

  on(type, callback) {
    this.each(el => {
      const hawkEvent = `$hawk-e-${type}`;
      el[hawkEvent] = el[hawkEvent] || [];
      el[hawkEvent].push(callback);
      el.typeList = el.typeList || []; //typelist attribute for iteration to support mass event 'off'-ing
      el.typeList.push(hawkEvent);

      el.addEventListener(type, callback);
    });
  }

  off(type = null) {
    const hawkEvent = `$hawk-e-${type}`;
    this.each(el => {
      el.typeList.forEach(eventType => {
        if (type === null || hawkEvent === eventType) {//remove all event listeners if no arg is given
          el[eventType].forEach(callback => {
            el.removeEventListener(type, callback);
          });
          el[hawkEvent] = [];
        }
      });
    });
  }

  html(string = null) {
    if (string !== null) {
      this.each((el) => {el.innerHTML = string;});
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
      this.each(el => {
        el.setAttribute(attributeName, setTo);
      });
    }
  }

  addClass(...classes) {
    const newClasses = classes.join(" ");

    this.each(el => {
      let currentClasses = el.getAttribute("class");
      let allClasses = newClasses;

      if (currentClasses) {
        allClasses = currentClasses + " " + newClasses;
      }

      el.setAttribute("class", allClasses);
    });
  }

  removeClass(...classes) {
    this.each(el => {
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
    this.each(el => {children.push(el.children);});
    return new DomNodeCollection(children);
  }

  parent() {
    const parents = [];
    this.each(el => {
      let parent = el.parentElement;

      if (!parents.includes(parent) && parent !== null) {
        parents.push(parent);
      }
    });
    return new DOMNodeCollection(parents);
  }

  find(selector) {
    let found = [];

    this.each(el => {
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
