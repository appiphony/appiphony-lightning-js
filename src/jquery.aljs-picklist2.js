(function($) {

    var Picklist = function(el, options) {
        this.$el = $(el);
        this.obj = {
            checkmarkIcon: '<svg aria-hidden="true" class="slds-icon slds-icon--small slds-icon--left"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + options.assetsLocation + '/assets/icons/standard-sprite/svg/symbols.svg#task2"></use></svg>'
        };
        this.settings = options;

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
                
                    if (self.obj.$dropdown.is(':hidden')) {
                        self.obj.$dropdown.show();

                        if (self.obj.valueId === null || typeof self.obj.valueId === 'undefined') {
                            self.focusedIndex = 0;
                        } else {
                            self.focusedIndex = self.obj.$dropdown.find('li').index(self.obj.$dropdown.find('#' + self.obj.valueId));
                        }
                        
                        self.focusOnElement();
                        self.obj.$dropdown.on('keyup', self, self.processKeypress);
                    } else {
                        self.obj.$dropdown.hide();
                        self.obj.$dropdown.unbind('keyup', self.processKeypress);
                    }
                });
            
            $('body').click(function() { 
                self.obj.$dropdown.hide();
                self.obj.$dropdown.unbind('keyup', self.processKeypress);
            });

        },
        processKeypress: function(e) {
            var self = e.data;
            var optionsLength = self.obj.$choices.length;
            console.log('click');
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
            this.obj.value = $li.find('a').html();
            this.obj.valueId = optionId;
            //self.settings.onChange(self.obj);
            this.obj.$dropdown.hide();
            this.obj.$dropdown.unbind('keyup', this.processKeypress);

            this.obj.$trigger.trigger('aljs.picklistchange') // Custom aljs event
                .focus();
        
            this.obj.$valueContainer.html(this.obj.value);
            this.obj.$choices.parent()
                .removeClass('slds-is-selected')
                .find('.slds-icon')
                .remove();
        
            $li.addClass('slds-is-selected')
                .find('a').append(this.obj.checkmarkIcon);
        },
        setValue: function(optionId, callOnChange) {
            this.setValueAndUpdateDom(optionId);
            if (callOnChange) {
                this.settings.onChange(this.obj);
            }

        }
    };

    $.fn.picklist = function(options) {
        var picklistArguments = arguments;
       // var arguments = arguments;

        var settings = $.extend({
            // These are the defaults.

            assetsLocation: '',
            onChange: function(obj) {

            }
        }, typeof options === 'object' ? options : {});

        return this.each(function() {
            var $this = $(this),
                data = $this.data('aljs-picklist');

            if (!data) {
                var picklistData = new Picklist(this, settings);
                $this.data('aljs-picklist', (data = picklistData));
            }
            
            if (typeof options === 'string') data[options](picklistArguments[1], picklistArguments[2]);
        });
    }
}(jQuery));