if (typeof _AljsApp === 'undefined') { throw new Error("Please include ember.aljs-init.js in your compiled Ember Application"); }

_AljsApp.AljsLookupInputComponent = Ember.TextField.extend({
    attributeBindings: ['aria-expanded', 'aria-autocomplete', 'aria-activedescendant', 'role']
});

_AljsApp.AljsLookupComponent = Ember.Component.extend({
    layoutName: 'components/aljs-lookup',
    classNames: 'slds-lookup',
    classNameBindings: ['slds-has-selection'],
    attributeBindings: ['data-select', 'data-scope', 'data-typeahead', 'objectPluralLabel', 'objectLabel', 'items',
                        'emptySearchTermQuery', 'filledSearchTermQuery', 'initSelection'],
    'slds-has-selection' : function() {
        return !Ember.isEmpty(this.get('selectedResult')) || !Ember.isEmpty(this.get('selectedResults'));
    }.property('selectedResult', 'selectedResults'),
    init: function() {
        this._super();

        var isSingle = this.get('data-select') === 'single';
        var initSelection = this.get('initSelection');

        if (initSelection) {
            this.set(isSingle ? 'selectedResult' : 'selectedResults', initSelection);
        } else {
            this.setProperties({
                selectedResult: null,
                selectedResults: []
            });
        }
    },
    didInsertElement: function() {

    },
    isExpanded: function() {
        return !Ember.isEmpty(this.get('searchResults')) ? 'true' : 'false';
    }.property('searchResults'),
    isSingle: function() {
        return this.get('data-select') === 'single';
    }.property('data-select'),
    focusIn: function(e) {
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
        var $relatedTarget = $(e.relatedTarget);

        if (Ember.isEmpty(this.$().find($relatedTarget))) {
            this.set('searchResults', null);
        }
    },
    keyUp: function(e) {
        var actionKeys = [9, 13, 16, 27, 40, 38];
        var $focusedA = this.$().find('a:focus');

        if (actionKeys.indexOf(e.keyCode) === -1) {
            var searchTerm = this.get('searchTerm');

            if (Ember.isEmpty(searchTerm)) {
                this.getDefaultResults();
            } else {
                this.getSearchTermResults(searchTerm);
            }
        }

        if (e.keyCode === 27) {
            this.set('searchResults', null);
            this.$().find('input').blur();
        }

        if (e.keyCode === 40) {
            // DOWN
            if ($focusedA.length > 0) {
                this.$().find('a:focus').parent().next().find('a').focus();
            } else {
                this.$().find('.slds-lookup__list').find('a:first').focus();
            }
        }

        if (e.keyCode === 38) {
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
        return !Ember.isEmpty(searchTerm) && searchTerm.length > 1;
    }.property('searchTerm'),
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

            this.get('emptySearchTermQuery')(callback);
        }
    },
    getSearchTermResults: function(searchTerm) {
        var self = this;
        var selectedResult = this.get('selectedResult');
        var selectedResults = this.get('selectedResults');
        var items = this.get('items');

        if (!Ember.isEmpty(items)) {
            this.set('searchResults', items.filter(function(item) {
                return item.label.match(searchTerm) !== null
                        && self.showSearchResult(item);
            }));
        } else if (!Ember.isNone(this.get('filledSearchTermQuery'))) { 
            var callback = function(searchResults) {
                self.set('searchResults', searchResults.filter(function(result) {
                    return self.showSearchResult(result);
                }));
            };

            this.get('filledSearchTermQuery')(callback);
        }
    },
    searchResultsChanged: function() {
        if (!Ember.isEmpty(this.get('searchResults'))) {
            Ember.run.scheduleOnce('afterRender', this, function() {
                var self = this;
                console.log(this.$().find('li.slds-lookup__item'));
                this.$().find('a[role="option"]').on('focus', function(e) {
                    self.set('focusedSearchResult', $(e.target).attr('id'));
                });
            });
        }
    }.observes('searchResults'),
    actions: {
        clickResult: function(result) {
            if (this.get('isSingle')) {
                this.set('selectedResult', result);
            } else {
                this.get('selectedResults').addObject(result);
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
            }
        }
    }
});