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
        var mobileNavLink = $('[href="#navigation"]'),
            navLink = $('.aljs-home-link, #navigation a'),
            nav = $('#navigation'),
            toggleDropdown = $('.aljs-toggle-dropdown'),
            hasDropdown = $('.aljs-has-nav-dropdown'),
            dropdown = $('.aljs-nav-dropdown'),
            dropdownLink = $('.aljs-nav-dropdown > li a'),
            notification = $('.js-notification'),
            documentBody = $('body');
        
        if ($('li.slds-is-active', dropdown).length > 0) {
            $('li.slds-is-active', dropdown).parent()
                .removeClass('slds-hide')
                .closest('li')
                .addClass('selected');
        }
        
        notification.removeClass('show');

        setTimeout(function() {
            notification.addClass('show');
        }, 1000);

        $('body').on('click', '.js-notification .js-close-button', function() {
            $('.js-notification').removeClass('show');
        });

        mobileNavLink.click(function(e) {
            e.preventDefault();

            $('html, body').animate({
                scrollTop: (nav.offset().top - nav.height()) + 'px'
            }, 1000);
        });
        
        documentBody.on('click', 'a[href="#"]', function(e) {
            e.preventDefault();
            return false;
        });
        
        documentBody.on('click', 'a[href^="#"].scroll', function(e) {
            e.preventDefault;
            
            $('html, body').animate({
                scrollTop: $($(this).attr('href')).offset().top
            }, 1000);
            
            return false;
        });
        
        toggleDropdown.click(function() {
            $(this).parent()
                .find('.aljs-nav-dropdown')
                .toggleClass('slds-hide');
        });
        
        navLink.click(function() {
            if (!$(this).is(toggleDropdown)) {
                hasDropdown.removeClass('selected');

                $(this).closest('.aljs-has-nav-dropdown')
                    .addClass('selected');
            }
        });
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

/*App.TooltipsController = Ember.ObjectController.extend(App.SelectedSectionMixin, {
    routeName: 'tooltips'
});*/

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

App.IconGroupController = Ember.ObjectController.extend(App.SelectedSectionMixin, {
    routeName: 'iconGroups'
});

App.NotificationsController = Ember.ObjectController.extend(App.SelectedSectionMixin, {
    routeName: 'notifications'
});

App.MultiSelectsController = Ember.ObjectController.extend(App.SelectedSectionMixin, {
    routeName: 'multiSelects'
});

App.GettingStartedController = Ember.ObjectController.extend(App.SelectedSectionMixin, {
    routeName: 'gettingStarted'
});

App.ChangelogController = Ember.ObjectController.extend(App.SelectedSectionMixin, {
    routeName: 'changelog'
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
                    isDropdown: true,
                    name: 'Plugins',
                    subSections: [
                        {
                            path: 'datepickers',
                            name: 'Datepickers'
                        },
                        {
                            path: 'iconGroups',
                            name: 'Icon Groups'
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
                            path: 'multiSelects',
                            name: 'Multi Selects'
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
                            name: 'Popovers/Tooltips'
                        },
                        {
                            path: 'tabs',
                            name: 'Tabs'
                        },
                        /*{
                            path: 'tooltips',
                            name: 'Tooltips'
                        },*/
                    ]
                },
                {
                    path: 'changelog',
                    name: 'Changelog'
                },
                {
                    externalPath: 'https://github.com/appiphony/appiphony-lightning-js/issues',
                    name: 'Feedback'
                }
            ]
        };
    },
    setupController: function(controller, model) {
        var selectedSection = App.getCookie('aljs_selected_lib');
        var selectedSectionIsValid = !Ember.isEmpty(selectedSection) && (selectedSection === 'jQuery'/* || selectedSection === 'ember'*/);
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
    	/*this.resource('tooltips');*/
    	this.resource('popovers');
    	this.resource('datepickers');
        this.resource('tabs');
        this.resource('notifications');
        this.resource('iconGroups');
        this.resource('changelog');
        this.resource('lookups');
        this.resource('pills');
        this.resource('multiSelects');
    });
});


// // This setting disables the detail routing from showing up in the navbar.
App.Router.reopen( {
    location: 'hashbang'
});

