if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {    
    $.fn.pill = function(options) {
        var settings = $.extend({
            assetsLocation: $.aljs.assetsLocation
            // These are the defaults
        }, options );
        
        if (this.length === 1) {
            return this.on('click', '[data-aljs-dismiss="pill"]', function(e) {
                var $pill = $(this).closest('.slds-pill');
                
                if ($pill.length > 0) {
                    $pill.trigger('dismissed.aljs.pill'); // Custom aljs event
                    $pill.remove();
                }
            });
        } else {
            throw new Error("This plugin can only be run with a selector targeting one container (e.g., 'body')")
        }
    };
}(jQuery));