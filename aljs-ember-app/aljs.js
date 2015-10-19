// Kick off Ember
App = Ember.Application.create({
    rootElement: '#app'
});


App.AljsController = Ember.ObjectController.extend({
    
});

App.AljsRoute = Ember.Route.extend({
    model: function (){
        return {

        };
    }
});

// Router
App.Router.map(function() {
    this.resource('aljs', { path: '/' });
});


// // This setting disables the detail routing from showing up in the navbar.
App.Router.reopen( {
    location: 'none'
});

