if (typeof _AljsApp === 'undefined') { console.warn("Since you did not assign _AljsApp to your Ember application's global namespace, defaulting to App."); _AljsApp = App; }
assetsLocation = typeof assetsLocation !== 'undefined' ? assetsLocation : '';

Ember.Object.reopen({
    assetsLocation: assetsLocation
});

Ember.Component.reopen({
    attributeBindings: ['data-qa-button', 'data-open-modal', 'data-close-modal', 
                        'data-aljs-close', 'data-aljs-toggle',
                        'disabled', 'title', 'data-aljs', 'data-placement', 'aljs-title']
});