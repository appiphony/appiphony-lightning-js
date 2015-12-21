if (typeof _AljsApp === 'undefined') { throw new Error("Please include ember.aljs-init.js in your compiled Ember Application"); }

_AljsApp.AljsNotificationComponent = Ember.Component.extend({
    layoutName: 'components/aljs-notification',
    attributeBindings: ['toast', 'visible', 'fadeDuration', 'duration', 'theme'],
    init : function(){
        this._super();
        this.set('visible', this.getWithDefault('visible', false));
        this.set('fadeDuration', this.getWithDefault('fadeDuration', 0));
        this.set('duration', this.getWithDefault('duration', 0));
        this.set('toast', this.getWithDefault('toast', false));
    },
    didInsertElement: function() {
    	var $el = this.$();
        this.set('el', $el);
    	var dismissClass = this.get('dismissClass');

        this.$().find('.slds-notify').addClass(this.get('class'));
        this.$().attr('class', '');

    	if (!Ember.isEmpty(dismissClass)) {
    		$el.find('.' + dismissClass).one('click', function(e) {
    			$el.addClass('slds-hide');
    		});
    	}
    },
    fadeNotification : function(){
        var self = this;
        var visible = !Ember.isEmpty(this.get('visible')) && this.get('visible').toString() == "true";
        var fadeDuration = parseInt(this.get('fadeDuration'));
        var duration = parseInt(this.get('duration'));
        Ember.run.scheduleOnce('afterRender', this, function(){
            var el = this.$().find('.fader');
            if(visible){
                el.fadeIn(fadeDuration, function(){
                    if(duration > 0){
                        var timeout = setTimeout(function(){
                            self.set('visible', false);
                        }, duration);
                        self.set('timeout' , timeout);
                    }
                })
            } else {
                clearTimeout(this.get('timeout'));
                el.fadeOut(fadeDuration);
            }
        });
    }.observes('visible').on('init')
});