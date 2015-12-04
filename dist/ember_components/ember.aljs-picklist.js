if (typeof _AljsApp === 'undefined') { throw new Error("Please include ember.aljs-init.js in your compiled Ember Application"); }

_AljsApp.AljsPicklistComponent = Ember.Component.extend({
    init: function() {
        this._super(); 
        
        if (!Ember.Handlebars.helpers['getLabelFromPicklistOption']) {
            Ember.Handlebars.registerBoundHelper('getLabelFromPicklistOption', function(picklistOption, optionValueKey, optionLabelKey, prompt) {            
                if(!Ember.isNone(picklistOption)) {
                    
                    if (optionValueKey) {
                        return new Ember.Handlebars.SafeString(optionLabelKey ? picklistOption[optionLabelKey] : picklistOption[optionValueKey]);
                    } else {
                        return new Ember.Handlebars.SafeString(picklistOption);
                    }
                } else {
                    return prompt || 'Select an Option';
                }
            });
        } 
    },
    attributeBindings: ['content', 'optionValuePath', 'optionLabelPath', 'value', 'selection'],
    layoutName: 'components/aljs-picklist',
    classNames: 'slds-form-element',
    contentObjects: function() {
        var value = this.get('value');
        var optionValueKey = this.get('optionValueKey');
        var optionLabelKey = this.get('optionLabelKey');
        return this.get('content').map(function(picklistOption) {
            return {
                value: optionValueKey ? picklistOption[optionValueKey] : picklistOption,
                isSelected: value === (optionValueKey ? picklistOption[optionValueKey] : picklistOption),
                label: optionLabelKey ? picklistOption[optionLabelKey] : picklistOption[optionValueKey] || picklistOption
            };            
        });
    }.property('content', 'value'),
    optionValueKey: function() {
        var optionValuePath = this.get('optionValuePath');

        return optionValuePath ? optionValuePath.replace('content.', '') : null;
    }.property(),
    optionLabelKey: function() {
        var optionLabelPath = this.get('optionLabelPath');

        return optionLabelPath ? optionLabelPath.replace('content.', '') : null;
    }.property(),
    isOpen: false,

    focusIn: function(e) {
        this.setProperties({
            isOpen: true,
            justOpened: true
        });
    },
    focusOut: function(e) {
        if (Ember.isEmpty(this.$().find(e.relatedTarget))) {
            this.setProperties({
                isOpen: false, 
                justOpened: false
            });
        }
    },
    setSelectedPicklistOption: function(picklistOption, optionValueKey) {
        var optionValueKey = this.get('optionValueKey');

        if (optionValueKey && !Ember.isEmpty(picklistOption)) {
            this.setProperties({
                selection: this.get('content').findBy(optionValueKey, picklistOption.value)
            });
        } else {
            this.setProperties({
                selection: picklistOption ? picklistOption : null
            });
        }
    },
    valueChanged: function() {
        var optionValueKey = this.get('optionValueKey');
        var value = this.get('value');
        var selectedPicklistOption = optionValueKey ? this.get('content').findBy(optionValueKey, value) : value;

        this.setSelectedPicklistOption(selectedPicklistOption);
    }.observes('value').on('init'),
    actions: {
        clickTogglePicklist: function() {
            if (this.get('justOpened')) {
                this.set('justOpened', false);
            } else {
                this.$().find(':focus').blur();
            }
        },
        clickPicklistOption: function(picklistOption) {
            this.set('value', picklistOption ? picklistOption.value : null);

            this.$().find(':focus').blur();
        }
    }
});

_AljsApp.AljsMultiPicklistComponent = Ember.Component.extend({
    layoutName: 'components/aljs-multi-picklist',
    classNames: 'slds-form-element',
    attributeBindings: ['unselectedLabel', 'unselectedItems', 'selectedItems', 'selectedItems'],
    init: function() {
        this._super();

        if (Ember.isNone(this.get('selectedItems'))) {
            this.set('selectedItems', []);
        }
    },
    unselectedEmberObjects: function() {
        var unselectedItems = this.get('unselectedItems');

        
        return Ember.isEmpty(unselectedItems) ? [] : unselectedItems.map(function(item) {  
                                                                            var embObj = Ember.Object.create(item); 
                                                                            embObj.setProperties({
                                                                                isSelected: false,
                                                                                ariaSelectedValue: 'false'
                                                                            });
                                                                            return embObj;
                                                                        });
    }.property('unselectedItems', 'selectedItems'),
    selectedEmberObjects: function() {
        var selectedItems = this.get('selectedItems');

        
        return Ember.isEmpty(selectedItems) ? [] : selectedItems.map(function(item) { 
                                                                        var embObj = Ember.Object.create(item); 
                                                                        embObj.setProperties({
                                                                            isSelected: false,
                                                                            ariaSelectedValue: 'false'
                                                                        });
                                                                        return embObj;
                                                                    });
    }.property('unselectedItems', 'selectedItems'),
    dragStart: function(e) {
        if ($(e.target).attr('draggable') === 'true') {
            $(e.target).click();
        }
        console.log(e);
    },
    dragOver: function(e) {
        e.preventDefault();
        e.stopPropagation();
    },
    dragEnter: function(e) {
        e.preventDefault();
        e.stopPropagation();
    },
    drop: function(e) {
        e.preventDefault();  
        e.stopPropagation();
        console.log(e);

        var $node = $(e.target);

        if (!Ember.isEmpty($node.closest('[data-aljs-multi-picklist="selected"]'))) {
            this.send('clickSelect');
        } else if (!Ember.isEmpty($node.closest('[data-aljs-multi-picklist="unselected"]'))) {
            this.send('clickUnselect');
        }
    },
    actions: {
        clickItem: function(section, item) {
            this.get(section + 'EmberObjects').forEach(function(obj) {
                                                    if (obj.get('id') !== item.id) {
                                                        obj.setProperties({
                                                            isSelected: false,
                                                            ariaSelectedValue: 'false'
                                                        });
                                                    }
                                                });

            item.setProperties({
                isSelected: true,
                ariaSelectedValue: 'true'
            });
        },
        clickUnselect: function() {
            var unselectedItems = this.get('unselectedItems');
            var selectedItems = this.get('selectedItems');
            var itemToUnselect = this.get('selectedEmberObjects').findBy('isSelected', true);

            if (itemToUnselect) {
                var rawItem = selectedItems.findBy('id', itemToUnselect.id);

                unselectedItems.addObject(rawItem);
                selectedItems.removeObject(rawItem);
                itemToUnselect.setProperties({
                    isSelected: false,
                    ariaSelectedValue: 'false'
                });

                this.notifyPropertyChange('selectedItems');
                this.notifyPropertyChange('unselectedItems');
            }
        },
        clickSelect: function() {
            var unselectedItems = this.get('unselectedItems');
            var selectedItems = this.get('selectedItems');
            var itemToSelect = this.get('unselectedEmberObjects').findBy('isSelected', true);

            if (itemToSelect) {
                var rawItem = unselectedItems.findBy('id', itemToSelect.id);

                selectedItems.addObject(rawItem);
                unselectedItems.removeObject(rawItem);
                itemToSelect.setProperties({
                    isSelected: false,
                    ariaSelectedValue: 'false'
                });

                this.notifyPropertyChange('selectedItems');
                this.notifyPropertyChange('unselectedItems');
            }
        },
        clickMoveUp: function() {
            var selectedItems = this.get('selectedItems');
            var itemToMove = this.get('selectedEmberObjects').findBy('isSelected', true);

            if (itemToMove) {
                var rawItem = selectedItems.findBy('id', itemToMove.id);
                var itemIndex = selectedItems.indexOf(rawItem);

                if (itemIndex > 0) {
                    selectedItems.splice(itemIndex, 1);
                    selectedItems.splice(itemIndex - 1, 0, rawItem);

                    this.notifyPropertyChange('selectedItems');
                    itemToMove.setProperties({
                        isSelected: false,
                        ariaSelectedValue: 'false'
                    });
                }
            }
        },
        clickMoveDown: function() {
            var selectedItems = this.get('selectedItems');
            var itemToMove = this.get('selectedEmberObjects').findBy('isSelected', true);

            if (itemToMove) {
                var rawItem = selectedItems.findBy('id', itemToMove.id);
                var itemIndex = selectedItems.indexOf(rawItem);

                if (itemIndex < selectedItems.length - 1) {
                    selectedItems.splice(itemIndex, 1);
                    selectedItems.splice(itemIndex + 1, 0, rawItem);

                    this.notifyPropertyChange('selectedItems');
                    itemToMove.setProperties({
                        isSelected: false,
                        ariaSelectedValue: 'false'
                    });
                }
            }
        }
    }
});