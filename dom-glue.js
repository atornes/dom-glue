
((w,d) => {
    

    w.DomGlue = {
        glue: (model, config) => {

            let scope = config.events.scope ? 
                    d.querySelector(config.events.scope) : d;

            if (config.events) {
                config.events.forEach(event => {
                    let element = scope.querySelector(event[0]);
                    element.addEventListener(event[1], ev => {
                        ev.preventDefault();
                        event[2](model, ev);
                        console.log(model);
                    });
                });
            }

            if (config.toDom) {
                model = Object.deepObserve(model, changeset => {
                    console.log("Change: ", changeset);
                    changeset.forEach(change => {
                        let mathedToDoms = config.toDom.filter(td => td[2] === change.keypath);
                        mathedToDoms.forEach(td => {
                            let element = scope.querySelector(td[0]);
                            element[td[1]] = change.newValue;
                        });
                    });
                });
            }

            if (config.toModel) {
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        console.log(mutation.type);
                    });    
                });

                // configuration of the observer:
                var obsConfig = { attributes: true, childList: true, characterData: true };
 
                config.toModel.forEach(tm => {
                    let el = scope.querySelector(tm[0]);
                    el = Object.deepObserve(el, changeset => {
                        console.log(changeset);
                    });
                    //observer.observe(el, obsConfig);
                });

                
            }
        }
    };
})(window,window.document);