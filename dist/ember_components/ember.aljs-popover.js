if (typeof _AljsApp === 'undefined') { throw new Error("Please include ember.aljs-init.js in your compiled Ember Application"); }

_AljsApp.AljsPopoverComponent = Ember.Component.extend(Ember.Evented, {
    layoutName: 'components/aljs-popover',
    //classNames: 'slds-popover',
    classNameBindings: ['slds-hide'],
    tagName: 'span',
    attributeBindings: ['role', 'style'],
    style: function() {
        return this.get('isOpen') ? 'position: relative; display: inline-block;' : null;
    }.property('isOpen'),
    role: 'dialog',
    nubbinHeight: 15,
    nubbinWidth: 15,
    'slds-hide': function() {
        return !this.get('isOpen');
    }.property('isOpen'),
    willInsertElement: function(e) {
        var headerContents = this.$().find('popoverHeader').contents();
        var bodyContents = this.$().find('popoverBody').contents();

        if (Ember.isEmpty(headerContents)) {
            this.$().find('.slds-popover__header').remove();
        } else {
            this.$().find('headerYield').replaceWith(headerContents);
        }

        if (Ember.isEmpty(bodyContents)) {
            this.$().find('.slds-popover__body').remove();
        } else {
            this.$().find('bodyYield').replaceWith(bodyContents);
        }
    },
    didInsertElement: function() {
        Ember.run.scheduleOnce('afterRender', this, function() {
            var self = this;
            
            // $('body').on('click', '[data-open-popover="' + this.get('popoverId') + '"]', function() {
            //     self.openPopover();
            // });

            $('body').on('click', '[data-aljs-close="' + this.get('popoverId') + '"]', function() {
                self.closePopover();
            });

            $('body').on('click', '[data-aljs-toggle="' + this.get('popoverId') + '"]', function() {
                self.togglePopover();
            });

            //this.$().insertAfter('[data-toggle-popover="' + this.get('popoverId') + '"]');
        });
    },
    positionClass: function() {
        var nubbinPositionObject = {
            top: 'bottom',
            right: 'left',
            bottom: 'top',
            left: 'right'
        };

        return 'slds-nubbin--' + nubbinPositionObject[this.get('placement')];
    }.property('placement'),
    openPopover: function() {
        this.set('isOpen', true);

        Ember.run.scheduleOnce('afterRender', this, function() {
            this.positionPopover();
        });
    },
    closePopover: function() {
        this.set('isOpen', false);

        Ember.run.scheduleOnce('afterRender', this, function() {
            var $target = this.$().find('[data-aljs-toggle="' + this.get('popoverId') + '"]');
            $target.insertBefore(this.$());
            this.$().find('.slds-popover').attr('style', '')
                                          .trigger('dismissed.aljs.popover');
        });
    },
    togglePopover: function() {
        this.toggleProperty('isOpen');

        if (this.get('isOpen')) {
            Ember.run.scheduleOnce('afterRender', this, function() {
                this.positionPopover();
            });
        } else {
            Ember.run.scheduleOnce('afterRender', this, function() {
                var $target = this.$().find('[data-aljs-toggle="' + this.get('popoverId') + '"]');
                $target.insertBefore(this.$());
                this.$().find('.slds-popover').attr('style', '')
                                              .trigger('dismissed.aljs.popover');
            });
        }
    },
    positionPopover: function() {
        Ember.run.scheduleOnce('afterRender', this, function() {
            var nubbinHeight = this.get('nubbinHeight');
            var nubbinWidth = this.get('nubbinWidth');
            var popoverPosition = this.get('placement');
            var $target = $('[data-aljs-toggle="' + this.get('popoverId') + '"]');
            var $popoverNode = this.$().find('.slds-popover');
            
            $popoverNode.css('width', $popoverNode.innerWidth() + 'px');
            $popoverNode.css('position', 'absolute');

            if (popoverPosition === 'top' || popoverPosition === 'bottom') {
                $popoverNode.css('left', ($target.innerWidth() / 2) - ($popoverNode.innerWidth() / 2) + 'px'); 
                $popoverNode.css(popoverPosition, '-' + ($popoverNode.innerHeight() + nubbinHeight) + 'px');
            } else if (popoverPosition === 'left' || popoverPosition === 'right') {
                $popoverNode.css('top', ($target.outerHeight() / 2) - ($popoverNode.outerHeight() / 2) + 'px'); 
                $popoverNode.css(popoverPosition, '-' + ($popoverNode.innerWidth() + nubbinWidth) + 'px');
            }   

            $target.appendTo(this.$());
            $popoverNode.trigger('shown.aljs.popover');
        });     
    }
});