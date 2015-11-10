if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {
    var dismissPopover = function($popover) {
        $popover.removeAttr('style')
                .trigger('dismissed.aljs.popover') // Custom aljs event
                .unwrap()
                .remove();
    };
    
    var togglePopover = function(e) {
        var $target = $(e.target);
        var $popover = $('#' + $target.data('aljs-show'));
        var options = e.data.options;
        var trigger = e.type;
        var wrapperDisplay = options.wrapperDisplay;
        
        if ($popover.length > 0 && trigger !== 'focus') {
            dismissPopover($popover);
        } else if ($popover.length === 0) {
            var otherPopovers = $('.slds-popover').not(e.data.popoverElement);
            var popoverElement = e.data.popoverElement;
            
            var nubbinHeight = 15;
            var nubbinWidth = 15;
            var placement = $target.attr('data-aljs-placement') || 'top';
            
            // Kill other popovers
            if (options.useClick && options.dismissOthers) {
                otherPopovers.each(function() {
                    if (!($(this).hasClass('slds-hide'))) {
                        dismissPopover($(this));
                    }
                });
            }
            
            // Background dismiss
            if (options.useClick && options.backgroundDismiss) {
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
            
            $target.wrap('<span style="position: relative; display: ' + wrapperDisplay + ';"></span>');
            $popover.on('click', options.dismissSelector, function(e) {
                dismissPopover($popover);
            });
            $popover.trigger('shown.aljs.popover') // Custom aljs event
                .appendTo($target.parent());
            
            // Focus out
            if (!options.useClick) {
                if (trigger == 'focus') {
                    $target.focus();
                    
                     $target.one('blur', function() {
                        dismissPopover($popover);
                    });
                }
            }
        }   
    };
    
    $.fn.popover = function(options) {
        var settings = $.extend({
            assetsLocation: $.aljs.assetsLocation,
            useClick: false,
            dismissOthers: true,
            backgroundDismiss: false,
            wrapperDisplay: 'inline-block',
            dismissSelector: '[data-aljs-dismiss="popover"]'
            // These are the defaults.
            
        }, options);
        
        // Background dismiss
        if (settings.useClick && settings.backgroundDismiss) {
            $('body').click(function() {
                $('.slds-popover').each(function() {
                    dismissPopover($(this));
                });
            });
        }
        
        return this.each(function() {
            var $el = $(this);
            var $popover = $('#' + $el.data('aljs-show')).remove()
                .removeClass('slds-hide');
            
            if (settings.useClick) {
                $el.on('click', { popoverElement: $popover, options: settings }, togglePopover);
            } else {
                $el.on('mouseenter', { popoverElement: $popover, options: settings }, togglePopover);
                $el.on('mouseleave', { popoverElement: $popover, options: settings }, togglePopover);
                $el.on('focus', { popoverElement: $popover, options: settings }, togglePopover);
            }
        });
    };
}(jQuery));