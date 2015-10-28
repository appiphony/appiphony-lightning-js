if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {

    var togglePopover = function(e) {
        var $target = $(e.target);
        var $popover = $target.parent().find(e.data.popoverElement);
        var options = e.data.options;

        if($popover.length > 0) {
            $popover.unwrap();
            $popover.remove();
        } else {
            var otherPopovers = $('.slds-popover').not(e.data.popoverElement);
            var popoverElement = e.data.popoverElement;
            
            var nubbinHeight = 15;
            var nubbinWidth = 15;
            var placement = $target.attr('data-placement') || 'top';
            
            // kill other popovers
            if (options.dismissOthers) {
                otherPopovers.each(function() {
                    if (!($(this).hasClass('slds-hide'))) {
                        $(this).unwrap();
                        $(this).remove();
                    }
                });
            }
            // background dismiss
            if (options.backgroundDismiss) {
                e.stopPropagation();
            }
            
            $target.after(popoverElement);
            
            $popover = $target.parent().find(e.data.popoverElement);
            
            $popover.css('width', $popover.innerWidth() + 'px');
            $popover.css('position', 'absolute');
            
            if (placement === 'top' || placement === 'bottom') {
                $popover.css('left', ($target.innerWidth() / 2) - ($popover.innerWidth() / 2) + 'px'); 
                $popover.css(placement, '-' + ($popover.innerHeight() + nubbinHeight) + 'px');
            } else if (placement === 'left' || placement === 'right') {
                $popover.css('top', ($target.outerHeight() / 2) - ($popover.outerHeight() / 2) + 'px'); 
                $popover.css(placement, '-' + ($popover.innerWidth() + nubbinWidth) + 'px');
            } 

            $target.wrap('<span style="position: relative; display: inline-block;"></span>');
            $popover.on('click', options.dismissSelector, function(e) {
                $popover.unwrap();
                $popover.remove();
            });
            $popover.appendTo($target.parent());
        }   
    };
    
    $.fn.popover = function(options) {
        var settings = $.extend({
            assetsLocation: $.aljs.assetsLocation,
            dismissOthers: true,
            backgroundDismiss: false,
            dismissSelector: '[data-aljs-dismiss="popover"]'
            // These are the defaults.
            
        }, options );
        
        // background dismiss
        console.log(settings.backgroundDismiss);
        if (settings.backgroundDismiss) {
            $('body').click(function() {
                $('.slds-popover').each(function() {
                    if (!($(this).hasClass('slds-hide'))) {
                        $(this).unwrap();
                        $(this).remove();
                    } 
                });
            });
        }
        
        return this.each(function() {
            var $el = $(this);
            var $popover = $el.next('.slds-popover').remove();
            
            $el.on('click', { popoverElement: $popover, options: settings }, togglePopover);
        });
    };
}(jQuery));