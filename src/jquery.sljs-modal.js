(function($) {
    var sljsBodyTag = $('body');
    var sljsModals = $('.slds-modal');
    
    function initModals(element) {
        $('.slds-modal-backdrop').remove(); // Remove any existing backdrops
        sljsBodyTag.append('<div class="slds sljs-modal-container"></div>');
        
        var modalContainer = $('.sljs-modal-container');
        
        sljsModals.appendTo(modalContainer)
            .append('<div class="slds-modal-backdrop"></div>')
            .hide();
    }
    
    function bindClick(obj, args) {
        var modalId = obj.data('sljs-show');
        var targetModal = $('#' + modalId);
        
        if (modalId === undefined) console.error('No "data-sljs--show" attribute has been set.');
        else targetModal.modal('show', args);
    }
    
    $.fn.modal = function(args, options) {
        var self = this;
        var ariaTarget = $('> *:not(.sljs-modal-container, script, link, meta)', sljsBodyTag);
        var hasSelector = (args && args.hasOwnProperty('selector')) ? true : false;
        
        if (args !== null && typeof args === 'string') { // If calling an action
            var settings = $.extend({
                    selector: null,
                    dismissModalSelector: '[data-sljs-dismiss="modal"]',
                    backdropDismiss: false,
                    onShow: function() {},
                    onDismiss: function() {}
                }, options);
            var dismissModalElement = $(settings.dismissModalSelector);
            var modalElements = $('.slds-modal__header, .slds-modal__content, .slds-modal__footer');
            
            function keyUpCheck(e) {
                if (e.keyCode == 27 && sljsModals.is(':visible')) dismissModal(); // Esc key
            }
            
            function dismissModal() {
                self.modal('dismiss', settings)
                    .unbind('click');
                sljsBodyTag.unbind('keyup', keyUpCheck);
                dismissModalElement.unbind('click');
            }
            
            switch (args) {
                case 'show':
                    $('.slds-modal-backdrop').remove(); // Remove any existing backdrops
                    $('.sljs-modal-container').append('<div class="slds-modal-backdrop"></div>');
                    
                    sljsBodyTag.keyup(keyUpCheck);
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
                    console.log('show');
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
                    console.log('dismiss');
                    break;
                    
                case 'trigger':
                    var modalId = self.data('sljs-show');
                    var targetModal = $('#' + modalId);
                    
                    targetModal.modal('show', settings);
                    break;
                    
                default:
                    console.error('The action you entered does not exist.');
            }
        } else if (hasSelector && this.length === 1) { // If allowing for selector to trigger post-init
            function clickEvent(e) { bindClick($(e.target), args); }
            
            initModals($(args.selector));
            this.on('click', args.selector, clickEvent);
        } else { // If initializing plugin with options
            initModals(self);
            self.click(function() { bindClick($(this), args); });
        }
        
        return this;
    }
}(jQuery));