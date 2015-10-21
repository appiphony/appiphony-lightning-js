(function() {

Ember.TEMPLATES["aljs"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("<img src=\"images/aljs-icon.svg\" class=\"aljs-icon\"> Appiphony Lightning JS");
  }

function program3(depth0,data) {
  
  var buffer = '', stack1, helper, options;
  data.buffer.push("\n            <li class=\"slds-list__item slds-has-divider\">");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "section.path", options) : helperMissing.call(depth0, "link-to", "section.path", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</li>\n        ");
  return buffer;
  }
function program4(depth0,data) {
  
  var stack1;
  stack1 = helpers._triageMustache.call(depth0, "section.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
  }

  data.buffer.push("<header class=\"site-banner\" role=\"banner\">");
  stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
    'class': ("home-link")
  },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "home", options) : helperMissing.call(depth0, "link-to", "home", options));
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n</header>\n<main class=\"site-main\" role=\"main\">\n    <div class=\"site-content\">\n        ");
  stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </div>\n</main>\n<nav id=\"navigation\" class=\"site-navigation\" role=\"navigation\">\n    <ul class=\"slds-list--vertical slds-has-block-links\">\n        ");
  stack1 = helpers.each.call(depth0, "section", "in", "sections", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n    </ul>\n</nav>\n<footer class=\"site-contentinfo slds-wrap site-text-longform slds-text-body--small\" role=\"contentinfo\">\n    <p class=\"slds-col--padded slds-p-right--large\">&copy; 2015 <a href=\"http://appiphony.com\" target=\"_blank\">Appiphony, LLC</a>. All rights reserved. The Salesforce Sans Font is used under license from Salesforce.com, Inc.</p>\n</footer>");
  return buffer;
  
});
Ember.TEMPLATES["datepickers"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("<header class=\"site-masthead slds-grid\">\n    <div class=\"site-masthead-title slds-col slds-has-flexi-truncate slds-align-middle\">\n        <div class=\"slds-media__body\">\n            <div class=\"slds-grid\">\n                <h1 title=\"Appiphony Lightning JS\" class=\"slds-p-left--large\">Datepickers</h1></div>\n        </div>\n    </div>\n</header>\n<div class=\"site-content slds-p-around--xx-large site-design site-design-layout\">\nTest\n</div>\n<div class=\"site-resources--landing slds-p-vertical--small\">\n    <ul class=\"slds-grid slds-wrap slds-grid--align-spread slds-grid--pull-padded-large\">\n        <li class=\"slds-col--padded-large slds-size--1-of-1 slds-large-size--1-of-2\">\n            <div class=\"grid-card\">\n                <div class=\"slds-grid slds-grid--align-spread\">\n                    <h3 class=\"site-text-heading--label-weak-large slds-align-middle\" id=\"downloads-header\">jQuery</h3></div>\n                <hr class=\"hr hr--pink\">\n                <p>Blah blah blah</p><a class=\"slds-button slds-button--neutral slds-m-top--large\" href=\"#\">Download</a></div>\n        </li>\n        <li class=\"slds-col--padded-large slds-size--1-of-1 slds-large-size--1-of-2\">\n            <div class=\"grid-card\">\n                <div class=\"slds-grid slds-grid--align-spread\">\n                    <h3 class=\"site-text-heading--label-weak-large slds-align-middle\" id=\"tutorials-header\">Ember (Coming Soon)</h3></div>\n                <hr class=\"hr hr--orange\">\n                <p>Blah blah blah</p>\n            </div>\n        </li>\n    </ul>\n</div>");
  
});
Ember.TEMPLATES["home"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("<header class=\"site-masthead slds-grid aljs-home-header\">\n    <div class=\"site-masthead-title slds-col slds-has-flexi-truncate slds-align-middle\">\n        <div class=\"slds-media__body slds-p-left--large aljs-header-container\">\n            <img src=\"images/aljs-logo.svg\" class=\"aljs-logo\">\n            <h2 class=\"slds-p-top--large slds-text-heading--medium\">Your JS solution for the Lightning Design System</h2>\n            <p class=\"slds-p-top--xx-large\"><a class=\"slds-button slds-button--inverse\" href=\"#\">Download Latest</a> <a class=\"slds-button slds-button--inverse\" href=\"#\">Fork on GitHub</a></p>\n            <p class=\"slds-p-top--x-small\"><strong>Current releast:</strong> 0.0.1</p>\n        </div>\n    </div>\n</header>\n<div class=\"site-content slds-p-around--xx-large site-design site-design-layout\">\n    <div class=\"slds-grid\">\n        <div class=\"slds-col slds-size--1-of-4\">\n            <h2 class=\"slds-text-heading--medium\">Available in Two Flavors</h2>\n            <p class=\"slds-p-top--medium\">Blah blah blah</p>\n        </div>\n        <div class=\"slds-col slds-size--3-of-4\">\n            <div class=\"site-resources--landing slds-p-vertical--xx-small\">\n                <ul class=\"slds-grid slds-wrap slds-grid--align-spread slds-grid--pull-padded-large\">\n                    <li class=\"slds-col--padded-large slds-size--1-of-1 slds-large-size--1-of-2\">\n                        <div class=\"grid-card\">\n                            <img src=\"images/jquery-logo.svg\" class=\"jquery-logo\">\n                            <hr class=\"hr hr--blue\">\n                            <p>jQuery is a fast, small, and feature-rich JavaScript library. With a combination of versatility and extensibility, jQuery has changed the way that millions of people write JavaScript.</p>\n                        </div>\n                    </li>\n                    <li class=\"slds-col--padded-large slds-size--1-of-1 slds-large-size--1-of-2\">\n                        <div class=\"grid-card\">\n                            <img src=\"images/ember-logo.svg\" class=\"ember-logo\">\n                            <hr class=\"hr hr--orange\">\n                            <p>Ember.js helps developers be more productive out of the box. Designed with developer ergonomics in mind, its friendly APIs help you get your job done—fast.</p>\n                        </div>\n                    </li>\n                </ul>\n            </div>\n        </div>\n    </div>\n</div>");
  
});
Ember.TEMPLATES["modals"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("<header class=\"site-masthead slds-grid\">\n    <div class=\"site-masthead-title slds-col slds-has-flexi-truncate slds-align-middle\">\n        <div class=\"slds-media__body\">\n            <div class=\"slds-grid\">\n                <h1 title=\"Appiphony Lightning JS\" class=\"slds-p-left--large\">Modals</h1></div>\n        </div>\n    </div>\n</header>\n<div class=\"site-content slds-p-around--xx-large site-design site-design-layout\">\nTest\n</div>\n<div class=\"site-resources--landing slds-p-vertical--small\">\n    <ul class=\"slds-grid slds-wrap slds-grid--align-spread slds-grid--pull-padded-large\">\n        <li class=\"slds-col--padded-large slds-size--1-of-1 slds-large-size--1-of-2\">\n            <div class=\"grid-card\">\n                <div class=\"slds-grid slds-grid--align-spread\">\n                    <h3 class=\"site-text-heading--label-weak-large slds-align-middle\" id=\"downloads-header\">jQuery</h3></div>\n                <hr class=\"hr hr--pink\">\n                <p>Blah blah blah</p><a class=\"slds-button slds-button--neutral slds-m-top--large\" href=\"#\">Download</a></div>\n        </li>\n        <li class=\"slds-col--padded-large slds-size--1-of-1 slds-large-size--1-of-2\">\n            <div class=\"grid-card\">\n                <div class=\"slds-grid slds-grid--align-spread\">\n                    <h3 class=\"site-text-heading--label-weak-large slds-align-middle\" id=\"tutorials-header\">Ember (Coming Soon)</h3></div>\n                <hr class=\"hr hr--orange\">\n                <p>Blah blah blah</p>\n            </div>\n        </li>\n    </ul>\n</div>");
  
});
Ember.TEMPLATES["picklists"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("<header class=\"site-masthead slds-grid\">\n    <div class=\"site-masthead-title slds-col slds-has-flexi-truncate slds-align-middle\">\n        <div class=\"slds-media__body\">\n            <div class=\"slds-grid\">\n                <h1 title=\"Appiphony Lightning JS\" class=\"slds-p-left--large\">Picklists</h1></div>\n        </div>\n    </div>\n</header>\n<div class=\"site-content slds-p-around--xx-large site-design site-design-layout\">\nTest\n</div>\n<div class=\"site-resources--landing slds-p-vertical--small\">\n    <ul class=\"slds-grid slds-wrap slds-grid--align-spread slds-grid--pull-padded-large\">\n        <li class=\"slds-col--padded-large slds-size--1-of-1 slds-large-size--1-of-2\">\n            <div class=\"grid-card\">\n                <div class=\"slds-grid slds-grid--align-spread\">\n                    <h3 class=\"site-text-heading--label-weak-large slds-align-middle\" id=\"downloads-header\">jQuery</h3>\n                </div>\n                <hr class=\"hr hr--pink\">\n                <iframe src=\"./demo-picklist-2.html\"></iframe>\n            </div>\n        </li>\n        <li class=\"slds-col--padded-large slds-size--1-of-1 slds-large-size--1-of-2\">\n            <div class=\"grid-card\">\n                <div class=\"slds-grid slds-grid--align-spread\">\n                    <h3 class=\"site-text-heading--label-weak-large slds-align-middle\" id=\"tutorials-header\">Ember (Coming Soon)</h3></div>\n                <hr class=\"hr hr--orange\">\n                <p>Blah blah blah</p>\n            </div>\n        </li>\n    </ul>\n</div>");
  
});
Ember.TEMPLATES["popovers"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("<header class=\"site-masthead slds-grid\">\n    <div class=\"site-masthead-title slds-col slds-has-flexi-truncate slds-align-middle\">\n        <div class=\"slds-media__body\">\n            <div class=\"slds-grid\">\n                <h1 title=\"Appiphony Lightning JS\" class=\"slds-p-left--large\">Popovers</h1></div>\n        </div>\n    </div>\n</header>\n<div class=\"site-content slds-p-around--xx-large site-design site-design-layout\">\nTest\n</div>\n<div class=\"site-resources--landing slds-p-vertical--small\">\n    <ul class=\"slds-grid slds-wrap slds-grid--align-spread slds-grid--pull-padded-large\">\n        <li class=\"slds-col--padded-large slds-size--1-of-1 slds-large-size--1-of-2\">\n            <div class=\"grid-card\">\n                <div class=\"slds-grid slds-grid--align-spread\">\n                    <h3 class=\"site-text-heading--label-weak-large slds-align-middle\" id=\"downloads-header\">jQuery</h3></div>\n                <hr class=\"hr hr--pink\">\n                <p>Blah blah blah</p><a class=\"slds-button slds-button--neutral slds-m-top--large\" href=\"#\">Download</a></div>\n        </li>\n        <li class=\"slds-col--padded-large slds-size--1-of-1 slds-large-size--1-of-2\">\n            <div class=\"grid-card\">\n                <div class=\"slds-grid slds-grid--align-spread\">\n                    <h3 class=\"site-text-heading--label-weak-large slds-align-middle\" id=\"tutorials-header\">Ember (Coming Soon)</h3></div>\n                <hr class=\"hr hr--orange\">\n                <p>Blah blah blah</p>\n            </div>\n        </li>\n    </ul>\n</div>");
  
});
Ember.TEMPLATES["tooltips"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data
/**/) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("<header class=\"site-masthead slds-grid\">\n    <div class=\"site-masthead-title slds-col slds-has-flexi-truncate slds-align-middle\">\n        <div class=\"slds-media__body\">\n            <div class=\"slds-grid\">\n                <h1 title=\"Appiphony Lightning JS\" class=\"slds-p-left--large\">Tooltips</h1></div>\n        </div>\n    </div>\n</header>\n<div class=\"site-content slds-p-around--xx-large site-design site-design-layout\">\nTest\n</div>\n<div class=\"site-resources--landing slds-p-vertical--small\">\n    <ul class=\"slds-grid slds-wrap slds-grid--align-spread slds-grid--pull-padded-large\">\n        <li class=\"slds-col--padded-large slds-size--1-of-1 slds-large-size--1-of-2\">\n            <div class=\"grid-card\">\n                <div class=\"slds-grid slds-grid--align-spread\">\n                    <h3 class=\"site-text-heading--label-weak-large slds-align-middle\" id=\"downloads-header\">jQuery</h3>\n                </div>\n                <hr class=\"hr hr--pink\">\n                <iframe src=\"./demo-tooltip-1.html\"></iframe>\n            </div>\n        </li>\n        <li class=\"slds-col--padded-large slds-size--1-of-1 slds-large-size--1-of-2\">\n            <div class=\"grid-card\">\n                <div class=\"slds-grid slds-grid--align-spread\">\n                    <h3 class=\"site-text-heading--label-weak-large slds-align-middle\" id=\"tutorials-header\">Ember (Coming Soon)</h3></div>\n                <hr class=\"hr hr--orange\">\n                <p>Blah blah blah</p>\n            </div>\n        </li>\n    </ul>\n</div>");
  
});

})();

(function() {

// Kick off Ember
App = Ember.Application.create({
    rootElement: '#app'
});

App.AljsView = Ember.View.extend({
    didInsertElement: function() {
        // insert jQuery code here
    }
});

App.AljsController = Ember.ObjectController.extend({
    
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



})();//@ sourceMappingURL=../../public/js/aljs.map