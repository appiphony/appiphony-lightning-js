/* ------------------------------------------------------------
ALJS Multi Select
------------------------------------------------------------ */
if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {
    var picklistItemMarkup = 
    '<li draggable="true" id="{{optionId}}" class="slds-picklist__item slds-has-icon slds-has-icon--left" aria-selected="false" tabindex="0" role="option">' +
        '<span class="slds-truncate">' +
            '<span>{{optionLabel}}</span>' +
        '</span>' +
    '</li>';

    var multiSelect = function(el, options) {
        this.$el = $(el);
        this.$selectedContainer = this.$el.find('[data-aljs-multi-select="selected"]').find('ul');
        this.$unselectedContainer = this.$el.find('[data-aljs-multi-select="unselected"]').find('ul');
        this.selectedItems = options.selectedItems;
        this.unselectedItems = options.unselectedItems;

        this.settings = options;

        this.init();
    };

    multiSelect.prototype = {
        constructor: multiSelect,
        init: function() {
            this.renderUnselectedItems();
            this.renderSelectedItems();

            this.$el.find('[data-aljs-multi-select="unselect"]').on('click', this, this.unselectItem);
            this.$el.find('[data-aljs-multi-select="select"]').on('click', this, this.selectItem);
            this.$el.find('[data-aljs-multi-select="move-up"]').on('click', this, this.moveItemUp);
            this.$el.find('[data-aljs-multi-select="move-down"]').on('click', this, this.moveItemDown);
        },
        renderUnselectedItems: function() {
            var self = this;
            
            this.$unselectedContainer.empty();

            this.unselectedItems.forEach(function(item) {
                self.$unselectedContainer.append(self.createPicklistDomItem(item));
            });

            this.$unselectedContainer
                .off()
                .on('click', 'li', function(e) {
                    $(this).addClass('slds-is-selected')
                           .attr('aria-selected', 'true')
                           .siblings()
                           .removeClass('slds-is-selected')
                           .attr('aria-selected', 'false');
                    self.itemToSelect = $(this).data('aljs-picklist-obj');
                })
                .on('dragstart', 'li', function(e) {
                    self.itemToSelect = $(this).data('aljs-picklist-obj');
                
                    e.originalEvent.dataTransfer.setData('text/plain', null);
                })
                .on('dragover', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                })
                .on('dragenter', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                })
                .on('drop', function(e) {
                    e.preventDefault();  
                    e.stopPropagation();
                    self.$el.find('[data-aljs-multi-select="unselect"]').click();
                });
        },
        renderSelectedItems: function() {
            var self = this;
            
            this.$selectedContainer.empty();

            this.selectedItems.forEach(function(item) {
                self.$selectedContainer.append(self.createPicklistDomItem(item));
            });

            this.$selectedContainer
                .off()
                .on('click', 'li', function(e) {
                    $(this).addClass('slds-is-selected')
                           .attr('aria-selected', 'true')
                           .siblings()
                           .removeClass('slds-is-selected')
                           .attr('aria-selected', 'false');
                    self.itemToUnselect = $(this).data('aljs-picklist-obj');
                })
                .on('dragstart', 'li', function(e) {
                    self.itemToUnselect = $(this).data('aljs-picklist-obj');
                    
                    e.originalEvent.dataTransfer.setData('text/plain', null);
                })
                .on('dragover', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                })
                .on('dragenter', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                })
                .on('drop', function(e) {
                    e.preventDefault();  
                    e.stopPropagation();
                    self.$el.find('[data-aljs-multi-select="select"]').click();
                });
        },
        selectItem: function(e) {
            var self = e.data;

            if (self.itemToSelect) {
                var item = self.$unselectedContainer.find('#' + self.itemToSelect.id)
                    .removeClass('slds-is-selected')
                    .attr('aria-selected', 'false')
                    .appendTo(self.$selectedContainer);
                
                self.unselectedItems.splice(self.unselectedItems.indexOf(self.itemToSelect), 1);
                self.selectedItems.push(self.itemToSelect);
                self.itemToSelect = null;
                
                self.settings.onSelectItem(self);
            }
        },
        unselectItem: function(e) {
            var self = e.data;

            if (!self.itemToUnselect) { return; }

            var item = self.$selectedContainer.find('#' + self.itemToUnselect.id)
                .removeClass('slds-is-selected')
                .attr('aria-selected', 'false')
                .appendTo(self.$unselectedContainer);
            
            self.selectedItems.splice(self.selectedItems.indexOf(self.itemToUnselect), 1);
            self.unselectedItems.push(self.itemToUnselect);
            self.itemToUnselect = null;
            
            self.settings.onUnselectItem(self);
        },
        moveItemUp: function(e) {
            var self = e.data;

            if (!self.itemToUnselect) { return; }

            var itemIndex = self.selectedItems.indexOf(self.itemToUnselect);

            if (itemIndex > 0) {
                self.selectedItems.splice(itemIndex, 1);
                self.selectedItems.splice(itemIndex - 1, 0, self.itemToUnselect);

                var $itemToMove = self.$selectedContainer.find('#' + self.itemToUnselect.id);

                $itemToMove.removeClass('slds-is-selected')
                           .attr('aria-selected', 'false')
                           .insertBefore($itemToMove.prev('li'));

                self.itemToUnselect = null;
                
                self.settings.onMoveItem(self, 'up');
            }
        },
        moveItemDown: function(e) {
            var self = e.data;

            if (!self.itemToUnselect) { return; }

            var itemIndex = self.selectedItems.indexOf(self.itemToUnselect);

            if (itemIndex < self.selectedItems.length - 1) {
                self.selectedItems.splice(itemIndex, 1);
                self.selectedItems.splice(itemIndex + 1, 0, self.itemToUnselect);

                var $itemToMove = self.$selectedContainer.find('#' + self.itemToUnselect.id);

                $itemToMove.removeClass('slds-is-selected')
                           .attr('aria-selected', 'false')
                           .insertAfter($itemToMove.next('li'));

                self.itemToUnselect = null;
                
                self.settings.onMoveItem(self, 'down');
            }
        },
        createPicklistDomItem: function(item) {
            //var $picklistItem = 
            return $(picklistItemMarkup.replace('{{optionId}}', item.id)
                                       .replace('{{optionLabel}}', item.label.toString()))
                                       .data('aljs-picklist-obj', item);
        },
        setSelectedItems: function(objs) {
            this.selectedItems = objs;
            this.renderSelectedItems();
        },
        setUnselectedItems: function(objs) {
            this.unselectedItems = objs;
            this.renderUnselectedItems();
        },
        getSelectedItems: function() {
            return this.selectedItems;
        },
        getUnselectedItems: function() {
            return this.unselectedItems;
        }
    };

    $.fn.multiSelect = function(options) {
        var multiSelectArguments = arguments;
        var internalReturn;
       // var arguments = arguments;

        var settings = $.extend({
            // These are the defaults
            selectedItems: [],
            unselectedItems: [],
            onSelectItem: function(obj) {},
            onUnselectItem: function(obj) {},
            onMoveItem: function(obj, direction) {},
            assetsLocation: $.aljs.assetsLocation
        }, typeof options === 'object' ? options : {});

        this.each(function() {
            var $this = $(this),
                data = $this.data('aljs-multi-select');

            if (!data) {
                var multiSelectData = new multiSelect(this, settings);
                $this.data('aljs-multi-select', (data = multiSelectData));
            }
            
            if (typeof options === 'string') {
                internalReturn = data[options](multiSelectArguments[1], multiSelectArguments[2]);
            }
        });

        if (internalReturn === undefined || internalReturn instanceof multiSelect) {
            return this;
        }

        if (this.length > 1) {
            throw new Error('Using only allowed for the collection of a single element (' + option + ' function)');
        } else {
            return internalReturn;
        }
    }
}(jQuery));