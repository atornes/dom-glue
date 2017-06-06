'use strict';

export class DomGlue {
    constructor(model, config, doc = window.document) {
        this._model = model;

        this._scope = config.events.scope ? 
                doc.querySelector(config.events.scope) : doc;

        this._config = config;

        if (this._config.events) {
            this._initEvents();
        }

        if (this._config.bind) {
            this._initBindings();
            this._initBoundElements();
        }
    }

    _initEvents() {
        this._config.events.forEach(event => {

            let [selector, eventkeys, callback, preventDefault = true] = event;

            this.attachEventListeners(selector, eventkeys, callback, preventDefault);
        });
    }

    /*
    Attach event listener(s) for supplied element or a selector
     */
    attachEventListeners(elementOrSelector, eventkeys, callback, preventDefault = true) {
        let elements;

        if (elementOrSelector instanceof HTMLElement) {
            elements = [elementOrSelector];
        }
        else if (typeof elementOrSelector === "string") {
            elements = this._scope.querySelectorAll(elementOrSelector);
        }

        eventkeys.split(" ").forEach(eventKey => { 
            elements.forEach(element => {
                element.addEventListener(eventKey, ev => {
                    if (preventDefault) {
                        ev.preventDefault();
                    }
                    console.info("Event fired: ", ev);
                    callback(ev, this._model);
                });
            });
        });
    }

    _initBindings() {
        this._model = Object.deepObserve(this._model, changeset => {
            changeset.forEach(change => {
                let matchedBinds = this._config.bind.filter(td => td[2] === change.keypath);
                matchedBinds.forEach(td => {
                    let elements = this._scope.querySelectorAll(td[0]);
                    elements.forEach(element => 
                        element[td[1]] = change.newValue
                    );
                });
            });

            console.info("Model changed: ", this._model);
        });
    }

    _initBoundElements(){
        this._config.bind.forEach(binding => {
            let elements = this._scope.querySelectorAll(binding[0]);
            elements.forEach(el => {
                el[binding[1]] = this._resolveKeypath(this._model, binding[2]);
            });
        });
    }

    _resolveKeypath(obj, path) {
        let r=path.split(".");
        if (path) {
            return this._resolveKeypath(obj[r.shift()], r.join("."));
        }
        return obj
    }
}