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

            this.obj.$trigger = $('.slds-button', $el);
            this.obj.$dropdown = $('.slds-dropdown', $el);
            this.obj.$choices = $('.slds-dropdown__item a', $el);
                        
            this.obj.$trigger.unbind() // Prevent multiple bindings
                .click(function(e) {
                    e.stopPropagation();
                
                    self.obj.id = $(this).attr('id');
                
                    if (self.obj.$dropdown.hasClass('slds-hide')) {
                        // Close other picklists
                        $('[data-aljs="picklist"]').not(self.$el).picklist('close');

                        self.obj.$dropdown.removeClass('slds-hide')
                            .addClass('slds-show');

                        if (self.obj.valueId === null || typeof self.obj.valueId === 'undefined') {
                            self.focusedIndex = 0;
                        } else {
                            self.focusedIndex = self.obj.$dropdown.find('li').index(self.obj.$dropdown.find('#' + self.obj.valueId));
                        }
                        
                        self.focusOnElement();
                        self.obj.$dropdown.on('keyup', self, self.processKeypress);
                    } else {
                        self.obj.$dropdown.removeClass('slds-show')
                            .addClass('slds-hide');
                        self.obj.$dropdown.unbind('keyup', self.processKeypress);
                    }
                });
            
            $('body').click(function() { 
                self.obj.$dropdown.removeClass('slds-show')
                    .addClass('slds-hide');
                self.obj.$dropdown.unbind('keyup', self.processKeypress);
            });

        },
        processKeypress: function(e) {
            var self = e.data;
            var optionsLength = self.obj.$choices.length;
            if (e.keyCode === 40) {
                self.focusedIndex = self.focusedIndex === optionsLength - 1 ? 0 : self.focusedIndex + 1;
                self.focusOnElement();
            } else if (e.keyCode === 38) {
                self.focusedIndex = self.focusedIndex === 0 ? optionsLength - 1 : self.focusedIndex - 1;
                self.focusOnElement();
            }
        },
        focusOnElement: function() {
            this.obj.$choices.eq(this.focusedIndex).focus();
        },
        bindChoices: function() {
            var self = this;
            this.obj.$valueContainer = $('> span', this.obj.$trigger);
            
            this.obj.$choices.unbind() // Prevent multiple bindings
                .click(function(e) {
                    e.stopPropagation();
                
                    var optionId = $(this).closest('li').attr('id');

                    self.setValueAndUpdateDom(optionId);
                    self.settings.onChange(self.obj);
                });
        },
        setValueAndUpdateDom: function(optionId) {
            var $li = this.$el.find('#' + optionId);
            this.obj.value = $li.find('a').text();
            this.obj.valueId = optionId;
            this.obj.$dropdown.removeClass('slds-show')
                .addClass('slds-hide');
            this.obj.$dropdown.unbind('keyup', this.processKeypress);

            this.obj.$trigger.trigger('change.aljs.picklist') // Custom aljs event
                .focus();
        
            this.obj.$valueContainer.text(this.obj.value);
            this.obj.$choices.parent()
                .removeClass('slds-is-selected');
        
            $li.addClass('slds-is-selected');
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
        close: function() {
            this.obj.$dropdown.removeClass('slds-show')
                .addClass('slds-hide');
            this.obj.$dropdown.unbind('keyup', this.processKeypress);
        }
    };

    $.fn.picklist = function(options) {
        var picklistArguments = arguments;
        var internalReturn;
       // var arguments = arguments;

        var settings = $.extend({
            // These are the defaults.

            assetsLocation: $.aljs.assetsLocation,
            onChange: function(obj) {

            }
        }, typeof options === 'object' ? options : {});

        this.each(function() {
            var $this = $(this);
            var data = $this.data('aljs-picklist');
            var dropdown = $this.find('.slds-dropdown')
                .addClass('slds-hide');

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