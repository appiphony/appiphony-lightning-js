if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {
    $.fn.iconGroup = function(options) {
        var iconGroupObj = {};
        var isSelected = 'slds-is-selected';
        var notSelected = 'slds-not-selected';
        
        iconGroupObj.settings = $.extend({
            type: 'sort',
            defaultButtonId: '',
            onChange: function(obj) { console.log(obj); },
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
            iconGroupObj.buttons = $('.slds-button', this);
            iconGroupObj.defaultIcon = (iconGroupObj.settings.defaultButtonId === '') ? iconGroupObj.buttons.eq(0) : '#' + iconGroupObj.settings.defaultButtonId;
            
            if (iconGroupObj.settings.type === 'sort') {
                select($(iconGroupObj.defaultIcon));
            }
            
            iconGroupObj.buttons.click(function() {
                iconGroupObj.target = $(this);
                iconGroupObj.targetId = iconGroupObj.target.attr('id');
                
                if (iconGroupObj.target.hasClass(isSelected) && (iconGroupObj.settings.type === 'toggle' || iconGroupObj.settings.type === 'switch')) {
                    deselect(iconGroupObj.target);
                    iconGroupObj.settings.onChange();
                } else if (iconGroupObj.target.hasClass(notSelected) && iconGroupObj.settings.type === 'toggle') {
                    select(iconGroupObj.target);
                    iconGroupObj.settings.onChange();
                } else if (iconGroupObj.target.hasClass(notSelected) && (iconGroupObj.settings.type === 'switch' || iconGroupObj.settings.type === 'sort')) {
                    iconGroupObj.buttons.each(function() {
                        if ($(this) !== iconGroupObj.target && $(this).hasClass(isSelected)) deselect($(this));
                    });
                    
                    select(iconGroupObj.target);
                    iconGroupObj.settings.onChange(iconGroupObj);
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