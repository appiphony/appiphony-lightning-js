var localeString = 'MM/DD/YYYY';

// Kick off Ember
App = Ember.Application.create({
    rootElement: '#application'
});

Ember.Object.reopen({
    assetsLocation: assetsLocation
});

Ember.Component.reopen({
    attributeBindings: ['data-qa-button', 'data-open-modal', 'data-close-modal', 
                        'data-open-popover', 'data-close-popover', 'data-toggle-popover',
                        'disabled', 'title', 'data-aljs', 'data-placement', 'aljs-title']
});

_AljsApp = App;

App.ExploreView = Ember.View.extend({
    didInsertElement: function() {
        $('#modal1').on('opened', function() {
            console.log('modal 1 opened');
        });

        $('#modal2').on('closed', function() {
            console.log('modal 2 closed');
        });
    }
});

App.ExploreController = Ember.ObjectController.extend({
    getAccounts: function(callback) {
        callback([
            {
                id: 1,
                label: 'ajaxAccount 1'
            },
            {
                id: 2,
                label: 'ajaxAccount 2'
            }
        ]);
    },
    accounts: [
        {
            id: 1,
            label: 'Account 1'
        },
        {
            id: 2,
            label: 'Account 2'
        }
    ],
    opportunities: [
        {
            id: 1,
            label: 'Opportunity 1'
        },
        {
            id: 2,
            label: 'Opportunity 2'
        }
    ],
    tabs: [
        {
            label: 'Tab 1',
            partial: 'tabOne'
        },
        {
            label: 'Tab 2',
            partial: 'tabTwo'
        }
    ],
    selectedDate: function() {
        return moment().add(5, 'days');
    }.property(),
    selectedPicklistThing: 1,
    picklistThings: [
        {
            value: 1,
            label: 'One'
        },
        {
            value: 2,
            label: 'Two'
        }
    ],
    picklistSimplerThings: ['Four', 'Five'],
    things: [
        Ember.Object.create({
            id: '1',
            name: 'one',
            iconUrl: assetsLocation + '/assets/icons/utility-sprite/svg/symbols.svg#download',
            isSelected: true
        }),
        Ember.Object.create({
            id: '2',
            name: 'two',
            iconUrl: assetsLocation + '/assets/icons/utility-sprite/svg/symbols.svg#apps',
            isSelected: false
        })
    ],
    actions: {
        doThis: function(id, name, thing) {
            console.log('this');
            console.log(id);
            console.log(name);
            //var thing = this.get('things').findBy('id', id);

            thing.toggleProperty('isSelected');
            this.get('things').rejectBy('id', id)[0].toggleProperty('isDisabled');
        },
        doThat: function(id, name, thing) {
            console.log('that');
            thing.toggleProperty('isSelected');
            this.get('things').rejectBy('id', id)[0].toggleProperty('isDisabled');
        },
        sayHi: function(param1, param2) {
            console.log('hi, this function was called by the component');
            console.log(param1);
            console.log(param2);
        },
        sayBye: function() {
            console.log('NOT!');
        }
    }
});

App.ExploreRoute = Ember.Route.extend({
    model: function (){
        return {};
    }
});

// Router
App.Router.map(function() {
    this.resource('explore', { path: '/' });
});


// // This setting disables the detail routing from showing up in the navbar.
App.Router.reopen( {
    location: 'none'
});

