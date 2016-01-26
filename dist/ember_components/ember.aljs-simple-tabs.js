if (typeof _AljsApp === 'undefined') { throw new Error("Please include ember.aljs-init.js in your compiled Ember Application"); }

_AljsApp.AljsSimpleTabsComponent = Ember.Component.extend({
    layoutName: 'components/aljs-simple-tabs',
    attributeBindings: ['tabObjects', 'activeTabIndex'],
    sldsTabsNavClass: function() {
        var classes = this.get('classNames');
        var sldsTabsClass = classes.filter(function(className) {
            return !Ember.isEmpty(className.match('slds-tabs'));
        });

        return !Ember.isEmpty(sldsTabsClass) ? sldsTabsClass[0] + '__nav' : null;
    }.property(),
    sldsTabsItemClass: function() {
        var classes = this.get('classNames');
        var sldsTabsClass = classes.filter(function(className) {
            return !Ember.isEmpty(className.match('slds-tabs'));
        });

        return !Ember.isEmpty(sldsTabsClass) ? sldsTabsClass[0] + '__item slds-text-heading--label' : null;
    }.property(),
    sldsTabsLinkClass: function() {
        var classes = this.get('classNames');
        var sldsTabsClass = classes.filter(function(className) {
            return !Ember.isEmpty(className.match('slds-tabs'));
        });

        return !Ember.isEmpty(sldsTabsClass) ? sldsTabsClass[0] + '__link' : null;
    }.property(),
    tabLinks: function() {
        var activeTabIndex = this.get('activeTabIndex');
        return this.get('tabObjects').map(function(tab, index) {
            var isActiveTab = (!Ember.isNone(activeTabIndex) && index === activeTabIndex) || (Ember.isNone(activeTabIndex) && index === 0);

            return Ember.Object.create({
                label: tab.label,
                partial: tab.partial,
                partialId: tab.partialId,
                isActive: isActiveTab,
                index: isActiveTab ? '0' : '-1'
            });
        });
    }.property('tabObjects', 'activeTabIndex'),
    activeTab: function() {
        return this.get('tabLinks').findBy('isActive', true);
    }.property('tabLinks.@each.isActive'),
    keyUp: function(e) {
        var tabLinks = this.get('tabLinks');
        var activeTabIndex = tabLinks.indexOf(this.get('activeTab'));

        if (e.which === 37) {
            // left

            var previousTabIndex = activeTabIndex === 0 ? tabLinks.length - 1 : activeTabIndex - 1;

            this.send('clickTab', tabLinks[previousTabIndex]);
        } else if (e.which === 39) {
            // right

            var nextTabIndex = activeTabIndex === tabLinks.length - 1 ? 0 : activeTabIndex + 1;

            this.send('clickTab', tabLinks[nextTabIndex]);
        }
    },
    actions: {
        clickTab: function(tabLink) {
            var tabLinks = this.get('tabLinks');
            tabLinks.setEach('isActive', false);
            tabLink.set('isActive', true);
            this.set('activeTabIndex', tabLinks.indexOf(tabLink));
            Ember.run.scheduleOnce('afterRender', this, function() {
                this.$().find('li[tabindex="0"]').find('a').focus();
            });
        }
    }
});