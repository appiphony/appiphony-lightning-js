if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {    
    $.fn.notification = function(options) {
        var settings = $.extend({
            assetsLocation: $.aljs.assetsLocation
            // These are the defaults.
            
        }, options );
        
        if (this.length === 1 && typeof options !== 'string') {
            return this.on('click', '[data-aljs-dismiss="notification"]', function(e) {
                var $notification = $(this).closest('.slds-notify');

                if ($notification.length > 0) {
                    $notification.trigger('dismiss.aljs.notification');
                    $notification.addClass('slds-hide');
                }
            });
        } else if (typeof options === 'string') {
            return this.each(function() {
                var $node = $(this);

                if (!($node.hasClass('slds-notify'))) {
                    throw new Error("This method can only be run on a notification with the slds-notify class on it");
                } else {
                    if (options === 'show' || (options === 'toggle' && $node.hasClass('slds-hide'))) {
                        $node.removeClass('slds-hide');
                        $notification.trigger('dismiss.aljs.notification');
                    } else if (options === 'hide' || (options === 'toggle' && !($node.hasClass('slds-hide')))) {
                        $node.addClass('slds-hide');
                        $notification.trigger('show.aljs.notification');
                    }
                }
            }); 
        } else {
            throw new Error("This plugin can only be run with a selector, or with a command")
        }
    };
}(jQuery));