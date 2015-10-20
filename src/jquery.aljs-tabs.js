if (typeof jQuery === "undefined") { throw new Error("The Salesforce Lightning JavaScript Toolkit requires jQuery") }

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
            });
            // show first tab
            if (this.settings.initialTabId === '' || $('#' + this.settings.initialTabId).length === 0) {
                this.selectTab($tabButtons.first().data('aljs-show'));
            } else {
                this.selectTab(this.settings.initialTabId);
            }
        },
        selectTab: function(tabId) {
            this.$el.find('.slds-tabs__item').removeClass('slds-active');
            this.$el.find('.slds-tabs__content').hide();
            this.$el.find('[data-aljs-show="' + tabId + '"]').closest('li').addClass('slds-active');
            this.$el.find('#' + tabId).show();
        }
    };

    $.fn.tabs = function(options) {
        var tabsArguments = arguments;
        var internalReturn;

        var settings = $.extend({
            // These are the defaults.
            initialTabId: '',
            assetsLocation: '',
            onChange: function(obj) {

            }
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