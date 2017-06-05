'use strict';

class DomGlue {
    constructor(model, config, doc = window.document) {

        let scope = config.events.scope ? 
                doc.querySelector(config.events.scope) : doc;

        if (config.events) {
            this.attachEvents(config.events, model, scope);
        }

        if (config.bind) {
            this.createBindings(config.bind, model, scope);
            this.initBoundElements(config.bind, model, scope);
        }
    }

    attachEvents(events, model, scope) {
        events.forEach(event => {
            let element = scope.querySelector(event[0]);
            element.addEventListener(event[1], ev => {
                ev.preventDefault();
                console.info("Event fired: ", ev);
                event[2](ev, model);
            });
        });
    }

    createBindings(bindings, model, scope) {
        model = Object.deepObserve(model, changeset => {
            changeset.forEach(change => {
                let matchedBinds = bindings.filter(td => td[2] === change.keypath);
                matchedBinds.forEach(td => {
                    let element = scope.querySelector(td[0]);
                    element[td[1]] = change.newValue;
                });
            });

            console.info("Model changed: ", model);
        });
    }

    initBoundElements(bindings, model, scope){
        bindings.forEach(binding => {
            let elements = scope.querySelectorAll(binding[0]);
            elements.forEach(el => {
                el[binding[1]] = this.resolve(model, binding[2]);
            });
        });
    }

    resolve(obj, path) {
        
        let r=path.split(".");
        
        if (path) {
            return this.resolve(obj[r.shift()], r.join("."));
        }

        return obj
    }
}