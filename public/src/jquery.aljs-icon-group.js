if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {
    $.fn.iconGroup = function(options) {
        var isSelected = 'slds-is-selected';
        var notSelected = 'slds-not-selected';
        var settings = $.extend({
            type: 'sort',
            defaultButtonId: '',
            onChange: function() {},
            assetsLocation: $.aljs.assetsLocation
            // These are the defaults
        }, options);
        
        function select(button) {
            button.removeClass(notSelected)
                .addClass(isSelected)
                .trigger('selected.aljs.button'); // Custom aljs event
        }
        
        function deselect(button) {
            button.removeClass(isSelected)
                .addClass(notSelected)
                .trigger('deselected.aljs.button'); // Custom aljs event
        }
        
        if (typeof options !== 'string') { // If initializing plugin with options
            var buttons = $('.slds-button', this);
            var defaultIcon = (settings.defaultButtonId === '') ? buttons.eq(0) : '#' + settings.defaultButtonId;
            
            if (settings.type === 'sort') {
                select($(defaultIcon));
            }
            
            buttons.click(function() {
                var target = $(this);
                
                if (target.hasClass(isSelected) && (settings.type === 'toggle' || settings.type === 'switch')) {
                    deselect(target);
                    settings.onChange();
                } else if (target.hasClass(notSelected) && settings.type === 'toggle') {
                    select(target);
                    settings.onChange();
                } else if (target.hasClass(notSelected) && (settings.type === 'switch' || settings.type === 'sort')) {
                    buttons.each(function() {
                        if ($(this) !== target && $(this).hasClass(isSelected)) deselect($(this));
                    });
                    
                    select(target);
                    settings.onChange();
                }
            });
            
            return this;
        } else if (typeof options === 'string') { // If calling a method
            return this.each(function() {
                switch(options) {
                    case 'select':
                        select($(this));
                        break;
                        
                    case 'deselect':
                        deselect($(this));
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