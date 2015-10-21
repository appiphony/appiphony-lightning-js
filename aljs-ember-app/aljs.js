// Kick off Ember
App = Ember.Application.create({
    rootElement: '#app'
});

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

App.AljsPreContainerComponent = Ember.Component.extend({
    layoutName: 'components/aljs-pre-container',
    classNames: 'aljs-pre-container',
    didInsertElement: function() {
        var $this = this.$();
        var markup = $this.find('[data-aljs="yield"]').remove().html().trim()
                            .replace(/<\/{0,1}([^\/highlight].*)>/g, '&lt;$1&gt;')
                            .replace(/<highlight>/g, '<span class="highlight">')
                            .replace(/<\/highlight>/g, '<\/span>');
        $this.find('pre:first').append(markup);
    }
});

App.PicklistsController = Ember.ObjectController.extend(App.SelectedSectionMixin, {
    routeName: 'picklists'
});

App.TooltipsController = Ember.ObjectController.extend(App.SelectedSectionMixin, {
    routeName: 'tooltips'
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
                    path: 'modals',
                    name: 'Modals'
                },
                {
                    path: 'picklists',
                    name: 'Picklists'
                },
                {
                    path: 'tooltips',
                    name: 'Tooltips'
                },
                {
                    path: 'popovers',
                    name: 'Popovers'
                },
                {
                    path: 'datepickers',
                    name: 'Datepickers'
                }
            ]
        };
    },
    setupController: function(controller, model) {
        controller.set('model', model);
        controller.set('selectedSection', 'jQuery');
    },
    actions: {
        clickSection: function(section) {
            this.controllerFor('aljs').set('selectedSection', section);
        },
        didTransition: function() {
            $(window).scrollTop(0,0);
        }
    }
});

// Router
App.Router.map(function() {
    this.resource('aljs', { path: '/' }, function() {
        this.resource('home', { path: '/' });
    	this.resource('modals');
    	this.resource('picklists');
    	this.resource('tooltips');
    	this.resource('popovers');
    	this.resource('datepickers');
    });
});


// // This setting disables the detail routing from showing up in the navbar.
App.Router.reopen( {
    location: 'none'
});

