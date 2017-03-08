/* ------------------------------------------------------------
ALJS Picklist
------------------------------------------------------------ */
if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {
    var Picklist = function(el, options) {
        this.$el = $(el);
        this.settings = options;
        this.obj = {};
        this.bindTrigger();
        this.bindChoices();
    };
    
    Picklist.prototype = {
        constructor: Picklist,
        bindTrigger: function() {
            var self = this;
            var $el = this.$el;
            
            this.obj.$trigger = $('.slds-lookup__search-input', $el);
            this.obj.$dropdown = $('.slds-dropdown__list', $el);
            this.obj.$choices = $('.slds-dropdown__list > li > span', $el).prop('tabindex', 1);
            
            this.$el.on('keyup', self, self.processKeypress)
                .find('.slds-lookup__search-input + .slds-button')
                .css('pointer-events', 'none');
                        
            this.obj.$trigger.unbind() // Prevent multiple bindings
                .click(function(e) {
                    e.stopPropagation();
                
                    self.obj.id = $(this).attr('id');
                
                    if (self.$el.hasClass('slds-is-open')) {
                        self.$el.removeClass('slds-is-open');
                        self.obj.$dropdown.unbind('keyup', self.processKeypress);
                    } else {
                        // Close other picklists
                        $('[data-aljs="picklist"]').not(self.$el).picklist('close');
                        
                        self.$el.addClass('slds-is-open');
                        
                        if (self.obj.valueId === null || typeof self.obj.valueId === 'undefined') {
                            self.focusedIndex = null;
                        } else {
                            self.focusedIndex = self.obj.$dropdown.find('li > span').index(self.obj.$dropdown.find('#' + self.obj.valueId));
                        }
                        
                        self.focusOnElement();
                    }
                return false; // Prevent scrolling on keypress
                });
            
            $('body').click(function() { 
                self.$el.removeClass('slds-is-open');
            });
            
        },
        processKeypress: function(e) {
            var self = e.data;
            var optionsLength = self.obj.$choices.length;
            
            
            if (self.$el.hasClass('slds-is-open')) {
                switch (e.which) {
                    case (40): // Down
                        if (self.focusedIndex === null) {
                            self.focusedIndex = 0;
                        } else {
                            self.focusedIndex = self.focusedIndex === optionsLength - 1 ? 0 : self.focusedIndex + 1;
                        }
                        
                        self.focusOnElement();
                        break;
                    case (38): // Up
                        if (self.focusedIndex === null) {
                            self.focusedIndex = optionsLength - 1;
                        } else {
                            self.focusedIndex = self.focusedIndex === 0 ? optionsLength - 1 : self.focusedIndex - 1;
                        }
                        
                        self.focusOnElement();
                        break;
                    case (27): // Esc
                        self.$el.picklist('close');
                        break;
                    case (13): // Return
                        if (self.focusedIndex !== null) {
                            var focusedId = self.obj.$choices.eq(self.focusedIndex).attr('id');
                            
                            self.setValueAndUpdateDom(focusedId);
                        }
                        break;
                }
            } else if (e.which === 13) { // Return
                self.$el.addClass('slds-is-open');
                self.focusOnElement();
            }
            
            return false; // Prevents scrolling
        },
        focusOnElement: function() {
            if (this.focusedIndex !== null) {
                this.obj.$choices.eq(this.focusedIndex).focus();
            }
        },
        bindChoices: function() {
            var self = this;
            this.obj.$valueContainer = $('.slds-lookup__search-input', this.$el);
            
            this.obj.$choices.unbind() // Prevent multiple bindings
                .click(function(e) {
                    e.stopPropagation();
                
                    var optionId = $(this).closest('span').attr('id');
                
                    self.setValueAndUpdateDom(optionId);
                });
        },
        setValueAndUpdateDom: function(optionId) {
            var self = this;
            var $span = self.$el.find('#' + optionId);
            var index = self.obj.$choices.index($span);
            
            this.obj.value = $span.text().trim();
            this.obj.valueId = optionId;
            this.$el.removeClass('slds-is-open');
            
            this.obj.$trigger.trigger('change.aljs.picklist') // Custom aljs event
                .focus();
            
            this.obj.$valueContainer.val(this.obj.value);
            this.obj.$choices.removeClass('slds-is-selected');
            
            $span.addClass('slds-is-selected');
            self.focusedIndex = index;
            self.settings.onChange(self.obj);
        },
        setValue: function(optionId, callOnChange) {
            this.setValueAndUpdateDom(optionId);
            if (callOnChange) {
                this.settings.onChange(this.obj);
            }
        },
        getValueId: function() {
            return this.obj.valueId;
        },
        getValue: function() {
            return this.obj;
        },
        close: function() {
            this.$el.removeClass('slds-is-open');
        }
    };
    
    $.fn.picklist = function(options) {
        var picklistArguments = arguments;
        var internalReturn;
        
        var settings = $.extend({
            assetsLocation: $.aljs.assetsLocation,
            onChange: function(obj) {
            // These are the defaults
            }
        }, typeof options === 'object' ? options : {});
        
        this.each(function() {
            var $this = $(this);
            var data = $this.data('aljs-picklist');
            
            if (!data) {
                var picklistData = new Picklist(this, settings);
                $this.data('aljs-picklist', (data = picklistData));
            }
            
            if (typeof options === 'string') {
                internalReturn = data[options](picklistArguments[1], picklistArguments[2]);
            }
        });
        
        if (internalReturn === undefined || internalReturn instanceof Picklist) {
            return this;
        }
        
        if (this.length > 1) {
            throw new Error('Using only allowed for the collection of a single element (' + option + ' function)');
        } else {
            return internalReturn;
        }
    }
}(jQuery));