if (typeof _AljsApp === 'undefined') { throw new Error("Please include ember.aljs-init.js in your compiled Ember Application"); }

_AljsApp.AljsMultiSelectComponent = Ember.Component.extend({
    layoutName: 'components/aljs-multi-select',
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

        if (!Ember.isEmpty($node.closest('[data-aljs-multi-select="selected"]'))) {
            this.send('clickSelect');
        } else if (!Ember.isEmpty($node.closest('[data-aljs-multi-select="unselected"]'))) {
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