if (typeof _AljsApp === 'undefined') { throw new Error("Please include ember.aljs-init.js in your compiled Ember Application"); }

_AljsApp.AljsModalComponent = Ember.Component.extend(Ember.Evented, {
    init: function() {
        this._super();

        if (!($.fn.modal)) {
            $.fn.modal = function(option){
                this.each(function(){
                    if ($(this).hasClass('slds-modal')) {
                        $(this).trigger(option);
                    }
                    return $(this); // support chaining
                });    
            };
        }
    },
    layoutName: 'components/aljs-modal',
    click: function(e) {
        var $target = $(e.target);
        var clickedHeader = !Ember.isEmpty($target.closest('.slds-modal__header'));
        var clickedBody = !Ember.isEmpty($target.closest('.slds-modal__content'));
        var clickedFooter = !Ember.isEmpty($target.closest('.slds-modal__footer'));
        
        if ((!clickedHeader && !clickedBody && !clickedFooter && this.get('backgroundClickCloses'))
                || !Ember.isEmpty($target.closest('[data-aljs-dismiss="' + this.get('modalId') + '"]'))) {
            this.closeModal();
        } 
    },
    willInsertElement: function(e) {
        this.$().removeClass(this.get('class'));
        this.$().find('.slds-modal').addClass(this.get('class'));

        var headerContents = this.$().find('modalHeader').contents();
        var bodyContents = this.$().find('modalBody').contents();
        var footerContents = this.$().find('modalFooter').contents();

        if (Ember.isEmpty(headerContents)) {
            this.$().find('.slds-modal__header').remove();
        } else {
            this.$().find('headerYield').replaceWith(headerContents);
            this.$().find('modalHeader').remove();
            //this.$().find('.slds-modal__header').addClass(this.get('headerClass'));
        }

        if (Ember.isEmpty(bodyContents)) {
            this.$().find('.slds-modal__content').remove();
        } else {
            this.$().find('bodyYield').replaceWith(bodyContents);
            this.$().find('modalBody').remove();
            //this.$().find('.slds-modal__content').addClass(this.get('bodyClass'));
        }

        if (Ember.isEmpty(footerContents)) {
            this.$().find('.slds-modal__footer').remove();
        } else {
            this.$().find('footerYield').replaceWith(footerContents);
            this.$().find('modalFooter').remove();
        }
    },
    didInsertElement: function() {
        Ember.run.scheduleOnce('afterRender', this, function() {
            var modalId = this.get('modalId');

            $('body').on('click.' + modalId, '[data-aljs-show="' + modalId + '"]', this, this.openModal);

            this.$().find('.slds-modal').on('dismiss.' + modalId, this, this.closeModal)
                                        .on('show.' + modalId, this, this.openModal);
        });
    },
    willDestroyElement: function() {
        var eventNamespace = '.' + this.get('modalId');
        $('body').off(eventNamespace);
        this.$().find('.slds-modal').off(eventNamespace);
    },
    openModal: function(e) {
        var self = this;
        var tabTarget = $('[href], [contenteditable="true"], button, a, input, textarea, select', 'body');
        var modalTabTarget = $('[href], [contenteditable="true"], button, a, input, textarea, select', '.slds-modal');
        
        tabTarget.attr('tabindex', '-1');
        modalTabTarget.attr('tabindex', '1');

        if (e) {
            self = e.data;
        }

        if (self.isDestroyed || self.isDestroying) {
            return;
        }

        $('#' + self.get('modalId')).trigger('show.aljs.modal');

        self.set('isModalOpen', true);

        if (self.get('openFunction')) {
            var params = ['openFunction'];
            var paramNum = 1;

            while(!Ember.isEmpty(self.get('param' + paramNum))) {
                params.push(self.get('param' + paramNum));
                paramNum++;
            } 

            self.sendAction.apply(self, params);
        }

        $('body').on('keyup', function(e) {
            if (e.which === 27) {
                $(self).unbind('keyup');
                self.closeModal();
            }
        });

        Ember.run.later(self, function() {
            $('#' + this.get('modalId')).trigger('shown.aljs.modal');
        }, 400);
    },
    closeModal: function(e) {
        var self = this;
        var tabTarget = $('[href], [contenteditable="true"], button, a, input, textarea, select', 'body');
        
        tabTarget.removeAttr('tabindex');

        if (e) {
            self = e.data;
        }
        
        $('#' + self.get('modalId')).trigger('dismiss.aljs.modal');

        self.set('isModalOpen', false);

        Ember.run.later(self, function() {
            $('#' + this.get('modalId')).trigger('dismissed.aljs.modal');
        }, 200);
    }
});