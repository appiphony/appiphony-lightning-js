(function($) {
    $.fn.picklist = function(options) {
        var settings = $.extend({
            assetsLocation: ''
        }, options);
        var dropdown = $('.slds-dropdown');
        var checkmarkIcon = '<svg aria-hidden="true" class="slds-icon slds-icon--small slds-icon--left"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + settings.assetsLocation + '/assets/icons/standard-sprite/svg/symbols.svg#task2"></use></svg>';
        
        return this.each(function() {
            var target = $('.slds-dropdown', this);
            var trigger = $('.slds-button', this);
            var option = $('.slds-dropdown__item a', this);
            var valueContainer = $('.slds-truncate', trigger);
            
            target.hide();
            
            trigger.unbind() // Prevent multiple bindings
                .click(function() {
                    if (target.is(':hidden')) {
                        dropdown.hide(); // Close all dropdowns before opening
                        target.show();
                    } else {
                        target.hide();
                    }
                });
            
            option.click(function() {
                var value = $(this).html();
                
                option.parent()
                    .removeClass('slds-is-selected')
                    .find('.slds-icon')
                    .remove();
                
                $(this).append(checkmarkIcon)
                    .parent()
                    .addClass('slds-is-selected');
                
                target.hide();
                
                valueContainer.html(value);
            });
        });
    }
}(jQuery));