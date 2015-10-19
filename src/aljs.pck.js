(function() {

Ember.TEMPLATES["aljs"] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  data.buffer.push("<div class=\"scope-container\">\n    \n</div>");
  },"useData":true});
Ember.TEMPLATES["aljs2"] = Ember.Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  data.buffer.push("<div class=\"scope-container\">\n    \n</div>");
  },"useData":true});

})();

(function() {

// Kick off Ember
App = Ember.Application.create({
    rootElement: '#application'
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



})();