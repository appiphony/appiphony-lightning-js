if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {
    var aljsBodyTag = $('body');
    var aljsModals = $('.slds-modal');
    var aljsRefocusTarget = null; // Element to refocus on modal dismiss
    
    function initModals() {
        var aljsScope = ($.aljs.scoped) ? $('.slds') : aljsBodyTag;
        
        $('.slds-modal-backdrop').remove(); // Remove any existing backdrops
        aljsScope.append('<div class="aljs-modal-container"></div>');
        
        var modalContainer = $('.aljs-modal-container');
        
        aljsModals.appendTo(modalContainer)
            .append('<div class="slds-modal-backdrop"></div>')
            .attr('aria-hidden', 'true')
            .addClass('slds-hide');
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
        var modalObj = {};
        modalObj.self = this;
        modalObj.ariaTarget = $('> *:not(.aljs-modal-container, script, link, meta)', aljsBodyTag);
        modalObj.tabTarget = $('[href], [contentEditable="true"], button, a, input, textarea', modalObj.ariaTarget);
        modalObj.hasSelector = (args && args.hasOwnProperty('selector')) ? true : false;
        
        if (args !== null && typeof args === 'string') { // If calling an action
            var settings = $.extend({
                    selector: null,
                    dismissSelector: '[data-aljs-dismiss="modal"]',
                    backdropDismiss: false,
                    onShow: function(obj) {},
                    onDismiss: function(obj) {}
                }, options);
            var dismissModalElement = $(settings.dismissSelector);
            var modalElements = $('.slds-modal__header, .slds-modal__content, .slds-modal__footer');
            
            function keyUpCheck(e) {
                if (e.keyCode == 27 && aljsModals.is(':visible')) dismissModal(); // Esc key
            }
            
            function dismissModal() {
                modalObj.self.modal('dismiss', settings)
                    .unbind('click');
                aljsBodyTag.unbind('keyup', keyUpCheck);
                aljsModals.unbind('click');
                dismissModalElement.unbind('click');
            }
            
            switch (args) {
                case 'show':
                    modalObj.id = this.attr('id');
                    
                    $('.slds-modal-backdrop').remove(); // Remove any existing backdrops
                    $('.aljs-modal-container').append('<div class="slds-modal-backdrop"></div>');
                    
                    aljsBodyTag.keyup(keyUpCheck);
                    modalObj.self.removeClass('slds-fade-in-open')
                        .attr('aria-hidden', 'false')
                        .addClass('slds-show');
                    
                    dismissModalElement.click(function(e) { // Bind events based on options
                        e.preventDefault();
                        dismissModal();
                    });
                    
                    if (settings.backdropDismiss) {
                        aljsModals.click(dismissModal);
                        modalElements.click(function(e) { e.stopPropagation(); });
                    }
                    
                    modalObj.ariaTarget.attr('aria-hidden', 'true');
                    modalObj.tabTarget.attr('tabindex', '-1');
                    
                    setTimeout(function() { // Ensure elements are displayed and rendered before adding classes
                        $('.slds-modal-backdrop').addClass('slds-modal-backdrop--open');
                        modalObj.self.addClass('slds-fade-in-open')
                            .trigger('show.aljs.modal'); // Custom aljs event
                        settings.onShow(modalObj);
                        setTimeout(function() {
                            modalObj.self.trigger('shown.aljs.modal'); // Custom aljs event
                        }, 400);
                    }, 25);
                    break;
                    
                case 'dismiss':
                    $('.slds-modal-backdrop').removeClass('slds-modal-backdrop--open');
                    settings.onDismiss(modalObj);
                    modalObj.ariaTarget.attr('aria-hidden', 'false');
                    modalObj.tabTarget.removeAttr('tabindex');
                    modalObj.self.removeClass('slds-fade-in-open')
                        .attr('aria-hidden', 'true');
                    
                    if (aljsRefocusTarget !== null) aljsRefocusTarget.focus();
                    modalObj.self.trigger('dismiss.aljs.modal'); // Custom aljs event
                    
                    setTimeout(function() {
                        $('.slds-modal-backdrop').remove();
                        aljsRefocusTarget = null;
                        modalObj.self.addClass('slds-hide')
                            .trigger('dismissed.aljs.modal'); // Custom aljs event
                    }, 200);
                    break;
                    
                case 'trigger':
                    var modalId = modalObj.self.data('aljs-show');
                    var targetModal = $('#' + modalId);
                    
                    targetModal.modal('show', settings);
                    break;
                    
                default:
                    console.error('The action you entered does not exist');
            }
        } else if (modalObj.hasSelector && this.length === 1) { // If allowing for selector to trigger modals post-init
            function clickEvent(e) { showModal($(e.target), args); }
            
            initModals();
            this.on('click', args.selector, clickEvent);
        } else { // If initializing plugin with options
            initModals();
            modalObj.self.click(function() { showModal($(this), args); });
        }
        
        return this;
    }
}(jQuery));