if (typeof _AljsApp === 'undefined') { throw new Error("Please include ember.aljs-init.js in your compiled Ember Application"); }

_AljsApp.AljsCheckboxComponent = Ember.Component.extend({
	layoutName: 'components/aljs-checkbox',
	tagName: 'label',
	classNames: 'slds-checkbox',
	classNameBindings: ['customClasses'],
	attributeBindings: ['for', 'checked', 'data-qa-checkbox', 'label'],
	didInsertElement: function() {
		this.set('for', this.$().find('input').attr('id'));
	}
});