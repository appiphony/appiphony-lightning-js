(function($) {
    $.fn.picklist = function(options) {
        obj = {};
        
        obj.settings = $.extend({
            assetsLocation: '',
            onChange: function() {}
        }, options);
        obj.dropdowns = $('.slds-picklist .slds-dropdown');
        obj.bodyTag = $('body');
        obj.checkmarkIcon = '<svg aria-hidden="true" class="slds-icon slds-icon--small slds-icon--left"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + obj.settings.assetsLocation + '/assets/icons/standard-sprite/svg/symbols.svg#task2"></use></svg>';
        
        obj.dropdowns.hide();
        
        function bindTrigger(element) {
            obj.triggerElement = $('.slds-button', element);
            obj.target = $('.slds-dropdown', element);
            obj.choices = $('.slds-dropdown__item a', element);
            
            obj.target.hide();
            
            obj.triggerElement.unbind() // Prevent multiple bindings
                .click(function(e) {
                    e.stopPropagation();
                
                    obj.id = $(this).attr('id');
                
                    if (obj.target.is(':hidden')) {
                        obj.dropdowns.hide(); // Close all dropdowns before opening
                        obj.target.show();
                        obj.choices.first()
                            .focus();
                    } else {
                        obj.target.hide();
                    }
                });
            
            obj.bodyTag.click(function() { obj.target.hide(); });
        }
        
        function bindChoices(element) {
            obj.triggerElement = $('.slds-button', element);
            obj.target = $('.slds-dropdown', element);
            obj.choices = $('.slds-dropdown__item a', element);
            obj.valueContainer = $('> span', obj.triggerElement);
            
            obj.choices.unbind() // Prevent multiple bindings
                .click(function(e) {
                    e.stopPropagation();
                
                    obj.value = $(this).html();
                    obj.settings.onChange(obj);
                    obj.target.hide();
                    obj.triggerElement.trigger('aljs.picklistchange') // Custom aljs event
                        .focus();
                
                    obj.valueContainer.html(obj.value);
                    obj.choices.parent()
                        .removeClass('slds-is-selected')
                        .find('.slds-icon')
                        .remove();
                
                    $(this).append(obj.checkmarkIcon)
                        .parent()
                        .addClass('slds-is-selected');
                });
        }
        
        if (obj.settings.selector && this.length === 1) { // If allowing for selector to trigger modals post-init
            return this.on('click', obj.settings.selector, function(e) {
                obj.elements = $(obj.settings.selector);
                
                obj.elements.each(function() {
                    bindTrigger(this);
                    bindChoices(this);
                });
                
//                $(e.target).click();
            });
        } else {
            return this.each(function() {
                bindTrigger(this);
                bindChoices(this);
            });
        }
    }
}(jQuery));