if (typeof _AljsApp === 'undefined') { throw new Error("Please include ember.aljs-init.js in your compiled Ember Application"); }

_AljsApp.AljsLookupInputComponent = Ember.TextField.extend({
    attributeBindings: ['aria-expanded', 'aria-autocomplete', 'aria-activedescendant', 'role']
});

_AljsApp.AljsLookupComponent = Ember.Component.extend({
    layoutName: 'components/aljs-lookup',
    classNames: 'slds-lookup',
    classNameBindings: ['slds-has-selection'],
    attributeBindings: ['data-select', 'data-scope', 'data-typeahead', 'objectPluralLabel', 'objectLabel', 'items', 'searchTerm', 'ctrl', 'disabled',
                        'emptySearchTermQuery', 'filledSearchTermQuery', 'objectIconUrl', 'isObjectIconCustom', 'objectIconClass',
                        'showSearch', 'clearOnSelect', 'selectedResult', 'selectedResults', 'hasError', 'errorMessage'],
    'slds-has-selection' : function() {
        return (!Ember.isEmpty(this.get('selectedResult')) && !this.get('clearOnSelect')) || !Ember.isEmpty(this.get('selectedResults'));
    }.property('selectedResult', 'selectedResults'),
    minimumSearchLength: 2,
    init: function() {
        this._super();
        var isSingle = this.get('data-select') === 'single';
        var initSelection = this.get('initSelection');
        var items = this.get('items');

        if (initSelection) {
            if (isSingle) {
                if (typeof initSelection !== 'object') {
                    initSelection = {
                        id: initSelection,
                        label: initSelection
                    };
                }
                this.set('selectedResult', initSelection);
            } else {
                if (typeof initSelection[0] !== 'object') {
                    initSelection = initSelection.map(function(item) {
                        return {
                            id: item,
                            label: item
                        };
                    });
                }
                this.set('selectedResults', initSelection);
            }
        } else {
            this.setProperties({
                selectedResult: null,
                selectedResults: []
            });
        }
        
        if (items) {
            if (typeof items[0] !== 'object') {
                items = items.map(function(item) {
                    return {
                        label: item,
                        id: item
                    };
                });
            }
            
            this.set('items', items);
        }
    },
    didInsertElement: function() {
        if (!Ember.isEmpty(this.get('data-qa-input'))) {
            this.$().attr('data-qa-input', null);
        }
    },
    isExpanded: function() {
        return !Ember.isEmpty(this.get('searchResults')) ? 'true' : 'false';
    }.property('searchResults'),
    isSingle: function() {
        return this.get('data-select') === 'single';
    }.property('data-select'),
    focusTrackingArray: [],
    focusIn: function(e) {
        this.get('focusTrackingArray').addObject(e.target);

        if (e.target.nodeName.toLowerCase() === 'input') {
            var searchTerm = this.get('searchTerm');

            if (Ember.isEmpty(searchTerm)) {
                this.getDefaultResults();
            } else {
                this.getSearchTermResults(searchTerm);
            } 
        }
    },
    focusOut: function(e) {
        var self = this;

        window.setTimeout(function() {
            var focusTrackingArray = self.get('focusTrackingArray');
            
            focusTrackingArray.removeObject(e.target);
            
            var focusedAwayFromComponent = focusTrackingArray.length === 0;

            if (focusedAwayFromComponent) {
                self.set('searchResults', null);
                self.set('blockFocusOut', null);
            }
        }, 10);
    },
    search : function(){
        var searchTerm = this.get('searchTerm');
        var minimumSearchLength = this.get('minimumSearchLength');

        if (Ember.isEmpty(searchTerm)) {
            this.getDefaultResults();
        } else if (searchTerm.length >= minimumSearchLength) {
            this.getSearchTermResults(searchTerm);
        } else {
            this.set('searchResults', null);
        }
    },
    keyPress: function(e) {
        const ENTER = 13;
        var $focusedA = this.$().find('a:focus');

        // Variables for allowing creation of an item
        var allowNewItems = this.get('allowNewItems');
        var tokenSeparators = this.get('tokenSeparators') || [];
        var searchTerm = this.getWithDefault('searchTerm', '');
        var minimumSearchLength = this.get('minimumSearchLength');

        if ((allowNewItems)
                && (e.which === ENTER || tokenSeparators.indexOf(String.fromCharCode(e.which)) !== -1) 
                && (searchTerm.length >= minimumSearchLength) 
                && (Ember.isEmpty($focusedA))) {

            var item;
            var searchResults = this.get('searchResults');
            var selectedResults = this.get('selectedResults');

            if (!Ember.isEmpty(searchResults)) {
                item = searchResults.find(function(result) {
                    return result.label.toLowerCase().trim() === searchTerm.toLowerCase().trim();
                });  
            }
            
            if (Ember.isNone(item) && !Ember.isEmpty(selectedResults)) {
                item = selectedResults.find(function(result) {
                    return result.label.toLowerCase().trim() === searchTerm.toLowerCase().trim();
                });
            }

            if (Ember.isNone(item)) {
                var item = {
                    id: searchTerm,
                    label: searchTerm
                };
            }
            
            this.send('clickResult', item);
        }
    },
    keyUp: function(e) {                         
        const TAB = 9;
        const ENTER = 13;
        const SHIFT = 16;
        const ESCAPE = 27;
        const DOWN_ARROW = 40;
        const UP_ARROW = 38;
        const CMD = 91;
        const CTRL = 17;

        var actionKeys = [TAB, ENTER, SHIFT, ESCAPE, DOWN_ARROW, UP_ARROW, CMD, CTRL];
        var $focusedA = this.$().find('a:focus');

        if (actionKeys.indexOf(e.which) === -1) {
            Ember.run.debounce(this, this.search, 200);
        }

        if (e.which === ESCAPE) {
            this.set('searchResults', null);
            this.$().find('input').blur();
        }

        if (e.which === DOWN_ARROW) {
            // DOWN
            if ($focusedA.length > 0) {
                this.$().find('a:focus').parent().next().find('a').focus();
            } else {
                this.$().find('.slds-lookup__list').find('a:first').focus();
            }
        }

        if (e.which === UP_ARROW) {
            // UP
            if ($focusedA.length > 0) {
                this.$().find('a:focus').parent().prev().find('a').focus();
            } else {
                this.$().find('.slds-lookup__list').find('a:last').focus();
            }
        }
        
    },
    showUse: function() {
        var searchTerm = this.get('searchTerm');
        var showSearch = this.get('showSearch') && this.get('showSearch').toString() == 'true';

        return !Ember.isEmpty(searchTerm) && searchTerm.length > 1 && showSearch;
    }.property('searchTerm', 'showSearch'),
    showSearchResult: function(result) {
        // Check if the search result has been selected and don't show otherwise.

        return this.get('isSingle') || Ember.isEmpty(this.get('selectedResults').findBy('id', result.id));
    },
    getDefaultResults: function() {
        var self = this;
        
        var items = this.get('items');

        if (!Ember.isEmpty(items)) {
            this.set('searchResults', items.filter(function(item) {
                return self.showSearchResult(item);
            }));
        } else if (!Ember.isNone(this.get('emptySearchTermQuery'))) { 
            var callback = function(searchResults) {
                self.set('searchResults', searchResults.filter(function(searchResult) {
                    return self.showSearchResult(searchResult);
                }));
            };

            this.get('emptySearchTermQuery').call(this, callback);
        } else {
            this.set('searchResults', null);
        }
    },
    getSearchTermResults: function(searchTerm) {
        var self = this;
        var selectedResult = this.get('selectedResult');
        var selectedResults = this.get('selectedResults');
        var items = this.get('items');

        if (!Ember.isEmpty(items)) {
            this.set('searchResults', items.filter(function(item) {
                return item.label.toLowerCase().match(searchTerm.toLowerCase()) !== null
                        && self.showSearchResult(item);
            }));
        } else if (!Ember.isNone(this.get('filledSearchTermQuery'))) { 
            var callback = function(searchResults) {
                self.set('searchResults', searchResults.filter(function(result) {
                    return self.showSearchResult(result);
                }));
            };

            this.get('filledSearchTermQuery').call(this, searchTerm, callback);
        }
    },
    observeItems: function() {
        var items = this.get('items');
        
        if (items) {
            if (typeof items[0] !== 'object') {
                items = items.map(function(item) {
                    return {
                        label: item,
                        id: item
                    };
                });
            }
            
            this.set('items', items);
        }
    }.observes('items'),
    searchResultsChanged: function() {
        if (!Ember.isEmpty(this.get('searchResults'))) {
            Ember.run.scheduleOnce('afterRender', this, function() {
                var self = this;
                this.$().find('a[role="option"]').on('focus', function(e) {
                    self.set('focusedSearchResult', $(e.target).attr('id'));
                });
            });
        }
    }.observes('searchResults'),
    showSelectedResult: function() {
        return !Ember.isEmpty(this.get('selectedResult')) && !this.get('clearOnSelect');
    }.property('selectedResult', 'clearOnSelect'),
    tokenSeparatorEntered: function() {
        var tokenCheckObj = this.getProperties(['searchTerm', 'tokenSeparators', 'allowNewItems', 'clearOnSelect']);

        if (!Ember.isEmpty(tokenCheckObj.searchTerm)
            && (tokenCheckObj.allowNewItems) 
            && (tokenCheckObj.clearOnSelect) 
            && (!Ember.isEmpty(tokenCheckObj.tokenSeparators) && tokenCheckObj.tokenSeparators.indexOf(tokenCheckObj.searchTerm) !== -1)) {
            this.set('searchTerm', null);
        }
    }.observes('searchTerm'),
    actions: {
        clickResult: function(result) {
            if (this.get('isSingle')) {
                this.set('selectedResult', result);  
            } else {
                var selectedResults = this.get('selectedResults');

                if (selectedResults.getEach('id').indexOf(result.id) === -1
                        && selectedResults.getEach('label').indexOf(result.label) === -1) {
                    this.get('selectedResults').addObject(result);
                    this.notifyPropertyChange('selectedResults');
                }

                Ember.run.scheduleOnce('afterRender', this, function() {
                    this.$().find('input').focus();
                });
            }

            if (this.get('clearOnSelect')) {
                this.set('searchTerm', null);                
            }

            this.set('searchResults', null);
        },
        clickRemoveSelection: function(selectedResult) {
            if (this.get('isSingle')) {
                this.set('selectedResult', null);

                Ember.run.scheduleOnce('afterRender', this, function() {
                    this.$().find('input').focus();
                });
            } else {
                this.get('selectedResults').removeObject(selectedResult);
                this.notifyPropertyChange('selectedResults');
            }
        },
        clickSearchIcon: function() {
            this.$().find('input').focus();
        }
    }
});