if (typeof _AljsApp === 'undefined') { throw new Error("Please include ember.aljs-init.js in your compiled Ember Application"); }

_AljsApp.AljsFormElementComponent = Ember.Component.extend({
    layoutName: 'components/aljs-form-element',
    classNames: 'slds-form-element'
});