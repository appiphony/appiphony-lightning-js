if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {
    var nubbinHeight = 15;
    var nubbinWidth = 15;

    var showTooltip = function(e) {
        var $target = $(e.target).closest('[data-aljs="tooltip"]');
        
        if (!$target.attr('data-aljs-title')) {
            $target.attr('data-aljs-title', $target.attr('title'));
            $target.attr('title', ''); 
            //$target.css('position', 'relative');
        }
        var lineHeightFix = ($target.parent().hasClass('slds-button')) ? ' style="line-height: normal;"' : ''; // Adjust line height if tooltip is inside a button
        var tooltipId = $target.attr('data-aljs-id') || 'aljs-' + (new Date()).valueOf();
        var tooltipContent = $target.attr('data-aljs-title');
        var tooltipPosition = $target.attr('data-aljs-placement') || 'top';
        var tooltipNubbins = {
            top: 'bottom',
            bottom: 'top',
            left: 'right',
            right: 'left'
        };
        var tooltipPositioningCSS = 'overflow: visible; display: inline-block; position: absolute; z-index:9999;';
        
        var tooltipMarkup = '<div id="' + tooltipId + '" aria-describedby="' + tooltipId + '" class="slds-tooltip slds-nubbin--' + (tooltipNubbins[tooltipPosition] || 'top') + '" role="tooltip" style="' + tooltipPositioningCSS +'">' +
                                '<div class="slds-tooltip__content">' +
                                    '<div class="slds-tooltip__body"' + lineHeightFix + '>' +
                                    tooltipContent +
                                    '</div>' +
                                '</div>' +
                            '</div>';
        
        if ($target.next('.slds-tooltip').length === 0) {
            var $tooltipNode = $(tooltipMarkup).appendTo('.slds');
            var actualWidth  = $tooltipNode[0].offsetWidth;
            var actualHeight = $tooltipNode[0].offsetHeight;// + 15;

            var targetPos = getPosition($target)
            var calculatedOffset = getCalculatedOffset(tooltipPosition, targetPos, actualWidth, actualHeight);
            applyPlacement(calculatedOffset, tooltipPosition, actualWidth, actualHeight, $tooltipNode);
        } 
    };

    var applyPlacement = function (offset, placement, actualWidth, actualHeight, tooltip) {
        var delta = getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

        if (delta.left) {
            offset.left += delta.left;
        } else {
            offset.top += delta.top;
        }

        tooltip.offset(offset);
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
        $element   = $element || this.$element;

        var el     = $element[0];
        var isBody = el.tagName == 'BODY';

        var elRect    = el.getBoundingClientRect();
        if (elRect.width == null) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top });
        }
        var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset();
        var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() };
        var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null;

        return $.extend({}, elRect, scroll, outerDims, elOffset);
    }


    var getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
        var delta = { top: 0, left: 0 };
        var viewportDimensions = getPosition($('.slds'));

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
    
    var hideTooltip = function(e) {
        var $tooltipNode = $('body').find('.slds-tooltip');
        
        if ($tooltipNode.length > 0) {
            $tooltipNode.remove();
        }
    };
    
    $.fn.tooltip = function(options) {
        var settings = $.extend({
            assetsLocation: $.aljs.assetsLocation
            // These are the defaults
            
        }, options );
        
        if (settings.selector && this.length === 1) {
            return this.on('mouseenter', settings.selector, showTooltip)
                .on('focusin', settings.selector, showTooltip)
                .on('mouseleave', settings.selector, hideTooltip)
                .on('blur', settings.selector, hideTooltip)
                .on('touchstart', settings.selector, function(e) {
                    e.stopPropagation();
                
                    if ($('.slds-tooltip').length == 0) {
                        showTooltip();
                    } else {
                        hideTooltip();
                    }
                });
        } else {
            return this.each(function() {
                $(this).on('mouseenter', showTooltip)
                       .on('focusin', showTooltip)
                       .on('mouseleave', hideTooltip)
                       .on('blur', hideTooltip)
                       .on('touchstart', function(e) {
                            e.stopPropagation();
                    
                            if ($('.slds-tooltip').length == 0) {
                                showTooltip();
                            } else {
                                hideTooltip();
                            }
                        });
            });
        }
        
        $('body').on('touchstart', hideTooltip);
    };
}(jQuery));