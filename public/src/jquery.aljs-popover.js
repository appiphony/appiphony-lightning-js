if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {
    var nubbinHeight = 15;
    var nubbinWidth = 15;

    var showPopover = function(e) {
        var settings = e.data;
        var $target = $(e.target).is($(settings.selector)) ? $(e.target) : $(e.target).closest(settings.selector || '[data-aljs="popover"]');
        console.log(settings.selector);

        var isMarkup = ($target.attr('data-aljs-show')) ? true : false;
        
        if (!$target.attr('data-aljs-title')) {
            $target.attr('data-aljs-title', $target.attr('title'));
            $target.attr('title', ''); 
            //$target.css('position', 'relative');
        }
        var lineHeightFix = ($target.parent().hasClass('slds-button')) ? ' style="line-height: normal;"' : ''; // Adjust line height if popover is inside a button
        var popoverId = $target.attr('data-aljs-id') || 'aljs-' + (new Date()).valueOf();
        var popoverContent = (!isMarkup) ? $target.data('aljs-title') : $('#' + $target.data('aljs-show')).html();
        var popoverPosition = $target.attr('data-aljs-placement') || 'top';
        var popoverNubbins = {
            top: 'bottom',
            bottom: 'top',
            left: 'right',
            right: 'left'
        };
        var popoverPositioningCSS = 'overflow: visible; display: inline-block; position: absolute;';
        var modifier = (settings.modifier != '') ? ' slds-popover--' + settings.modifier : '';
        var theme = (settings.theme != '') ? ' slds-theme--' + settings.theme : '';
        
        var popoverMarkup = '<div id="' + popoverId + '" aria-describedby="' + popoverId + '" class="slds-popover' + modifier + theme + ' slds-nubbin--' + (popoverNubbins[popoverPosition] || 'top') + '" style="' + popoverPositioningCSS +'">' +
                                '<div class="slds-popover__body"' + lineHeightFix + '>' +
                                popoverContent +
                                '</div>' +
                            '</div>';
        
        if ($target.next('.slds-popover').length === 0) {
            var $popoverNode = ($.aljs.scoped) ? $(popoverMarkup).appendTo('.slds') : $(popoverMarkup).appendTo('body');
            
            var actualWidth  = $popoverNode[0].offsetWidth;
            var actualHeight = $popoverNode[0].offsetHeight;// + 15;

            var targetPos = getPosition($target)
            var calculatedOffset = getCalculatedOffset(popoverPosition, targetPos, actualWidth, actualHeight);
            applyPlacement(calculatedOffset, popoverPosition, actualWidth, actualHeight, $popoverNode);
        } 
    };

    var applyPlacement = function (offset, placement, actualWidth, actualHeight, popover) {
        var delta = getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

        if (delta.left) {
            offset.left += delta.left;
        } else {
            offset.top += delta.top;
        }

        popover.offset(offset);
    }


    var getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
        var posObj = {}

        switch(placement) {
            case 'bottom':
                posObj = { top: pos.top + pos.height + nubbinHeight,   left: pos.left + pos.width / 2 - actualWidth / 2 };
                break;
            case 'top':
                posObj = { top: pos.top - actualHeight - nubbinHeight, left: pos.left + pos.width / 2 - actualWidth / 2 };
                break;
            case 'left':
                posObj = { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - nubbinWidth};
                break;
            default: //right
                posObj = { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + nubbinWidth};
        }

        return posObj;
    }

    var getPosition = function ($element) {
        $element = $element || this.$element;

        var el = $element[0];
        var isBody = el.tagName == 'BODY';

        var elRect = el.getBoundingClientRect();
        if (elRect.width == null) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top });
        }
        var elOffset = isBody ? { top: 0, left: 0 } : $element.offset();
        var scroll = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() };
        var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null;

        return $.extend({}, elRect, scroll, outerDims, elOffset);
    }


    var getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
        var delta = { top: 0, left: 0 };
        var viewportDimensions = getPosition($('body'));

        if (/right|left/.test(placement)) {
          var topEdgeOffset    = pos.top - viewportDimensions.scroll;
          var bottomEdgeOffset = pos.top - viewportDimensions.scroll + actualHeight;
          if (topEdgeOffset < viewportDimensions.top) { // top overflow
            delta.top = viewportDimensions.top - topEdgeOffset;
          } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
            delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
          }
        } else {
          var leftEdgeOffset  = pos.left;
          var rightEdgeOffset = pos.left + actualWidth;
          if (leftEdgeOffset < viewportDimensions.left) { // left overflow
            delta.left = viewportDimensions.left - leftEdgeOffset;
          } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
            delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
          }
        }

        return delta;
    }
    
    var hidePopover = function(e) {
        var $popoverNode = $('body').find('.slds-popover');
        
        if ($popoverNode.length > 0) {
            $popoverNode.remove();
        }
    };
    
    $.fn.popover = function(options) {
        var settings = $.extend({
            assetsLocation: $.aljs.assetsLocation,
            modifier: '',
            theme: ''
            // These are the defaults
        }, options );
        
        this.each(function() {
            $('#' + $(this).data('aljs-show')).addClass('slds-hide'); // Hide custom popover markup on init
        });
        
        if (settings.selector && this.length === 1) {
            return this.on('mouseenter', settings.selector, settings, showPopover)
                .on('focusin', settings.selector, settings, showPopover)
                .on('mouseleave', settings.selector, settings, hidePopover)
                .on('blur', settings.selector, settings, hidePopover)
                .on('touchstart', settings.selector, settings, function(e) {
                    e.stopPropagation();
                    var selector = (settings.modifier == 'tooltip') ? '.slds-popover--tooltip' : '.slds-popover';
                
                    if ($(selector).length == 0) {
                        showPopover();
                    } else {
                        hidePopover();
                    }
                });
        } else {
            return this.each(function() {
                var thisSettings = JSON.parse(JSON.stringify(settings));
                thisSettings.selector = this;
                $(this).on('mouseenter', thisSettings, showPopover)
                       .on('focusin', thisSettings, showPopover)
                       .on('mouseleave', thisSettings, hidePopover)
                       .on('blur', thisSettings, hidePopover)
                       .on('touchstart', thisSettings, function(e) {
                            e.stopPropagation();
                            var selector = (thisSettings.modifier == 'tooltip') ? '.slds-popover--tooltip' : '.slds-popover';
                    
                            if ($(selector).length == 0) {
                                showPopover();
                            } else {
                                hidePopover();
                            }
                        });
            });
        }
        
        $('body').on('touchstart', hidePopover);
    };
}(jQuery));