if (typeof _AljsApp === 'undefined') { throw new Error("Please include ember.aljs-init.js in your compiled Ember Application"); }

_AljsApp.AljsNotificationComponent = Ember.Component.extend({
    layoutName: 'components/aljs-notification',
    attributeBindings: ['toast'],
});