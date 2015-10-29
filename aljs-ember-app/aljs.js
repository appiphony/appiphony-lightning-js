// Defining hashbang
(function () {
    var get = Ember.get,
        set = Ember.set;

    Ember.Location.registerImplementation('hashbang', Ember.HashLocation.extend({

        getURL: function () {
            return get(this, 'location').hash.substr(2);
        },

        setURL: function (path) {
            get(this, 'location').hash = "!" + path;
            set(this, 'lastSetURL', "!" + path);
        },

        onUpdateURL: function (callback) {
            var self = this;
            var guid = Ember.guidFor(this);

            Ember.$(window).bind('hashchange.ember-location-' + guid, function () {
                Ember.run(function () {
                    var path = location.hash.substr(2);
                    if (get(self, 'lastSetURL') === path) {
                        return;
                    }

                    set(self, 'lastSetURL', null);

                    callback(location.hash.substr(2));
                });
            });
        },

        formatURL: function (url) {
            return '#!' + url;
        }

    }));
})();

// Kick off Ember
App = Ember.Application.create({
    rootElement: '#app'
});

App.setCookie = function(name, value) {
    var d = new Date();
    d.setTime(d.getTime() + (365*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    
    document.cookie = name + '=' + value + ';' + expires;
};

App.getCookie = function(name) {
    return document.cookie.replace(new RegExp('(?:(?:^|.*;\\s*)' + name + '\\s*\\=\\s*([^;]*).*$)|^.*$/'), "$1");
};

App.AljsView = Ember.View.extend({
    didInsertElement: function() {
        
    }
});

App.SelectedSectionMixin = Ember.Mixin.create({
    needs: ['aljs'],
    selectedSectionBinding: 'controllers.aljs.selectedSection',
    sectionPartial: function() {
        return (this.get('routeName') + ' ' + this.get('selectedSection')).camelize();
    }.property('selectedSection', 'routeName'),
    isJQuery: function() {
        return this.get('selectedSection') === 'jQuery';
    }.property('selectedSection'),
    isEmber: function() {
        return this.get('selectedSection') === 'ember';
    }.property('selectedSection')
});

App.AljsHeaderComponent = Ember.Component.extend({
    layoutName: 'components/aljs-header'
});

App.AljsMainContentComponent = Ember.Component.extend({
    layoutName: 'components/aljs-main-content'
});

App.AljsDemoContainerComponent = Ember.Component.extend({
    layoutName: 'components/aljs-demo-container'
});

App.AljsCodeContainerComponent = Ember.Component.extend({
    layoutName: 'components/aljs-code-container',
    attributeBindings: ['routeName', 'selectedSection'],
    selectedSection: 'jQuery',
    sectionPartial: function() {
        return (this.get('routeName') + ' ' + this.get('selectedSection')).camelize();
    }.property('selectedSection', 'routeName'),
    isJQuery: function() {
        return this.get('selectedSection') === 'jQuery';
    }.property('selectedSection'),
    isEmber: function() {
        return this.get('selectedSection') === 'ember';
    }.property('selectedSection'),
    actions: {
        clickSection: function(section) {
            this.set('selectedSection', section);
            App.setCookie('aljs_selected_lib', section);
        }
    }
});

// App.AljsCodeContainerView = Ember.View.extend({
//     layoutName: 'aljs-code-container'
// });

App.AljsPreContainerComponent = Ember.Component.extend({
    layoutName: 'components/aljs-pre-container',
    classNames: 'aljs-pre-container',
    didInsertElement: function() {
        var $this = this.$();
        // var markup = $this.find('[data-aljs="yield"]').remove().html().trim()
        //                     .replace(/<((?!\/?highlight)[^>]+)>/g, '&lt;$1&gt;')
        //                     .replace(/<highlight>/g, '<span class="highlight">')
        //                     .replace(/<\/highlight>/g, '<\/span>');
        var markup = $this.find('[data-aljs="yield"]').remove().html().trim()
                                .replace(/<([^>]+)>/g, '&lt;$1&gt;')
                                .replace(/(data-aljs[\S]+")/g, '<span class="highlight">$1</span>');
        $this.find('pre:first').append(markup);
    }
});

App.PicklistsController = Ember.ObjectController.extend(App.SelectedSectionMixin, {
    routeName: 'picklists'
});

App.TooltipsController = Ember.ObjectController.extend(App.SelectedSectionMixin, {
    routeName: 'tooltips'
});

App.ModalsController = Ember.ObjectController.extend(App.SelectedSectionMixin, {
    routeName: 'modals'
});

App.PopoversController = Ember.ObjectController.extend(App.SelectedSectionMixin, {
    routeName: 'popovers'
});

App.DatepickersController = Ember.ObjectController.extend(App.SelectedSectionMixin, {
    routeName: 'datepickers'
});

App.TabsController = Ember.ObjectController.extend(App.SelectedSectionMixin, {
    routeName: 'tabs'
});

App.LookupsController = Ember.ObjectController.extend(App.SelectedSectionMixin, {
    routeName: 'lookups'
});

App.PillsController = Ember.ObjectController.extend(App.SelectedSectionMixin, {
    routeName: 'pills'
});

App.NotificationsController = Ember.ObjectController.extend(App.SelectedSectionMixin, {
    routeName: 'notifications'
});

App.GettingStartedController = Ember.ObjectController.extend(App.SelectedSectionMixin, {
    routeName: 'gettingStarted'
});

App.AljsController = Ember.ObjectController.extend({
    init: function() {
        this._super();
    } 
});

App.AljsRoute = Ember.Route.extend({
    model: function (){
        return {
            sections: [
                {
                    path: 'gettingStarted',
                    name: 'Getting Started'
                },
                {
                    path: 'datepickers',
                    name: 'Datepickers'
                },
                {
                    path: 'lookups',
                    name: 'Lookups'
                },
                {
                    path: 'modals',
                    name: 'Modals'
                },
                {
                    path: 'notifications',
                    name: 'Notifications'
                },
                {
                    path: 'picklists',
                    name: 'Picklists'
                },
                {
                    path: 'pills',
                    name: 'Pills'
                },
                {
                    path: 'popovers',
                    name: 'Popovers'
                },
                {
                    path: 'tabs',
                    name: 'Tabs'
                },
                {
                    path: 'tooltips',
                    name: 'Tooltips'
                },
            ]
        };
    },
    setupController: function(controller, model) {
        var selectedSection = App.getCookie('aljs_selected_lib');
        var selectedSectionIsValid = !Ember.isEmpty(selectedSection) && (selectedSection === 'jQuery' || selectedSection === 'ember');
        controller.set('model', model);
        controller.set('selectedSection', selectedSectionIsValid ? selectedSection : 'jQuery');
    },
    actions: {
        // clickSection: function(section) {
        //     this.controllerFor('aljs').set('selectedSection', section);
        // },
        didTransition: function() {
            $(window).scrollTop(0,0);
        }
    }
});

// Router
App.Router.map(function() {
    this.resource('aljs', { path: '/' }, function() {
        this.resource('home', { path: '/' });
    	this.resource('gettingStarted');
    	this.resource('modals');
    	this.resource('picklists');
    	this.resource('tooltips');
    	this.resource('popovers');
    	this.resource('datepickers');
        this.resource('tabs');
        this.resource('notifications');
        this.resource('lookups');
        this.resource('pills');
    });
});


// // This setting disables the detail routing from showing up in the navbar.
App.Router.reopen( {
    location: 'hashbang'
});

