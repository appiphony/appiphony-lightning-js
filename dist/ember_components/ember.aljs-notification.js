if (typeof _AljsApp === 'undefined') { throw new Error("Please include ember.aljs-init.js in your compiled Ember Application"); }

_AljsApp.AljsNotificationComponent = Ember.Component.extend({
    layoutName: 'components/aljs-notification',
    attributeBindings: ['toast'],
    didInsertElement: function() {
    	var $el = this.$();
    	var dismissClass = this.get('dismissClass');

        this.$().find('.slds-notify').addClass(this.get('class'));
        this.$().attr('class', '');

    	if (!Ember.isEmpty(dismissClass)) {
    		$el.find('.' + dismissClass).one('click', function(e) {
    			$el.addClass('slds-hide');
    		});
    	}
    }
});