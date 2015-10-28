if (typeof _AljsApp === 'undefined') { throw new Error("Please assign your Ember App's namespace to _AljsApp (e.g. _AljsApp = App)"); }
assetsLocation = typeof assetsLocation !== 'undefined' ? assetsLocation : '';

Ember.Object.reopen({
    assetsLocation: assetsLocation
});

Ember.Component.reopen({
    attributeBindings: ['data-qa-button', 'data-open-modal', 'data-close-modal', 
                        'data-aljs-close', 'data-aljs-toggle',
                        'disabled', 'title', 'data-aljs', 'data-placement', 'aljs-title']
});