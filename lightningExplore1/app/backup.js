document.addEventListener("DOMContentLoaded", function() {
    Array.prototype.forEach.call(document.querySelectorAll('[sf-tooltip]'), function(el) { 
        el.setAttribute('sf-title', el.getAttribute('title'));
        el.setAttribute('title', ''); 
        el.style['position'] = 'relative';

        var getTooltipElement = function(target) {
            if (target === null) {
                return null;
            } else if (target.getAttribute('sf-tooltip') !== null) {
                return target;
            } else {
                getTooltipElement(target.parentElement);
            }
        };

        var showTooltip = function(e) {
            var nubbinHeight = 15;
            var nubbinWidth = 15;
            var target = getTooltipElement(e.target);
            var tooltipContent = target.getAttribute('sf-title');
            var tooltipPosition = target.getAttribute('sf-tooltip') || 'top';
            var tooltipNubbins = {
                top: 'bottom',
                bottom: 'top',
                left: 'right',
                right: 'left'
            };
            var tooltipPositioningCSS = 'overflow: visible;';

            var tooltipMarkup = '<div class="slds-tooltip slds-nubbin--' + (tooltipNubbins[tooltipPosition] || 'top') + '" role="tooltip" style="' + tooltipPositioningCSS +'">' +
                                    '<div class="slds-tooltip__content">' +
                                        '<div class="slds-tooltip__body">' +
                                        tooltipContent +
                                        '</div>' +
                                    '</div>' +
                                '</div>';

            if (target.querySelector('.slds-tooltip') === null) {
                target.insertAdjacentHTML('beforeend', tooltipMarkup);
                var tooltipNode = target.querySelector('.slds-tooltip');

                tooltipNode.style['width'] = tooltipNode.offsetWidth + 'px';
                tooltipNode.style['position'] = 'absolute';

                if (tooltipPosition === 'top' || tooltipPosition === 'bottom') {
                    tooltipNode.style[tooltipPosition] = '-' + (tooltipNode.offsetHeight + nubbinHeight) + 'px';
                    tooltipNode.style['left'] = (target.offsetWidth / 2) - (tooltipNode.offsetWidth / 2) + 'px'; 
                } else if (tooltipPosition === 'left' || tooltipPosition === 'right') {
                    tooltipNode.style['top'] = (target.offsetHeight / 2) - (tooltipNode.offsetHeight / 2) + 'px'; 
                    tooltipNode.style[tooltipPosition] = '-' + (tooltipNode.offsetWidth + nubbinWidth) + 'px';
                }
            } 
        };

        var hideTooltip = function(e) {
            var target = e.target.closest('[sf-tooltip]');
            var tooltipNode = target.querySelector('.slds-tooltip');

            if (tooltipNode !== null) {
                tooltipNode.remove();
            }
        };

        if (el.addEventListener) {
            el.addEventListener('mouseenter', showTooltip);
            el.addEventListener('focusin', showTooltip);
            el.addEventListener('mouseleave', hideTooltip);
            el.addEventListener('focusout', hideTooltip);
        } else {
            el.attachEvent('mouseenter', showTooltip);
            el.attachEvent('focusin', showTooltip);
            el.attachEvent('mouseleave', hideTooltip);
            el.attachEvent('focusout', hideTooltip);
        }
        
    });
});