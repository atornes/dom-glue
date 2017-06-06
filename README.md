# dom-glue
Very simple library to simplify two tasks.
1. Binding data from a model to a element property.
2. Attach event handlers to elements.

Warning: Very alpha, not well tested and many features are missing.

## Dependencies
proxy-observe https://github.com/anywhichway/proxy-observe  
Proxy interface should be supported in browser  
ES2015, 2016, 2017 features are used without consideration.   

## Basic usage
```html
<script type="text/javascript" src="proxy-observe.js"></script>
<script type="text/javascript" src="dom-glue.js"></script>
```

```javascript
let theModel = { deep:{deep2:{deep3:"Bound from model"}} };

let config = {
    scope: "#parent",
    bind: [
        ["#head1", "textContent", "deep.deep2.deep3"],
        ["#input1", "value", "deep.deep2.deep3"]
    ],
    events: [
        ["#button1", "click", (event, model) => model.deep.deep2.deep3 = "Button clicked" + new Date().getMilliseconds()],
        ["#input1", "keyup blur", (event, model) => model.deep.deep2.deep3 = event.target.value]
    ]
};

let glue = new DomGlue(theModel, config);
```

See example in index.html