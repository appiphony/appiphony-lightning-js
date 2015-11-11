if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {
    $.fn.iconGroup = function(options) {
        var isSelected = 'slds-is-selected';
        var notSelected = 'slds-not-selected';
        var settings = $.extend({
            type: 'sort', // toggle, switch
            defaultIconId: '',
            onChange: function(obj) {},
            assetsLocation: $.aljs.assetsLocation
            // These are the defaults
        }, options);
        
        if (this.length === 1 && typeof options !== 'string') { // If initializing plugin with options
            return this.each(function() {
                var buttons = $('.slds-button', this);
                buttons.click(function() {
                    if ($(this).hasClass(isSelected) && (settings.type === 'toggle' || settings.type === 'switch')) {
                        $(this).removeClass(isSelected)
                            .addClass(notSelected);
                    }
                });
            });
        } else if (typeof options === 'string') { // If calling a method
            return this.each(function() {
                switch(options) {
                    case 'select':
                        break;
                        
                    case 'deselect':
                        
                        break;
                        
                    default:
                        console.error('The method you entered does not exist');
                }
            });
        } else {
            throw new Error("This plugin can only be run with a selector, or with a command")
        }
    }
}(jQuery));