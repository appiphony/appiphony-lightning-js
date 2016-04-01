if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {
	var selectContainerMarkup = '<div class="slds-pill__container slds-hide"></div>';
	var pillMarkup = 
    	'<span class="slds-pill">' +
      		'<a href="javascript:void(0)" class="slds-pill__label">' +
        		'<svg aria-hidden="true" class="{{objectIconClass}} slds-icon slds-pill__icon{{hasIcon}}">' +
          			'<use xlink:href="{{objectIconUrl}}"></use>' +
        		'</svg>' +
                '<span class="slds-pill__label">{{selectedResultLabel}}</span>' +
                '<button class="slds-button slds-button--icon-bare slds-pill__remove">' +
                    '<svg aria-hidden="true" class="slds-button__icon">' +
                        '<use xlink:href="{{assetsLocation}}/assets/icons/utility-sprite/svg/symbols.svg#close"></use>' +
                    '</svg>' +
                    '<span class="slds-assistive-text">Remove</span>' +
                '</button>' +
        	'</a>' +
    	'</span>';

	var customPillMarkup = 
    	'<span class="slds-pill">' +
      		'<a href="javascript:void(0)" class="slds-pill__label">' +
                '<img class="{{objectIconClass}} slds-icon slds-pill__icon{{hasIcon}}" src="{{objectIconUrl}}"/>' +
                '<span class="slds-pill__label">{{selectedResultLabel}}</span>' +
                '<button class="slds-button slds-button--icon-bare slds-pill__remove">' +
                    '<svg aria-hidden="true" class="slds-button__icon">' +
                        '<use xlink:href="{{assetsLocation}}/assets/icons/utility-sprite/svg/symbols.svg#close"></use>' +
                    '</svg>' +
                    '<span class="slds-assistive-text">Remove</span>' +
                '</button>' +
        	'</a>' +
    	'</span>';

	var lookupSearchContainerMarkup = 
		'<div class="slds-lookup__menu" role="listbox">' +
			'<ul class="slds-lookup__list" role="presentation">' +
			'</ul>' +
		'</div>';

	var useMarkup = 
		'<div class="slds-lookup__item">' +
			'<button class="slds-button">' +
				'<svg aria-hidden="true" class="slds-icon-text-default slds-icon slds-icon--small{{hasIcon}}">' +
					'<use xlink:href="{{assetsLocation}}/assets/icons/utility-sprite/svg/symbols.svg#search"></use>' +
				'</svg>&quot;{{searchTerm}}&quot; in {{objectPluralLabel}}' +
			'</button>' +
		'</div>';

	var addItemMarkup = 
		'<div class="slds-lookup__item">' +
			'<button class="slds-button">' +
				'<svg aria-hidden="true" class="slds-icon-text-default slds-icon slds-icon--small{{hasIcon}}">' +
					'<use xlink:href="{{assetsLocation}}/assets/icons/utility-sprite/svg/symbols.svg#add"></use>' +
				'</svg>Add {{objectLabel}}' +
			'</button>' +
		'</div>';

	var lookupResultItemMarkup = 
		'<li class="slds-lookup__item">' +
			'<a id="{{resultId}}" href="javascript:void(0)" role="option">' +
				'<svg aria-hidden="true" class="{{objectIconClass}} slds-icon slds-icon--small{{hasIcon}}">' +
					'<use xlink:href="{{objectIconUrl}}"></use>' +
				'</svg>{{resultLabel}}' +
			'</a>' +
		'</li>';

	var customLookupResultItemMarkup = 
		'<li class="slds-lookup__item">' +
			'<a id="{{resultId}}" href="javascript:void(0)" role="option">' +
                '<img class="{{objectIconClass}} slds-icon slds-icon--small{{hasIcon}}" src="{{objectIconUrl}}"/>{{resultLabel}}' +
			'</a>' +
		'</li>';

    var Lookup = function(el, options) {
        this.$el = $(el);
        this.$lookupContainer = this.$el.closest('.slds-lookup');
        this.isSingle = this.$lookupContainer.data('select') === 'single';
        this.settings = options;
       
       	if (this.isSingle) {
       		this.$singleSelect = $(selectContainerMarkup).insertBefore(this.$el);
       	} else {
       		this.$multiSelect = $(selectContainerMarkup).appendTo(this.$lookupContainer.find('.slds-form-element'));
       		this.selectedResults = []; // We'll have to initialize.
       	}

        if (!this.isStringEmpty(options.searchTerm)) {
    		this.$el.val(options.searchTerm);
    		this.setSingleSelect();
    	} else if (options.initialSelection) {
    		this.setSelection(options.initialSelection);
    	}

        this.initLookup();
    };

    Lookup.prototype = {
        constructor: Lookup,
        isStringEmpty: function(stringVal) {
        	return stringVal === null || typeof stringVal === 'undefined' || stringVal.trim() === '';
        },
        initLookup: function() {
        	var self = this;

        	this.$el.on('focus', this, this.runSearch)
        			.on('keyup', this, this.runSearch)
        			.on('blur', this, this.handleBlur);

			this.$lookupContainer.on('keyup', function(e) {
				e.stopPropagation();

				var $focusedA = $(this).find('a:focus');

				if (e.keyCode === 27) {
		        	self.$el.blur();
		        }

		        if (e.keyCode === 40) {
		            // DOWN
		            if ($focusedA.length > 0) {
		            	$focusedA.parent().next().find('a').focus();
		            } else {
		            	$(this).find('.slds-lookup__list').find('a:first').focus();
		            }
		        }

		        if (e.keyCode === 38) {
		            // UP
		            if ($focusedA.length > 0) {
		            	$focusedA.parent().prev().find('a').focus();
		            } else {
		            	$(this).find('.slds-lookup__list').find('a:last').focus();
		            }
		        }
			});
        },
        runSearch: function(e) {
        	var self = e.data;
        	var searchTerm = self.$el.val();

        	if (!self.isStringEmpty(searchTerm)) {
        		self.getSearchTermResults(searchTerm);
        	} else {
        		self.getDefaultResults();
        	}
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
                                .replace('{{selectedResultLabel}}', result.label));
        			$pill.removeClass('slds-pill--bare')
                        .attr('id', result.id)
                        .on('click', 'a, button', self, self.clearMultiSelectResult);
        			$multiSelect.append($pill);
        		});

        		$multiSelect.addClass('slds-show')
                    .removeClass('slds-hide');
        		$lookupContainer.addClass('slds-has-selection');
        	} else {
        		$multiSelect.html('');
        		$multiSelect.addClass('slds-hide')
                    .removeClass('slds-show');
        		$lookupContainer.removeClass('slds-has-selection');
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
                                    .replace('{{selectedResultLabel}}', newResultLabel));

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
        			.removeClass('slds-hide')
        		this.$lookupContainer.removeClass('slds-has-selection');

        		window.setTimeout(function() {
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
        	var self = this;
            var showUseSection = false;
            
        	if (!this.isStringEmpty(searchTerm) && searchTerm.length > 1 && this.settings.showSearch === true) {
                showUseSection = true;
                
        		$resultsListContainer.before(useMarkup.replace('{{searchTerm}}', searchTerm)
                                            .replace('{{objectPluralLabel}}', this.settings.objectPluralLabel)
                                            .replace('{{assetsLocation}}', $.aljs.assetsLocation));
        	}

        	this.searchResults.forEach(function(result) {
        		var $lookupResultItem;
                var conditionalLookupMarkup = (self.settings.useImgTag) ? customLookupResultItemMarkup : lookupResultItemMarkup;
        		if (self.isSingle) {
        			$lookupResultItem = $resultsListContainer.append(conditionalLookupMarkup.replace('{{resultLabel}}', result.label)
                                                                    .replace('{{hasIcon}}', (self.settings.objectIconUrl !== '') ? '' : ' slds-hide')
                                                                    .replace('{{resultId}}', result.id)
                                                                    .replace('{{objectIconUrl}}', self.settings.objectIconUrl)
                                                                    .replace('{{objectIconClass}}', self.settings.objectIconClass));
        		} else if (self.selectedResults) {
        			var selectedResultsIds = self.selectedResults.map(function(result) { return result.id; });

        			if (selectedResultsIds.length === 0 || selectedResultsIds.indexOf(result.id) === -1) {
        				$lookupResultItem = $resultsListContainer.append(conditionalLookupMarkup.replace('{{resultLabel}}', result.label)
                                                                        .replace('{{hasIcon}}', (self.settings.objectIconUrl !== '') ? '' : ' slds-hide')
                                                                        .replace('{{resultId}}', result.id)
                                                                        .replace('{{objectIconUrl}}', self.settings.objectIconUrl)
                                                                        .replace('{{objectIconClass}}', self.settings.objectIconClass));
        			}
        		}

        		if ($lookupResultItem) {
        			$lookupResultItem.find('a').on('focus', function() {
	        			self.$el.attr('aria-activedescendant', $(this).attr('id'));
	        		}).on('blur', self, self.handleBlur);
        		}
        	});

        	if (this.settings.clickAddFunction) {
        		var $addItem = $resultsListContainer.after(addItemMarkup
                                                           .replace('{{hasIcon}}', ' slds-icon')
                                                           .replace('{{objectLabel}}', this.settings.objectLabel)
                                                           .replace('{{assetsLocation}}', $.aljs.assetsLocation));
                $addItem.next().on('click', function() {
                    $addItem.off('click');

                    self.settings.clickAddFunction();
                });
        	}

        	$resultsListContainer.one('click', 'a', this, this.clickResult)
            
            var shouldAppendSearchContainer = this.searchResults.length > 0 || this.settings.clickAddFunction || showUseSection;
            
            if (shouldAppendSearchContainer) {
                this.$lookupSearchContainer = $lookupSearchContainer;
                $lookupSearchContainer.appendTo(this.$lookupContainer);
                this.$el.attr('aria-expanded', 'true');
            }
        },
        closeSearchDropdown: function() {
        	if (this.$lookupSearchContainer) {
        		this.$lookupSearchContainer.remove();
        		this.$lookupSearchContainer = null;
        	}

        	this.$el.attr('aria-expanded', 'false');
        	this.$el.attr('aria-activedescendant', null);
        },
        handleBlur: function(e) {
        	var self = e.data;

            window.setTimeout(function() {
            	if ($(e.relatedTarget).closest('.slds-lookup__menu').length === 0 && self.$lookupSearchContainer) {
            		self.closeSearchDropdown();
            	}
            }, 250);
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
        	} else if (selectedResultArray.length > 0) {
        		this.selectedResults.push(selectedResultArray[0]);
        		this.setMultiSelect(this.selectedResults);
        		this.$el.val('');
        	}

            if (this.isSingle) {
                this.settings.onChange(this.selectedResult, true);
            } else {
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
            objectIconUrl: '/assets/icons/standard-sprite/svg/symbols.svg#account',
            objectIconClass: 'slds-icon-standard-account',
            searchTerm: '',
            items: [],
            emptySearchTermQuery: function (callback) { callback([]); },
            filledSearchTermQuery: function (searchTerm, callback) { callback([]); },
            clickAddFunction: null,
            onChange: function() {},
            initialSelection: null,
            showSearch: false
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