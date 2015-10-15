(function($) {    
    $.fn.modal = function(args, options) {
        var modals = $('.slds-modal');
        var self = this;
        var bodyTag = $('body');
        var ariaTarget = $('> *:not(.sljs-modal-container, script, link, meta)', bodyTag);
        
        if (args !== null && typeof args === 'string') { // If calling an action
            var settings = $.extend({
                    dismissModalSelector: '[data-dismiss="modal"]',
                    onShow: function() {},
                    onDismiss: function() {}
                }, options);
            var dismissModalElement = $(settings.dismissModalSelector);
            var modalElements = $('.slds-modal__header, .slds-modal__content, .slds-modal__footer');
            
            function keyUpCheck(e) {
                if (e.keyCode == 27 && modals.is(':visible')) dismissModal(); // Esc key
            }
            
            function dismissModal() {
                self.modal('dismiss', settings)
                    .unbind('click');
                bodyTag.unbind('keyup', keyUpCheck);
                dismissModalElement.unbind('click');
            }
            
            switch (args) {
                case 'show':
                    $('.slds-modal-backdrop').remove(); // Remove any existing backdrops
                    $('.sljs-modal-container').append('<div class="slds-modal-backdrop"></div>');
                    
                    bodyTag.keyup(keyUpCheck);
                    self.removeClass('slds-fade-in-open')
                        .show();
                    
                    setTimeout(function() { // Ensure elements are displayed and rendered before adding classes
                        $('.slds-modal-backdrop').addClass('slds-modal-backdrop--open');
                        self.addClass('slds-fade-in-open')
                            .trigger('sljs.modalshow'); // Custom SLJS event
                        settings.onShow.call(self);
                    }, 25);
                    
                    dismissModalElement.click(function(e) { // Bind events based on options
                        e.preventDefault();
                        dismissModal();
                    });
                    
                    ariaTarget.attr('aria-hidden', 'true');
                    break;
                    
                case 'dismiss':
                    $('.slds-modal-backdrop').removeClass('slds-modal-backdrop--open');
                    self.removeClass('slds-fade-in-open');
                    settings.onDismiss.call(self);
                    
                    setTimeout(function() {
                        $('.slds-modal-backdrop').remove();
                        self.hide()
                            .trigger('sljs.modaldismiss'); // Custom SLJS event
                    }, 400);
                    
                    ariaTarget.attr('aria-hidden', 'false');
                    break;
                    
                case 'trigger':
                    var modalId = self.data('show');
                    var targetModal = $('#' + modalId);
                    
                    targetModal.modal('show', settings);
                    break;
                    
                default:
                    console.error('The action you entered does not exist.');
            }
        } else { // If initializing plugin with options
            $('.slds-modal-backdrop').remove(); // Remove any existing backdrops
            bodyTag.append('<div class="slds sljs-modal-container"></div>');
            
            var modalContainer = $('.sljs-modal-container');
            
            modals.appendTo(modalContainer)
                .append('<div class="slds-modal-backdrop"></div>')
                .hide();
            
            self.click(function(e) {
                e.preventDefault();
                
                var modalId = $(this).data('show');
                var targetModal = $('#' + modalId);
                
                if (modalId === undefined) console.error('No "data-show" attribute has been set.');
                else targetModal.modal('show', args);
            });
        }
        
        return this;
    }
}(jQuery));