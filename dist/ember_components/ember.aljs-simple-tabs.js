if (typeof _AljsApp === 'undefined') { throw new Error("Please include ember.aljs-init.js in your compiled Ember Application"); }

_AljsApp.AljsSimpleTabsComponent = Ember.Component.extend({
    layoutName: 'components/aljs-simple-tabs',
    attributeBindings: ['tabObjects', 'activeTabIndex'],
    tabLinks: function() {
        var activeTabIndex = this.get('activeTabIndex');
        return this.get('tabObjects').map(function(tab, index) {
            return Ember.Object.create({
                label: tab.label,
                partial: tab.partial,
                isActive: (!Ember.isNone(activeTabIndex) && index === activeTabIndex) || (Ember.isNone(activeTabIndex) && index === 0) ? true : false
            });
        });
    }.property('tabObjects', 'activeTabIndex'),
    activeTab: function() {
        return this.get('tabLinks').findBy('isActive', true);
    }.property('tabLinks.@each.isActive'),
    actions: {
        clickTab: function(tabLink) {
            this.get('tabLinks').setEach('isActive', false);
            tabLink.set('isActive', true);
        }
    }
});