if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {

    var Tabs = function(el, settings) {
        this.$el = $(el);

        this.settings = settings;

        this.initTabs();
    };

    Tabs.prototype = {
        constructor: Tabs,
        initTabs: function() {
            // bind buttons
            var self = this;
            var $tabButtons = this.$el.find('a[data-aljs-show]');
            $tabButtons.on('click', function(e) {
                e.stopPropagation();
                self.selectTab($(e.target).data('aljs-show'));
                $(this).trigger('selected.aljs.tab'); // Custom aljs event
            });
            // show first tab
            if (this.settings.defaultTabId === '' || $('#' + this.settings.defaultTabId).length === 0) {
                this.selectTab($tabButtons.first().data('aljs-show'));
            } else {
                this.selectTab(this.settings.defaultTabId);
            }
        },
        selectTab: function(tabId) {
            this.$el.find('.slds-tabs__item').removeClass('slds-active');
            this.$el.find('.slds-tabs__content').hide();
            this.$el.find('[data-aljs-show="' + tabId + '"]').closest('li').addClass('slds-active');
            this.$el.find('#' + tabId).show().trigger('shown.aljs.tabcontent'); // Custom aljs event
            
            this.id = tabId;
            this.settings.onChange(this);
        }
    };

    $.fn.tabs = function(options) {
        var tabsArguments = arguments;
        var internalReturn;

        var settings = $.extend({
            // These are the defaults.
            defaultTabId: '',
            onChange: function(obj) {},
            assetsLocation: $.aljs.assetsLocation
        }, typeof options === 'object' ? options : {});

        this.each(function() {
            var $this = $(this),
                data = $this.data('aljs-tabs');

            if (!data) {
                var tabsData = new Tabs(this, settings);
                $this.data('aljs-tabs', (data = tabsData));
            }
            
            if (typeof options === 'string') {
                internalReturn = data[options](tabsArguments[1], tabsArguments[2]);
            }
        });

        if (internalReturn === undefined || internalReturn instanceof Tabs) {
            return this;
        }

        if (this.length > 1) {
            throw new Error('Using only allowed for the collection of a single element (' + option + ' function)');
        } else {
            return internalReturn;
        }
    }
}(jQuery));