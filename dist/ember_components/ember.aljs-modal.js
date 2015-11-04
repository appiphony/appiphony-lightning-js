if (typeof _AljsApp === 'undefined') { throw new Error("Please include ember.aljs-init.js in your compiled Ember Application"); }

_AljsApp.AljsModalComponent = Ember.Component.extend(Ember.Evented, {
    init: function() {
        this._super();

        if (!($.fn.modal)) {
            $.fn.modal = function(option){
                $('.slds-fade-in-open').trigger('close');
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
        }

        if (Ember.isEmpty(bodyContents)) {
            this.$().find('.slds-modal__content').remove();
        } else {
            this.$().find('bodyYield').replaceWith(bodyContents);
            this.$().find('modalBody').remove();
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
            var self = this;
            
            $('body').on('click', '[data-aljs-show="' + this.get('modalId') + '"]', function() {
                self.openModal();
            });
        });
    },
    openModal: function() {
        var self = this;
        $('#' + this.get('modalId')).trigger('show.aljs.modal');

        this.set('isModalOpen', true);

        if (this.get('openFunction')) {
            var params = ['openFunction'];
            var paramNum = 1;

            while(!Ember.isEmpty(this.get('param' + paramNum))) {
                params.push(this.get('param' + paramNum));
                paramNum++;
            } 

            this.sendAction.apply(this, params);
        }

        $('body').on('keyup', function(e) {
            if (e.keyCode === 27) {
                $(this).unbind('keyup');
                self.closeModal();
            }
        });

        Ember.run.later(this, function() {
            $('#' + this.get('modalId')).trigger('shown.aljs.modal');
        }, 400);
    },
    closeModal: function() {
        $('#' + this.get('modalId')).trigger('dismiss.aljs.modal');

        this.set('isModalOpen', false);

        Ember.run.later(this, function() {
            $('#' + this.get('modalId')).trigger('dismissed.aljs.modal');
        }, 200);
    }
});