/* ------------------------------------------------------------
ALJS Modal
------------------------------------------------------------ */
if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {
    var aljsBodyTag = 'body';
    var aljsModals = $('.slds-modal');
    var aljsRefocusTarget = null; // Element to refocus on modal dismiss
    var isShowing, aljsScope;
    
    function initModals() {        
        aljsScope = ($.aljs.scoped) ? (typeof($.aljs.scopingClass) === 'string') ? '.' + $.aljs.scopingClass : '.slds-scope' :  aljsBodyTag;
        
        $('.slds-backdrop').remove(); // Remove any existing backdrops
        $(aljsScope).append('<div class="aljs-modal-container"></div>');
        
        var modalContainer = $('.aljs-modal-container');
        
        aljsModals.appendTo(modalContainer)
            .append('<div class="slds-backdrop"></div>')
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
        modalObj.$el = this;
        modalObj.hasSelector = (args && args.hasOwnProperty('selector')) ? true : false;
        
        if (args !== null && typeof args === 'string') { // If calling a method
            var settings = $.extend({
                    selector: null,
                    dismissSelector: '[data-aljs-dismiss="modal"]',
                    backdropDismiss: false,
                    onShow: function(obj) {},
                    onShown: function(obj) {},
                    onDismiss: function(obj) {},
                    onDismissed: function(obj) {}
                    // These are the defaults
                }, options);
            var dismissModalElement = $(settings.dismissSelector);
            var modalElements = $('.slds-modal__header, .slds-modal__content, .slds-modal__footer');
            
            function processKeyup(e) {
                if (e.which == 27 && aljsModals.is(':visible')) dismissModal(); // Esc key
            }
            
            function dismissModal() {
                modalObj.$el.modal('dismiss', settings)
                    .unbind('click');
                aljsModals.unbind('click');
                dismissModalElement.unbind('click');
                $(aljsBodyTag).unbind('keyup', processKeyup);
            }
            
            switch (args) {
                case 'show':
                    isShowing = true;

                    modalObj.id = this.attr('id');
                    
                    // Close existing modals
                    $('.slds-modal').removeClass('slds-fade-in-open slds-show')
                                    .addClass('slds-hide')
                                    .attr('aria-hidden', 'true')
                                    .attr('tabindex', -1);

                    $('.slds-backdrop').remove(); // Remove any existing backdrops
                    $('.aljs-modal-container').append('<div class="slds-backdrop"></div>');
                    
                    modalObj.$el.addClass('slds-show')
                        .removeClass('slds-hide')
                        .attr('aria-hidden', 'false')
                        .attr('tabindex', 1);
                    
                    setTimeout(function() { // Ensure elements are displayed and rendered before adding classes
                        var backdrop = $('.slds-backdrop');
                        var handleTransitionEnd = function() {
                            modalObj.$el.trigger('shown.aljs.modal'); // Custom aljs event
                            settings.onShown(modalObj);
                            isShowing = false;
                            $(aljsBodyTag).unbind('keyup', processKeyup)
                                .bind('keyup', processKeyup);
                            
                            dismissModalElement.click(function(e) { // Bind events based on options
                                e.preventDefault();
                                dismissModal();
                            });
                            
                            if (settings.backdropDismiss) {
                                aljsModals.click(dismissModal);
                                modalElements.click(function(e) { e.stopPropagation(); });
                            }
                        };
                        
                        backdrop.one('transitionend', handleTransitionEnd)
                            .addClass('slds-backdrop--open');
                        modalObj.$el.addClass('slds-fade-in-open')
                            .trigger('show.aljs.modal'); // Custom aljs event
                        settings.onShow(modalObj);
                    }, 25);
                    break;
                    
                case 'dismiss':
                    if (!isShowing) {
                        var backdrop = $('.slds-backdrop');
                        var handleTransitionEnd = function() {
                            if (!isShowing) backdrop.remove();
                            
                            aljsRefocusTarget = null;
                            modalObj.$el.addClass('slds-hide')
                                .removeClass('slds-show')
                                .trigger('dismissed.aljs.modal'); // Custom aljs event
                            settings.onDismissed(modalObj);
                        };
                        
                        backdrop.one('transitionend', handleTransitionEnd)
                            .removeClass('slds-backdrop--open');
                    }
                    
                    settings.onDismiss(modalObj);
                    modalObj.$el.removeClass('slds-fade-in-open')
                        .attr('aria-hidden', 'true')
                        .attr('tabindex', -1);
                    
                    if (aljsRefocusTarget !== null) aljsRefocusTarget.focus();
                    
                    modalObj.$el.trigger('dismiss.aljs.modal'); // Custom aljs event
                    break;
                    
                case 'trigger':
                    var modalId = modalObj.$el.data('aljs-show');
                    var targetModal = $('#' + modalId);
                    
                    targetModal.modal('show', settings);
                    break;
                    
                default:
                    console.error('The method you entered does not exist');
            }
        } else if (modalObj.hasSelector && this.length === 1) { // If allowing for selector to trigger modals post-init
            function clickEvent(e) { showModal($(this), args); }
            
            initModals();
            this.on('click', args.selector, clickEvent);
        } else { // If initializing plugin with options
            initModals();
            modalObj.$el.click(function() { showModal($(this), args); });
        }
        
        return this;
    }
}(jQuery));