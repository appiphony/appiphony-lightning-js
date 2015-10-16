(function($) {
    $.fn.picklist = function(options) {
        var settings = $.extend({
            assetsLocation: '',
            onChange: function() {}
        }, options);
        var dropdowns = $('.slds-picklist .slds-dropdown');
        var bodyTag = $('body');
        var checkmarkIcon = '<svg aria-hidden="true" class="slds-icon slds-icon--small slds-icon--left"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + settings.assetsLocation + '/assets/icons/standard-sprite/svg/symbols.svg#task2"></use></svg>';
        
        dropdowns.hide();
        
        function bindTrigger(obj) {
            var trigger = $('.slds-button', obj);
            var target = $('.slds-dropdown', obj);
            var choices = $('.slds-dropdown__item a', obj);
            
            target.hide();
            
            trigger.unbind() // Prevent multiple bindings
                .click(function(e) {
                    e.stopPropagation();
                
                    if (target.is(':hidden')) {
                        dropdowns.hide(); // Close all dropdowns before opening
                        target.show();
                        choices.first()
                            .focus();
                    } else {
                        target.hide();
                    }
                });
            
            bodyTag.click(function() { target.hide(); });
        }
        
        function bindChoices(obj) {
            var trigger = $('.slds-button', obj);
            var target = $('.slds-dropdown', obj);
            var choices = $('.slds-dropdown__item a', obj);
            var valueContainer = $('> span', trigger);
            
            choices.unbind() // Prevent multiple bindings
                .click(function(e) {
                    e.stopPropagation();
                
                    var value = $(this).html();
                
                    settings.onChange.call(obj);
                    target.hide();
                    trigger.trigger('sljs.picklistchange') // Custom SLJS event
                        .focus();
                
                    valueContainer.html(value);
                    choices.parent()
                        .removeClass('slds-is-selected')
                        .find('.slds-icon')
                        .remove();
                
                    $(this).append(checkmarkIcon)
                        .parent()
                        .addClass('slds-is-selected');
                });
        }
        
        if (settings.selector && this.length === 1) { // If allowing for selector to trigger modals post-init
            return this.on('click', settings.selector, function(e) {
                var elements = $(settings.selector);
                
                elements.each(function() {
                    bindTrigger(this);
                    bindChoices(this);
                });
                
                $(e.target).click();
            });
        } else {
            return this.each(function() {
                bindTrigger(this);
                bindChoices(this);
            });
        }
    }
}(jQuery));