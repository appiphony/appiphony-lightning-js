if (typeof jQuery === "undefined") { throw new Error("The Salesforce Lightning JavaScript Toolkit requires jQuery") }

(function($) {
 
    $.fn.popup = function(options) {
    
        var settings = $.extend({
            // These are the defaults.
            
        }, options );

        return this.each(function() {
            // Do something to each element here.
        });
    };
 
}(jQuery));