if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {

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
        this.settings = options;
       
       if (!this.isStringEmpty(options.searchTerm)) {
    		this.$el.val(options.searchTerm);
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
        	if (this.$lookupSearchContainer) {
        		this.$lookupSearchContainer.remove();
        		this.$lookupSearchContainer = null;
        	}

        	var $lookupSearchContainer = $(lookupSearchContainerMarkup);
        	var $resultsListContainer = $lookupSearchContainer.find('ul.slds-lookup__list');
        	var searchTerm = this.$el.val();
        	var self = this;

        	if (!this.isStringEmpty(searchTerm) && searchTerm.length > 1) {
        		$resultsListContainer.append(useMarkup.replace('{{searchTerm}}', searchTerm)
        											  .replace('{{objectPluralLabel}}', this.settings.objectPluralLabel)
        											  .replace('{{assetsLocation}}', $.aljs.assetsLocation));
        	}

        	this.searchResults.forEach(function(result) {
        		var $lookupResultItem = $resultsListContainer.append(lookupResultItemMarkup
        														.replace('{{resultLabel}}', result.label)
        														.replace('{{resultId}}', result.id)
        														.replace('{{objectIconUrl}}', self.settings.objectIconUrl));
        	});

        	if (this.settings.clickAddFunction) {
        		var $addItem = $resultsListContainer.append(addItemMarkup
        									.replace('{{objectLabel}}', this.settings.objectLabel)
        								 	.replace('{{assetsLocation}}', $.aljs.assetsLocation));
        	}

        	$resultsListContainer.on('click', 'a', this, this.clickResult);

        	this.$lookupSearchContainer = $lookupSearchContainer;
        	$lookupSearchContainer.appendTo(this.$lookupContainer);
        },
        handleBlur: function(e) {
        	var self = e.data;

        	if ($(e.relatedTarget).closest('.slds-lookup__menu').length === 0 && self.$lookupSearchContainer) {
        		self.$lookupSearchContainer.remove();
        		self.$lookupSearchContainer = null;
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

        	this.selectedResult = selectedResultArray.length > 0 ? selectedResultArray[0] : null;

        	this.$lookupSearchContainer.remove();
        	this.$lookupSearchContainer = null;
        	this.$el.val(this.selectedResult.label);
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