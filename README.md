#DOMahawk
DOMahawk is a lightweight, flexible and feature-rich JavaScript library inspired by the industry standard library jQuery.
You can check out a demo here: [Live Demo](http://www.jim-greenberg.com/scissor-io/)

##API
Currently, DOMahawk serves three main purposes, all of which are expressed as functions namespaced as `$hawk`:
  1. To convert an item into a `DomNodeCollection` which can be manipulated
  ```javascript
  $hawk("#element") // returns a DomNodeCollection object
  ```
  Currently, the following are valid inputs to the `$hawk` function: `string`, `array`, `object`

  2. Serve as a document-ready callback wrapper
  ```javascript
  $hawk(() => {
    // Your code here...
    });
  ```
  Additionally, `$hawk` will take in `function` inputs to be called when the document has loaded

  3. Make AJAX requests
  ```javascript
  $hawk.ajax({
    url: `http://www.example.com`,
    method: GET,
    success: exampleCallback,
    error: exampleErrorCallback,
    data: {}
  });
  ```
  `$hawk.ajax()` will return a JavaScript Promise

##Event Handlers
  - [`#on`](#on)
  - [`#off`](#off)

###`#on(type, callback)`
Takes in a `DOM Event` type and a callback and adds an event listener to each HTMLElement in the `DOMNodeCollection`.
###`#off(type)`
Takes in a `DOM Event` type and removes the specified event listener from each HTMLElement in the `DOMNodeCollection`. Passing no argument removes all event listeners instead.

##DOMNodeCollection
  - [`#each`](#each)
  - [`#html`](#html)
  - [`#empty`](#empty)
  - [`#append`](#append)
  - [`#remove`](#remove)
  - [`#attr`](#attr)
  - [`#addClass`](#addClass)
  - [`#removeClass`](#removeClass)
  - [`#toggleClass`](#toggleClass)
  - [`#children`](#children)
  - [`#parent`](#parent)
  - [`#find`](#find)


###`#each(callback)`
Traverses each HTMLElement in the `DomNodeCollection` and executes the given `callback` on each.
###`#html(string)`
Getter/setter method for the `innerHTML` of each HTMLElement in the `DomNodeCollection`, sets `innerHTML` to the `string` argument, if no argument is given will act as a getter.
###`#empty()`
Clears the `innerHTML` for each HTMLElement in the `DomNodeCollection`.
###`#append(children)`
Adds each element of `children` to the direct children for each HTMLElement in the `DomNodeCollection`. `children` can be an object, string or `DomNodeCollection`.
###`#remove()`
Removes all children for each HTMLElement in the `DomNodeCollection`. To remove a specific child see `HTMLElement#removeChild()`.
###`#attr(string, setTo)`
Getter/setter method for the attributes of each HTMLElement in the `DomNodeCollection`. Will set the attribute specified by `string` to `setTo`- or if `setTo` is not given will return the value for the specified attribute.
###`#addClass(string)`
Appends the given `string` CSS class to the attribute `class`. Duplicate entries will be ignored.
###`#removeClass(string)`
Removes the given `string` CSS class from the attribute `class`.
###`#toggleClass(string)`
If the CSS class specified by `string` is not present, will add it- otherwise will remove it.
###`#children()`
Returns a new `DomNodeCollection` containing all of the direct descendants of the `DomNodeCollection` that it was called on.
###`#parent()`
Returns a new `DomNodeCollection` containing all of the direct parents of the `DomNodeCollection` that it was called on.
###`#find(string)`
Returns a new `DomNodeCollection` for any HTMLElement in the `DomNodeCollection` that matches the given query selector specified by `string`.
