(function() {
    var showTooltip = function(e) {
        var target = $(e.target).closest('[sf-tooltip]')[0];

        if (!target.getAttribute('sf-title')) {
            target.setAttribute('sf-title', target.getAttribute('title'));
            target.setAttribute('title', ''); 
            target.style['position'] = 'relative';
        }
        var targetId = target.getAttribute('sljt-id') || 'sljt-' + (new Date()).valueOf();
        var nubbinHeight = 15;
        var nubbinWidth = 15;
        var tooltipContent = target.getAttribute('sf-title');
        var tooltipPosition = target.getAttribute('sf-tooltip') || 'top';
        var tooltipNubbins = {
            top: 'bottom',
            bottom: 'top',
            left: 'right',
            right: 'left'
        };
        var tooltipPositioningCSS = 'overflow: visible;';

        var tooltipMarkup = '<div id="' + toolkitId + '" aria-describedby="' + toolkitId + '" class="slds-tooltip slds-nubbin--' + (tooltipNubbins[tooltipPosition] || 'top') + '" role="tooltip" style="' + tooltipPositioningCSS +'">' +
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

    $('body').on('mouseenter', '[sf-tooltip]', showTooltip);
    $('body').on('focusin', '[sf-tooltip]', showTooltip);
    $('body').on('mouseleave', '[sf-tooltip]', hideTooltip);
    $('body').on('focusout', '[sf-tooltip]', hideTooltip);
}());
