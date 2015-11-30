# Appiphony Lightning JS Beta

### Release 0.1.2 — November 30, 2015

#### jQuery
* **Lookups**: Lookups now properly populate when selecting a result on Safari/Firefox/IE 10 <a href="https://github.com/appiphony/appiphony-lightning-js/issues/9">(GitHub Issue #9)</a>
* **Lookups**: Updated single selected result markup to comply with 0.12.0 SLDS release
* **Lookups**: Added an onChange option to run when a user selects a result
* **Lookups**: Added an initialSelection option to set the selected result on load
* **Lookups**: Added a setSelection method to programmatically set the selected result
* **Lookups**: Added the option to remove icons on lookup results
* **Lookups**: Added support custom object icons
* **Modals**: Updated backdrop markup to comply with 0.12.0 SLDS release
* **Tabs**: Updated docs to comply with 0.12.0 SLDS release

#### Ember
* **Lookups**: Added support for a custom icon URL and class
* **Lookups**: Added support custom object icons
* **Lookups**: Updated single selected result markup to comply with 0.12.0 SLDS release
* **Lookups**: Added support to bind to a route's controller and fixed calling the search methods
* **Modals**: Updated backdrop markup to comply with 0.12.0 SLDS release
* **Modals**: Added a show method to the jQuery call
* **Tabs**: Updated template classes to comply with 0.12.0 SLDS release
* **Notifications**: Added support to customize classes that get applied to the slds-notify div

---

### Release 0.1.1 — November 12, 2015

#### jQuery
* **Datepickers**: Multiple datepickers on a page now properly close each other <a href="https://github.com/appiphony/appiphony-lightning-js/issues/5">(GitHub Issue #5)</a>
* **Datepickers**: Added the ability to pass in an onChange callback function <a href="https://github.com/appiphony/appiphony-lightning-js/issues/4">(GitHub Issue #4)</a>
* **Icon Group**: New plugin
* **Modals**: Modals now consistently open when initialized on the body <a href="https://github.com/appiphony/appiphony-lightning-js/issues/1">(GitHub Issue #1)</a>
* **Modals**: Set aria-hidden attribute to "true" by default
* **Modals**: Programmatically dismissing/showing multiple modals now properly shows/hides the modal backdrop <a href="https://github.com/appiphony/appiphony-lightning-js/issues/2">(GitHub Issue #2)</a>
* **Modals**: Added onShown and onDismissed callbacks
* **Multi Selects**: Changed multiPicklist function to multiSelect
* **Picklists**: Keyup no longer causes the UI to scroll
* **Picklists**: No longer focusing on the first element when no value is selected
* **Tabs**: Added support for left and right key navigation
* **Tabs**: Updated aria-selected and tabindex attributes to match SLDS requirements
* **Tooltips**: Fixed tooltip line height when triggered from inside a button

#### Ember
* **Checkboxes**: Added a checkbox component
* **Datepickers**: Added a multi-range datepicker component
* **Datepickers**: Custom month/day labels now properly work with datepickers
* **Datepickers**: Clicking on the body properly closes a datepicker
* **Modals**: Data attribute modal triggers now properly open/close modals
* **Modals**: Added ability to customize modal body classes
* **Modals**: Modals now properly work across different view states
* **Modals**: Modals now properly close when triggered via a jQuery method
* **Modals**: Updated the close button to use inverse class  
* **Multi Selects**: Changed multi-picklist to multi-select
* **Notifications**: Added support to designate UI elements to dismiss a notification
* **Tabs**: Added support to specify the type of tabs class applied to the component
* **Tabs**: Added support to bind the active tab to a property
* **Tabs**: Added support for left and right key navigation
* **Tabs**: Updated aria-selected and tabindex attributes to match SLDS requirements

---

### Release 0.1 — October 30, 2015
* Initial release
* Open sourced: <a href="https://github.com/appiphony/appiphony-lightning-js" target="_blank">https://github.com/appiphony/appiphony-lightning-js</a>