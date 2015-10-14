(function($) {
    $.fn.picklist = function(options) {
        var settings = $.extend({
            assetsLocation: '',
            callback: function() {}
        }, options);
        var dropdowns = $('.slds-dropdown');
        var checkmarkIcon = '<svg aria-hidden="true" class="slds-icon slds-icon--small slds-icon--left"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + settings.assetsLocation + '/assets/icons/standard-sprite/svg/symbols.svg#task2"></use></svg>';
        
        return this.each(function() {
            var trigger = $('.slds-button', this);
            var target = $('.slds-dropdown', this);
            var choices = $('.slds-dropdown__item a', this);
            var valueContainer = $('> span', trigger);
            var body = $('body');
            
            target.hide();
            
            trigger.unbind() // Prevent multiple bindings
                .click(function(e) {
                    e.stopPropagation();
                
                    if (target.is(':hidden')) {
                        dropdowns.hide(); // Close all dropdowns before opening
                        target.show();
                    } else {
                        target.hide();
                    }
                });
            
            choices.unbind() // Prevent multiple bindings
                .click(function(e) {
                    e.stopPropagation();
                
                    var value = $(this).html();
                
                    trigger.trigger('sljs.picklistchange'); // Custom SLJS event
                    settings.callback.call(this);
                    target.hide();
                
                    valueContainer.html(value);
                    choices.parent()
                        .removeClass('slds-is-selected')
                        .find('.slds-icon')
                        .remove();
                
                    $(this).append(checkmarkIcon)
                        .parent()
                        .addClass('slds-is-selected');
                });
            
            body.click(function() { target.hide(); });
        });
    }
}(jQuery));