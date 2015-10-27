if (typeof _AljsApp === 'undefined') { throw new Error("Please include ember.aljs-init.js in your compiled Ember Application"); }

_AljsApp.AljsButtonComponent = Ember.Component.extend({
    layoutName: 'components/aljs-button',
    tagName: 'button',
    classNames: 'slds-button',
    classNameBindings: 'selectedState',
    selectedState: function() {
        var selectedWhen = this.get('selectedWhen');

        if (!Ember.isEmpty(selectedWhen)) {
            return selectedWhen ? 'slds-is-selected' : 'slds-not-selected';
        } else {
            return null;
        }
    }.property('selectedWhen'),
    disabled: function() {
        return this.get('disabledWhen') ? 'disabled' : false;
    }.property('disabledWhen'),
    'data-qa-button' : function() {
        var locatorName = this.get('locator') || this.get('action');

        if (Ember.isEmpty(locatorName)) {
            if (!Ember.isEmpty(this.get('data-close-modal'))) {
                locatorName = 'close modal ' + this.get('data-close-modal');
            } else if (!Ember.isEmpty(this.get('data-open-modal'))) {
                locatorName = 'open modal ' + this.get('data-open-modal');
            } else {
                locatorName = 'button'
            }
        }

        return locatorName.camelize();
    }.property(),
    hasIcons: function() {
        return !Ember.isEmpty(this.get('iconLeft')) || !Ember.isEmpty(this.get('iconRight'));
    }.property('iconLeft', 'iconRight'),
    iconUrl: function() {
        var iconLeft = this.get('iconLeft');
        var iconRight = this.get('iconRight');

        if (iconLeft) {
            return this.get('assetsLocation') + '/assets/icons/utility-sprite/svg/symbols.svg#' + iconLeft;
        } else if (iconRight) {
            return this.get('assetsLocation') + '/assets/icons/utility-sprite/svg/symbols.svg#' + iconRight;
        } else {
            return null;
        }
    }.property('iconLeft', 'iconRight'),
    click: function() {
        var paramNum = 1;
        var params = ['action'];

        while(!Ember.isEmpty(this.get('param' + paramNum))) {
            params.push(this.get('param' + paramNum));
            paramNum++;
        } 

        this.sendAction.apply(this, params);
    }
});