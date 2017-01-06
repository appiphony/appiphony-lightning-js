/* ------------------------------------------------------------
ALJS Lookup
------------------------------------------------------------ */
if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {
	var selectContainerMarkup = '<div class="slds-pill_container slds-hide"></div>';
    
	var pillMarkup = 
    	'<span class="slds-pill slds-size--1-of-1">' +
      		'<span class="slds-icon_container slds-icon-standard-account slds-pill__icon_container{{hasIcon}}" title="{{objectLabel}}">' +
        		'<svg aria-hidden="true" class="{{objectIconClass}} slds-icon slds-pill__icon">' +
          			'<use xlink:href="{{objectIconUrl}}"></use>' +
        		'</svg>' +
                '<span class="slds-assistive-text">{{objectLabel}}</span>' + 
            '</span>' +
            '<span class="slds-pill__label" title="{{selectedResultLabel}}">{{selectedResultLabel}}</span>' +
            '<button class="slds-button slds-button--icon-bare slds-pill__remove">' +
                '<svg aria-hidden="true" class="slds-button__icon">' +
                    '<use xlink:href="{{assetsLocation}}/assets/icons/utility-sprite/svg/symbols.svg#close"></use>' +
                '</svg>' +
                '<span class="slds-assistive-text">Remove</span>' +
            '</button>' +
    	'</span>';

	var customPillMarkup = 
    	'<span class="slds-pill slds-size--1-of-1">' +
      		'<span class="slds-icon_container slds-icon-standard-account slds-pill__icon_container{{hasIcon}}" title="{{objectLabel}}">' +
                '<img class="{{objectIconClass}} slds-icon slds-pill__icon" src="{{objectLabel}}"/>' +
                '<span class="slds-assistive-text">{{objectLabel}}</span>' + 
            '</span>' +
            '<span class="slds-pill__label" title="{{selectedResultLabel}}">{{selectedResultLabel}}</span>' +
            '<button class="slds-button slds-button--icon-bare slds-pill__remove">' +
                '<svg aria-hidden="true" class="slds-button__icon">' +
                    '<use xlink:href="{{assetsLocation}}/assets/icons/utility-sprite/svg/symbols.svg#close"></use>' +
                '</svg>' +
                '<span class="slds-assistive-text">Remove</span>' +
            '</button>' +
    	'</span>';

	var lookupSearchContainerMarkup = 
		'<div class="slds-lookup__menu">' +
			'<ul class="slds-lookup__list" role="listbox">' +
			'</ul>' +
		'</div>';

	var searchMarkup = 
		'<li role="presentation">' +
			'<span class="slds-lookup__item-action slds-lookup__item-action--label" role="option" tabindex="1">' +
				'<svg aria-hidden="true" class="slds-icon slds-icon--x-small slds-icon-text-default">' +
					'<use xlink:href="{{assetsLocation}}/assets/icons/utility-sprite/svg/symbols.svg#search"></use>' +
				'</svg>' +
                '<span class="slds-truncate">&quot;{{searchTerm}}&quot; in {{objectPluralLabel}}</span>' +
			'</span>' +
		'</li>';
    
    var recentMarkup = '<div class="slds-lookup__item--label slds-text-body--small">{{recentLabel}}</div>';

	var newItemMarkup = 
		'<li role="presentation">' +
			'<span class="slds-lookup__item-action slds-lookup__item-action--label" role="option" tabindex="1">' +
				'<svg aria-hidden="true" class="slds-icon slds-icon--x-small slds-icon-text-default">' +
					'<use xlink:href="{{assetsLocation}}/assets/icons/utility-sprite/svg/symbols.svg#add"></use>' +
				'</svg>' +
                '<span class="slds-truncate">New {{objectLabel}}</span>' +
			'</span>' +
		'</li>';

	var lookupResultItemMarkup = 
		'<li role="presentation">' +
			'<span class="slds-lookup__item-action slds-media" id="{{resultId}}" role="option" tabindex="1">' +
				'<svg aria-hidden="true" class="{{objectIconClass}} slds-icon slds-icon--small slds-media__figure{{hasIcon}}">' +
					'<use xlink:href="{{objectIconUrl}}"></use>' +
				'</svg>' +
                '<div class="slds-media__body">' +
                    '<div class="slds-lookup__result-text">{{resultLabel}}</div>' +
                    '{{metaLabel}}' +
                '</div>' +
			'</span>' +
		'</li>';

	var customLookupResultItemMarkup = 
		'<li role="presentation">' +
			'<span class="slds-lookup__item-action slds-media" id="{{resultId}}" role="option" tabindex="1">' +
                '<img class="{{objectIconClass}} slds-icon slds-icon--small slds-media__figure{{hasIcon}}" src="{{objectIconUrl}}"/>' +
                '<div class="slds-media__body">' +
                    '<div class="slds-lookup__result-text">{{resultLabel}}</div>' +
                    '{{metaLabel}}' +
                '</div>' +
			'</span>' +
		'</li>';
    
	var searchTimer;
    
    var Lookup = function(el, options) {
        this.$el = $(el);
        this.$lookupContainer = this.$el.closest('.slds-lookup');
        this.isSingle = this.$lookupContainer.data('select') === 'single';
        this.settings = options;
       
       	if (this.isSingle) {
       		this.$singleSelect = $(selectContainerMarkup).insertBefore(this.$el);
       	} else {
       		this.$multiSelect = $(selectContainerMarkup).insertAfter(this.$lookupContainer.find('.slds-form-element__label'));
       		this.selectedResults = []; // We'll have to initialize.
            
            this.$multiSelect.css({
                'padding': 0,
                'margin-top': '-2px',
                'margin-left': '-2px',
                'border': 'none'
            });
       	}
        
        if (!this.isStringEmpty(options.searchTerm)) {
    		this.$el.val(options.searchTerm);
    		this.setSingleSelect();
    	} else if (options.initialSelection) {
    		this.setSelection(options.initialSelection);
    	}
        
        this.initLookup();
    };
    
    var handleResultsKeyup = function(e) {
        var $currentTarget = $(e.currentTarget);
        
        $currentTarget.removeClass('slds-has-focus');
        
        if (e.which === 38 || e.which === 40) { // Up or down arrow, respectively
            e.preventDefault();
            
            var firstItemSelector = ($('.slds-lookup .slds-lookup__list > li:first-child').is('.slds-lookup__item--label')) ? '.slds-lookup .slds-lookup__list > li:nth-child(2) .slds-lookup__item-action' : '.slds-lookup .slds-lookup__list > li:first-child .slds-lookup__item-action';
            
            if (e.which === 38) { // Up arrow
                if ($currentTarget.is(firstItemSelector)) { // Pressing up on the first item, loop over
                    $('.slds-lookup .slds-lookup__list > li:last-child .slds-lookup__item-action')
                        .focus()
                        .addClass('slds-has-focus');
                } else {
                    $currentTarget.closest('li')
                        .prev()
                        .find('.slds-lookup__item-action')
                        .focus()
                        .addClass('slds-has-focus');
                }
            } else { // Down arrow
                if ($currentTarget.is('.slds-lookup .slds-lookup__list > li:last-child .slds-lookup__item-action')) { // Pressing down on the last item, loop over
                    $(firstItemSelector)
                        .focus()
                        .addClass('slds-has-focus');
                } else {
                    $currentTarget.closest('li')
                        .next()
                        .find('.slds-lookup__item-action')
                        .focus()
                        .addClass('slds-has-focus');
                }
            }
        } else if (e.which === 13) { // Return key
            $currentTarget.click();
        }
    }
    
    Lookup.prototype = {
        constructor: Lookup,
        isStringEmpty: function(stringVal) {
        	return stringVal === null || typeof stringVal === 'undefined' || stringVal.trim() === '';
        },
        initLookup: function() {
        	var self = this;

        	this.$el.on('focus', this, this.runSearch)
                .on('blur', this, this.handleBlur)
                .on('keyup', this, this.handleKeyup);
            
            // Prevent multiple bindings
            $('body').off('keyup', '.slds-lookup .slds-lookup__list .slds-lookup__item-action', handleResultsKeyup);
            $('body').on('keyup', '.slds-lookup .slds-lookup__list .slds-lookup__item-action', handleResultsKeyup);
        },
        handleKeyup: function(e) {
            if (e.which === 40) { // Down arrow
                $('.slds-lookup .slds-lookup__list .slds-lookup__item-action').first()
                    .focus()
                    .addClass('slds-has-focus');
            } else {
                e.data.runSearch(e);
            }
        },
        runSearch: function(e) {
            var self = e.data;
            
            if (searchTimer) {
                if (self.settings.showDebugLog) console.log ('Cancelling search ', searchTimer);
                
                clearTimeout(searchTimer);
            }
            
            searchTimer = setTimeout(function() {
                var searchTerm = self.$el.val();
                if (!self.isStringEmpty(searchTerm)) {
                    self.getSearchTermResults(searchTerm);
                } else {
                    self.getDefaultResults();
                }
            }, self.settings.searchDelay);
        },
        setMultiSelect: function(selectedResults) {
        	var self = this;
        	var $multiSelect = this.$multiSelect.html('');
        	var $lookupContainer = this.$lookupContainer;
            var conditionalPillMarkup = (self.settings.useImgTag) ? customPillMarkup : pillMarkup;
            
        	if (selectedResults.length > 0) {
        		selectedResults.forEach(function(result) {
        			var $pill = $(conditionalPillMarkup.replace('{{objectIconUrl}}', self.settings.objectIconUrl)
                        .replace('{{objectIconClass}}', self.settings.objectIconClass)
                        .replace('{{hasIcon}}', (self.settings.objectIconUrl !== '') ? '' : ' slds-hide')
                        .replace('{{assetsLocation}}', self.settings.assetsLocation)
                        .replace(/{{objectLabel}}/g, self.settings.objectLabel)
                        .replace(/{{selectedResultLabel}}/g, result.label));
                    
        			$pill.removeClass('slds-size--1-of-1')
                        .attr('id', result.id)
                        .on('click', 'a, button', self, self.clearMultiSelectResult)
                        .css({
                            'margin': '2px',
                            'display': 'inline-flex'
                        })
                        .find('.slds-pill__remove')
                        .css({
                            'vertical-align': '1px',
                            'margin-left': '0.25rem'
                        });
                    
        			$multiSelect.append($pill);
        		});
                
        		$multiSelect.addClass('slds-show')
                    .removeClass('slds-hide');
        	} else {
        		$multiSelect.html('');
        		$multiSelect.addClass('slds-hide')
                    .removeClass('slds-show');
        	}
        },
        setSingleSelect: function(selectedResultLabel) {
        	var self = this;
        	var newResultLabel = selectedResultLabel || '';
            var conditionalPillMarkup = (self.settings.useImgTag) ? customPillMarkup : pillMarkup;
            
        	this.$singleSelect.html(conditionalPillMarkup.replace('{{objectIconUrl}}', this.settings.objectIconUrl)
                .replace('{{objectIconClass}}', self.settings.objectIconClass)
                .replace('{{hasIcon}}', (self.settings.objectIconUrl !== '') ? '' : ' slds-hide')
                .replace('{{assetsLocation}}', this.settings.assetsLocation)
                .replace(/{{objectLabel}}/g, self.settings.objectLabel)
                .replace(/{{selectedResultLabel}}/g, newResultLabel));
            
        	if (selectedResultLabel) {
        		this.$singleSelect.addClass('slds-show')
                    .removeClass('slds-hide');
                
    			this.$el.addClass('slds-hide')
        		this.$lookupContainer.addClass('slds-has-selection');
                
        		this.$singleSelect.one('click', 'button', this, this.clearSingleSelect);//'a, button', this, this.clearSingleSelect);
        	} else {
        		this.$singleSelect.addClass('slds-hide')
                    .removeClass('slds-show');
                
        		this.$el.val('')
        			.removeClass('slds-hide');
                
        		this.$lookupContainer.removeClass('slds-has-selection');
                
        		setTimeout(function() {
        			self.$el.focus();
        		}, 100);
        	}
        },
        getSearchTermResults: function(searchTerm) {
        	var self = this;
            
        	if (this.settings.items.length > 0) {
        		this.searchResults = this.settings.items.filter(function(item) {
        			return item.label.toLowerCase().match(searchTerm.toLowerCase()) !== null;
        		});
        		this.renderSearchResults();
        	} else { 
	        	var callback = function(searchResults) {
	        		self.searchResults = searchResults;
	        		self.renderSearchResults();
	        	};
                
	        	this.settings.filledSearchTermQuery(searchTerm, callback);
	        }
        },
        getDefaultResults: function() {
        	var self = this;
            
        	if (this.settings.items.length > 0) {
        		this.searchResults = this.settings.items;
        		this.renderSearchResults();
        	} else { 
        		var callback = function(searchResults) {
        			self.searchResults = searchResults;
        			self.renderSearchResults();
        		};
                
        		this.settings.emptySearchTermQuery(callback);
        	}
        },
        renderSearchResults: function() {
        	this.closeSearchDropdown();
            
        	var $lookupSearchContainer = $(lookupSearchContainerMarkup);
        	var $resultsListContainer = $lookupSearchContainer.find('ul.slds-lookup__list');
        	var searchTerm = this.$el.val();
            var regexSearchTerm = new RegExp('(' + searchTerm + ')', 'gi');
        	var self = this;
            var showUseSection = false;
            
        	if (!self.isStringEmpty(searchTerm) && searchTerm.length) {
                if (self.settings.showSearch) {
                    showUseSection = true;
                    
                    $resultsListContainer.prepend(searchMarkup.replace('{{searchTerm}}', searchTerm)
                        .replace('{{objectPluralLabel}}', self.settings.objectPluralLabel)
                        .replace('{{assetsLocation}}', $.aljs.assetsLocation));
                }
        	} else {
                if (self.settings.recentLabel) {
                    $resultsListContainer.before(recentMarkup.replace('{{recentLabel}}', self.settings.recentLabel));
                }
            }
            
        	this.searchResults.forEach(function(result) {
        		var $lookupResultItem;
                var conditionalLookupMarkup = (self.settings.useImgTag) ? customLookupResultItemMarkup : lookupResultItemMarkup;
                var markedResultLabel = result.label.replace(regexSearchTerm, '<mark>$1</mark>');
                
        		if (self.isSingle) {
        			$lookupResultItem = $resultsListContainer.append(conditionalLookupMarkup.replace('{{resultLabel}}', markedResultLabel)
                        .replace('{{hasIcon}}', (self.settings.objectIconUrl !== '') ? '' : ' slds-hide')
                        .replace('{{resultId}}', result.id)
                        .replace('{{objectIconUrl}}', self.settings.objectIconUrl)
                        .replace('{{objectIconClass}}', self.settings.objectIconClass)
                        .replace('{{metaLabel}}', (result.metaLabel) ? '<span class="slds-lookup__result-meta slds-text-body--small">' + result.metaLabel + '</span>' : ''));
        		} else if (self.selectedResults) {
        			var selectedResultsIds = self.selectedResults.map(function(result) { return result.id; });
                    
        			if (selectedResultsIds.length === 0 || selectedResultsIds.indexOf(result.id) === -1) {
        				$lookupResultItem = $resultsListContainer.append(conditionalLookupMarkup.replace('{{resultLabel}}', markedResultLabel)
                            .replace('{{hasIcon}}', (self.settings.objectIconUrl !== '') ? '' : ' slds-hide')
                            .replace('{{resultId}}', result.id)
                            .replace('{{objectIconUrl}}', self.settings.objectIconUrl)
                            .replace('{{objectIconClass}}', self.settings.objectIconClass)
                            .replace('{{metaLabel}}', (result.metaLabel) ? '<span class="slds-lookup__result-meta slds-text-body--small">' + result.metaLabel + '</span>' : ''));
        			}
        		}
                
        		if ($lookupResultItem) {
        			$lookupResultItem.find('.slds-lookup__item-action[id]').on('focus', function() {
	        			self.$el.attr('aria-activedescendant', $(this).attr('id'));
	        		}).on('blur', self, self.handleBlur);
        		}
        	});
            
        	if (this.settings.onClickNew) {
        		var $newItem = $resultsListContainer.append(newItemMarkup
                    .replace('{{objectLabel}}', this.settings.objectLabel)
                    .replace('{{assetsLocation}}', $.aljs.assetsLocation));
                
                $newItem.next().on('click', function() {
                    $newItem.off('click');
                    
                    self.settings.onClickNew();
                });
        	}
            
        	$resultsListContainer.one('click', '.slds-lookup__item-action[id]', this, this.clickResult)
            
            this.$lookupSearchContainer = $lookupSearchContainer.appendTo(this.$lookupContainer);
            
            var shouldShowSearchContainer = (this.searchResults.length > 0 && this.$el.closest('.slds-form-element').find('.slds-lookup__list > li').length > 0) || this.settings.onClickNew || showUseSection;
            
            if (shouldShowSearchContainer) {
                this.$el.attr('aria-expanded', 'true')
                    .closest('.slds-lookup')
                    .addClass('slds-is-open');
            } else {
                this.$lookupSearchContainer.remove();
            }
        },
        closeSearchDropdown: function() {
        	if (this.$lookupSearchContainer) {
        		this.$lookupSearchContainer.remove();
        		this.$lookupSearchContainer = null;
        	}
            
            this.$el.attr('aria-expanded', 'false')
                .attr('aria-activedescendant', null)
                .closest('.slds-lookup')
                .removeClass('slds-is-open');
        },
        handleBlur: function(e) {
        	var self = e.data;
            
            if ($(e.relatedTarget).closest('.slds-lookup.slds-is-open').length === 0 && self.$lookupSearchContainer) {
                self.closeSearchDropdown();
            }
        },
        clickResult: function(e) {
        	var self = e.data;
        	var selectedId = $(this).attr('id');
            
        	self.selectResult(selectedId);
        },
        selectResult: function(selectedId) {
        	var selectedResultArray = this.searchResults.filter(function(result) {
        		return result.id == selectedId;
        	});
            
        	this.closeSearchDropdown();
            
        	if (this.isSingle) {
        		this.selectedResult = selectedResultArray.length > 0 ? selectedResultArray[0] : null;
        		this.setSingleSelect(this.selectedResult.label);
                this.settings.onChange(this.selectedResult, true);
        	} else {
                if (selectedResultArray.length > 0) {
                    this.selectedResults.push(selectedResultArray[0]);
                    this.setMultiSelect(this.selectedResults);
                    this.$el.val('');
                }
                
                this.settings.onChange(this.selectedResults, true);
        	}
        },
        clearSingleSelect: function(e) {
        	var self = e.data;
            self.selectedResult = null;
        	self.setSingleSelect();
            
            self.settings.onChange(self.selectedResult, false);
        },
        clearMultiSelectResult: function(e) {
        	var self = e.data;
        	var $clickedPill = $(this).closest('span.slds-pill');
        	var resultId = $clickedPill.attr('id');
        	var indexToRemove;
            
            self.closeSearchDropdown();
            
        	self.selectedResults.forEach(function(result, index) {
        		if (result.id == resultId) {
        			indexToRemove = index;
        		}
        	});
            
        	if (typeof indexToRemove !== 'undefined' && indexToRemove !== null) {
        		self.selectedResults.splice(indexToRemove, 1);
        		self.setMultiSelect(self.selectedResults);
                
                self.settings.onChange(self.selectedResults, false);
        	}
        },
        getSelection: function() {
            if (this.isSingle) {
                return this.selectedResult || null;
            } else {
                return this.selectedResults || null;
            }
        },
        setSelection: function(selection) {
            var self = this;
            
            if (selection && typeof selection === 'object') {
                if ($.isEmptyObject(selection)) {
                    if (self.isSingle) {
                        self.selectedResult = null;
                        self.setSingleSelect();
                        self.settings.onChange(self.selectedResult, false);
                    } else {
                        self.selectedResults = [];
                        self.setMultiSelect(self.selectedResults);
                        self.settings.onChange(self.selectedResults, false);
                    }
                } else {
                    if (selection instanceof Array) {
                        this.searchResults = selection;
                        this.selectedResults = [];
                        
                        selection.forEach(function(s) {
                            self.selectResult(s.id);
                        });
                    } else {
                        this.selectedResult = null;
                        this.searchResults = [selection];
                        self.selectResult(selection.id);
                    }
                }
            } else {
                throw new Error('setSelection must be called with either a valid result object or an array of result objects.')
            }
        }
    };
    
    $.fn.lookup = function(options) {
        var lookupArguments = arguments;
        var internalReturn;
       // var arguments = arguments;
        
        var settings = $.extend({
            // These are the defaults
            assetsLocation: $.aljs.assetsLocation,
            objectPluralLabel: 'Objects',
            objectLabel: 'Object',
            useImgTag: false,
            objectIconUrl: $.aljs.assetsLocation + '/assets/icons/standard-sprite/svg/symbols.svg#account',
            objectIconClass: 'slds-icon-standard-account',
            searchTerm: '',
            items: [],
            emptySearchTermQuery: function (callback) { callback([]); },
            filledSearchTermQuery: function (searchTerm, callback) { callback([]); },
            onClickNew: null,
            onChange: function() {},
            initialSelection: null,
            recentLabel: 'Recent Objects',
            showSearch: false,
            searchDelay: 500
        }, typeof options === 'object' ? options : {});
        
        this.each(function() {
            var $this = $(this),
                data = $this.data('aljs-lookup');
            
            if (!data) {
                var lookupData = new Lookup(this, settings);
                $this.data('aljs-lookup', (data = lookupData));
            }
            
            if (typeof options === 'string') {
                internalReturn = data[options](lookupArguments[1], lookupArguments[2]);
            }
        });
        
        if (internalReturn === undefined || internalReturn instanceof Lookup) {
            return this;
        }
        
        if (this.length > 1) {
            throw new Error('Using only allowed for the collection of a single element (' + option + ' function)');
        } else {
            return internalReturn;
        }
    }
}(jQuery));
