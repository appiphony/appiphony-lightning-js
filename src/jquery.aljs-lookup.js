if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {
	var selectContainerMarkup = '<div class="slds-pill-container slds-hide"></div>';
	var pillMarkup = 
    	'<span class="slds-pill slds-pill--bare">' +
      		'<a href="#" class="slds-pill__label">' +
        		'<svg aria-hidden="true" class="slds-icon slds-icon-standard-account slds-icon--small">' +
          			'<use xlink:href="{{objectIconUrl}}"></use>' +
        		'</svg>{{selectedResultLabel}}' +
        	'</a>' +
      		'<button class="slds-button slds-button--icon-bare">' +
        		'<svg aria-hidden="true" class="slds-button__icon">' +
          			'<use xlink:href="{{assetsLocation}}/assets/icons/utility-sprite/svg/symbols.svg#close"></use>' +
        		'</svg>' +
        		'<span class="slds-assistive-text">Remove</span>' +
      		'</button>' +
    	'</span>';

	var lookupSearchContainerMarkup = 
		'<div class="slds-lookup__menu" role="listbox">' +
			'<ul class="slds-lookup__list" role="presentation">' +
			'</ul>' +
		'</div>';

	var useMarkup = 
		'<div class="slds-lookup__item">' +
			'<button class="slds-button">' +
				'<svg aria-hidden="true" class="slds-icon slds-icon-text-default slds-icon--small">' +
					'<use xlink:href="{{assetsLocation}}/assets/icons/utility-sprite/svg/symbols.svg#search"></use>' +
				'</svg>&quot;{{searchTerm}}&quot; in {{objectPluralLabel}}' +
			'</button>' +
		'</div>';

	var addItemMarkup = 
		'<div class="slds-lookup__item">' +
			'<button class="slds-button">' +
				'<svg aria-hidden="true" class="slds-icon slds-icon-text-default slds-icon--small">' +
					'<use xlink:href="{{assetsLocation}}/assets/icons/utility-sprite/svg/symbols.svg#add"></use>' +
				'</svg>Add {{objectLabel}}' +
			'</button>' +
		'</div>';

	var lookupResultItemMarkup = 
		'<li class="slds-lookup__item">' +
			'<a id="{{resultId}}" href="#" role="option">' +
				'<svg aria-hidden="true" class="slds-icon slds-icon-standard-account slds-icon--small">' +
					'<use xlink:href="{{objectIconUrl}}"></use>' +
				'</svg>{{resultLabel}}' +
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
    	} else if (options.initialSelectedResult) {
    		this.setSingleSelect(options.initialSelectedResult.label);
    	}

        this.initLookup();
    };

    Lookup.prototype = {
        constructor: Lookup,
        isStringEmpty: function(stringVal) {
        	return stringVal === null || typeof stringVal === 'undefined' || stringVal.trim() === '';
        },
        initLookup: function() {
        	this.$el.on('focus', this, this.runSearch)
        			.on('keyup', this, this.runSearch)
        			.on('blur', this, this.handleBlur);
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

        	if (selectedResults.length > 0) {
        		selectedResults.forEach(function(result) {
        			var $pill = $(pillMarkup.replace('{{objectIconUrl}}', self.settings.objectIconUrl)
    												  .replace('{{assetsLocation}}', self.settings.assetsLocation)
    												  .replace('{{selectedResultLabel}}', result.label));

        			$pill.attr('id', result.id);
        			$pill.on('click', 'a, button', self, self.clearMultiSelectResult);
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

        	this.$singleSelect.html(pillMarkup.replace('{{objectIconUrl}}', this.settings.objectIconUrl)
    												  .replace('{{assetsLocation}}', this.settings.assetsLocation)
    												  .replace('{{selectedResultLabel}}', newResultLabel));

        	if (selectedResultLabel) {
        		this.$singleSelect.addClass('slds-show')
    						  	  .removeClass('slds-hide');

    			this.$el.addClass('slds-hide')
        		this.$lookupContainer.addClass('slds-has-selection');

        		this.$singleSelect.one('click', 'a, button', this, this.clearSingleSelect);
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
        			return item.label.match(searchTerm) !== null;
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

        	if (!this.isStringEmpty(searchTerm) && searchTerm.length > 1) {
        		$resultsListContainer.before(useMarkup.replace('{{searchTerm}}', searchTerm)
        											  .replace('{{objectPluralLabel}}', this.settings.objectPluralLabel)
        											  .replace('{{assetsLocation}}', $.aljs.assetsLocation));
        	}

        	this.searchResults.forEach(function(result) {
        		if (self.isSingle) {
        			$resultsListContainer.append(lookupResultItemMarkup
        														.replace('{{resultLabel}}', result.label)
        														.replace('{{resultId}}', result.id)
        														.replace('{{objectIconUrl}}', self.settings.objectIconUrl));
        		} else if (self.selectedResults) {
        			var selectedResultsIds = self.selectedResults.map(function(result) { return result.id; });

        			if (selectedResultsIds.length === 0 || selectedResultsIds.indexOf(result.id) === -1) {
        				$resultsListContainer.append(lookupResultItemMarkup
        														.replace('{{resultLabel}}', result.label)
        														.replace('{{resultId}}', result.id)
        														.replace('{{objectIconUrl}}', self.settings.objectIconUrl));
        			}
        		}
        		
        	});

        	if (this.settings.clickAddFunction) {
        		var $addItem = $resultsListContainer.after(addItemMarkup
        									.replace('{{objectLabel}}', this.settings.objectLabel)
        								 	.replace('{{assetsLocation}}', $.aljs.assetsLocation));
        	}

        	$resultsListContainer.one('click', 'a', this, this.clickResult);

        	this.$lookupSearchContainer = $lookupSearchContainer;
        	$lookupSearchContainer.appendTo(this.$lookupContainer);
        },
        closeSearchDropdown: function() {
        	if (this.$lookupSearchContainer) {
        		this.$lookupSearchContainer.remove();
        		this.$lookupSearchContainer = null;
        	}
        },
        handleBlur: function(e) {
        	var self = e.data;

        	if ($(e.relatedTarget).closest('.slds-lookup__menu').length === 0 && self.$lookupSearchContainer) {
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
        	} else if (selectedResultArray.length > 0) {
        		this.selectedResults.push(selectedResultArray[0]);
        		this.setMultiSelect(this.selectedResults);
        	}
        },
        clearSingleSelect: function(e) {
        	var self = e.data;

        	self.setSingleSelect();
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
        	}
        }
    };

    $.fn.lookup = function(options) {
        var lookupArguments = arguments;
        var internalReturn;
       // var arguments = arguments;

        var settings = $.extend({
            // These are the defaults.
            assetsLocation: $.aljs.assetsLocation,
            objectPluralLabel: 'Stuffs',
            objectLabel: 'Stuff',
            objectIconUrl: 'assets/icons/standard-sprite/svg/symbols.svg#account',
            searchTerm: '',
            items: [],
            emptySearchTermQuery: function () { callback([]); },
            filledSearchTermQuery: function (searchTerm, callback) { callback([]); },
            clickAddFunction: null
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