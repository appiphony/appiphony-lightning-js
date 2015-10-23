if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {    
    $.fn.notification = function(options) {
        var settings = $.extend({
            assetsLocation: $.aljs.assetsLocation
            // These are the defaults.
            
        }, options );
        
        if (this.length === 1) {
            return this.on('click', '[data-aljs-dismiss="notification"]', function(e) {
                var $notification = $(this).closest('.slds-notify');

                if ($notification.length > 0) {
                    $notification.trigger('dismiss.aljs.notification');
                    $notification.remove();
                }
            });
        } else {
            throw new Error("This plugin can only be run with a selector")
        }
    };
}(jQuery));