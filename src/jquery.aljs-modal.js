if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {
    var aljsBodyTag = $('body');
    var aljsModals = $('.slds-modal');
    var aljsRefocusTarget = null; // Element to refocus on modal dismiss
    
    function initModals() {
        $('.slds-modal-backdrop').remove(); // Remove any existing backdrops
        aljsBodyTag.append('<div class="slds aljs-modal-container"></div>');
        
        var modalContainer = $('.aljs-modal-container');
        
        aljsModals.appendTo(modalContainer)
            .append('<div class="slds-modal-backdrop"></div>')
            .attr('aria-hidden', 'true')
            .hide();
    }
    
    function showModal(obj, args) {
        var modalId = obj.data('aljs-show');
        var targetModal = $('#' + modalId);
        
        if (modalId === undefined) console.error('No "data-aljs-show" attribute has been set');
        else {
            targetModal.modal('show', args);
            obj.blur();
            aljsRefocusTarget = obj;
        }
    }
    
    $.fn.modal = function(args, options) {
        var self = this;
        var ariaTarget = $('> *:not(.aljs-modal-container, script, link, meta)', aljsBodyTag);
        var tabTarget = $('[href], [contentEditable="true"], button, a, input, textarea', ariaTarget);
        var hasSelector = (args && args.hasOwnProperty('selector')) ? true : false;
        
        if (args !== null && typeof args === 'string') { // If calling an action
            var settings = $.extend({
                    selector: null,
                    dismissSelector: '[data-aljs-dismiss="modal"]',
                    backdropDismiss: false,
                    onShow: function() {},
                    onDismiss: function() {}
                }, options);
            var dismissModalElement = $(settings.dismissSelector);
            var modalElements = $('.slds-modal__header, .slds-modal__content, .slds-modal__footer');
            
            function keyUpCheck(e) {
                if (e.keyCode == 27 && aljsModals.is(':visible')) dismissModal(); // Esc key
            }
            
            function dismissModal() {
                self.modal('dismiss', settings)
                    .unbind('click');
                aljsBodyTag.unbind('keyup', keyUpCheck);
                aljsModals.unbind('click');
                dismissModalElement.unbind('click');
            }
            
            switch (args) {
                case 'show':
                    $('.slds-modal-backdrop').remove(); // Remove any existing backdrops
                    $('.aljs-modal-container').append('<div class="slds-modal-backdrop"></div>');
                    
                    aljsBodyTag.keyup(keyUpCheck);
                    self.removeClass('slds-fade-in-open')
                        .attr('aria-hidden', 'false')
                        .show();
                    
                    dismissModalElement.click(function(e) { // Bind events based on options
                        e.preventDefault();
                        dismissModal();
                    });
                    
                    if (settings.backdropDismiss) {
                        aljsModals.click(dismissModal);
                        modalElements.click(function(e) { e.stopPropagation(); });
                    }
                    
                    ariaTarget.attr('aria-hidden', 'true');
                    tabTarget.attr('tabindex', '-1');
                    
                    setTimeout(function() { // Ensure elements are displayed and rendered before adding classes
                        $('.slds-modal-backdrop').addClass('slds-modal-backdrop--open');
                        self.addClass('slds-fade-in-open')
                            .trigger('aljs.modalshow'); // Custom aljs event
                        settings.onShow.call(self);
                    }, 25);
                    break;
                    
                case 'dismiss':
                    $('.slds-modal-backdrop').removeClass('slds-modal-backdrop--open');
                    settings.onDismiss.call(self);
                    ariaTarget.attr('aria-hidden', 'false');
                    tabTarget.removeAttr('tabindex');
                    self.removeClass('slds-fade-in-open')
                        .attr('aria-hidden', 'true');
                    
                    if (aljsRefocusTarget !== null) aljsRefocusTarget.focus();
                    
                    setTimeout(function() {
                        $('.slds-modal-backdrop').remove();
                        aljsRefocusTarget = null;
                        self.hide()
                            .trigger('aljs.modaldismiss'); // Custom aljs event
                    }, 400);
                    break;
                    
                case 'trigger':
                    var modalId = self.data('aljs-show');
                    var targetModal = $('#' + modalId);
                    
                    targetModal.modal('show', settings);
                    break;
                    
                default:
                    console.error('The action you entered does not exist');
            }
        } else if (hasSelector && this.length === 1) { // If allowing for selector to trigger modals post-init
            function clickEvent(e) { showModal($(e.target), args); }
            
            initModals();
            this.on('click', args.selector, clickEvent);
        } else { // If initializing plugin with options
            initModals();
            self.click(function() { showModal($(this), args); });
        }
        
        return this;
    }
}(jQuery));