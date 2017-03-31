# Appiphony Lightning JS

### Release 3.1.0 — March 31, 2017

#### General
Updated Getting Started with instructions for utilizing `&lt;apex:slds/&gt;`
Updated documentation for Lookups to clarify use of options <a href="https://github.com/appiphony/appiphony-lightning-js/issues/63">[GitHub Issue #63]</a>

#### jQuery
* **Datepickers**: Fixed an issue where manually clearing an input value selected from a datepicker does not call `onChange` or clear the datepicker's selection <a href="https://github.com/appiphony/appiphony-lightning-js/issues/58">[GitHub Issue #58]</a>
* **Datepickers**: Fixed an issue where placeholders in Safari are not removed when a selection is made <a href="https://github.com/appiphony/appiphony-lightning-js/issues/62">[GitHub Issue #62]</a>
* **Datepickers**: Added the `onShow` and `onDismiss` options <a href="https://github.com/appiphony/appiphony-lightning-js/issues/73">[GitHub Issue #73]</a>
* **Datepickers**: Added the `onSelect` option <a href="https://github.com/appiphony/appiphony-lightning-js/issues/74">[GitHub Issue #74]</a>
* **Datepickers**: Fixed an issue where the left and right arrow buttons would ignore the specified year range <a href="https://github.com/appiphony/appiphony-lightning-js/issues/75">[GitHub Issue #75]</a>
* **Datepickers**: Fixed an issue where an end date could not be set on initialization <a href="https://github.com/appiphony/appiphony-lightning-js/issues/77">[GitHub Issue #77]</a>
* **Init**: Added the `scopingClass` property with a default value of `slds-scope` <a href="https://github.com/appiphony/appiphony-lightning-js/issues/59">[GitHub Issue #59]</a> <a href="https://github.com/appiphony/appiphony-lightning-js/issues/79">[GitHub Issue #79]</a>
* **Init**: The `scoped` property's default is now `true`
* **Lookups**: Added support for arrow keys <a href="https://github.com/appiphony/appiphony-lightning-js/issues/61">[GitHub Issue #61]</a>
* **Modals**: Fixed an issue where modal backdrops are not dismissed if its modal is dismissed before fade-in animations complete <a href="https://github.com/appiphony/appiphony-lightning-js/issues/66">[GitHub Issue #66]</a>
* **Multi Selects**: The `setSelectedItems` and `setUnselectedItems` methods now accept an array of objects where item order can be explicitly defined <a href="https://github.com/appiphony/appiphony-lightning-js/issues/65">[GitHub Issue #65]</a>
* **Picklists**: Added support for new SLDS 2.2.0 picklist markup <a href="https://github.com/appiphony/appiphony-lightning-js/issues/68">[GitHub Issue #68]</a>
* **Popovers**: Added support for dynamically editing/disabling a text-based popover's content by updating the `data-aljs-title` attribute <a href="https://github.com/appiphony/appiphony-lightning-js/issues/72">[GitHub Issue #72]</a>

---

### Release 3.0.0 — December 5, 2016

#### General
* Updated documentation for Multi Selects to reflect correct initialization <a href="https://github.com/appiphony/appiphony-lightning-js/issues/44">[GitHub Issue #44]</a>
* Updated Getting Started with correct paths to ALJS resources <a href="https://github.com/appiphony/appiphony-lightning-js/issues/47">[GitHub Issue #47]</a>
* Updated Getting Started with instructions for `jquery.aljs-all-with-moment.min.js`
* Improvements to mobile navigation

#### jQuery
* **All**: Created the `jquery.aljs-all-with-moment.min.js` which includes all ALJS jQuery plugins with the Moment dependency
* **Datepickers**: Updated plugin-generated markup to match SLDS 2.1.4's
* **Datepickers**: Fixed an issue where the plugin would malfunction if an id of `month` already exists on the page
* **Datepickers**: Default settings for the `abbr` properties of objects in the `dayLabels` array have been updated to match the Winter release
* **Init**: The `scoped` property's default is now `false`
* **Lookups**: Updated plugin-generated markup to match SLDS 2.1.4's
* **Lookups**: Fixed an issue where passing empty string on objectIconUrl did not hide the icon for a currently selected pill
* **Lookups**: Default settings now use the `assetsLocation` property from init
* **Lookups**: The `clickAddFunction` property is now `onClickNew`; "Add" is now "New"
* **Lookups**: The 'Add' options is now 'New'
* **Lookups**: Added the `searchDelay` option <a href="https://github.com/appiphony/appiphony-lightning-js/pull/50">[GitHub Pull Request #50; credit: OlegForce]</a>
* **Lookups**: Added the `recentLabel` option
* **Modals**: Fixed an issue where `slds-show`/`slds-hide` classes would incorrectly be applied when using the `show` and `dismiss` methods
* **Modals**: Fixed an issue where the `aria-hidden` attribute was not being updated properly
* **Modals**: The `tabindex` attribute is now adjusted on the modal itself instead of its child elements
* **Notifications**: Fixed an issue where notifications could not be dismissed due to an incorrect reference of the notification markup <a href="https://github.com/appiphony/appiphony-lightning-js/pull/55">[GitHub Pull Request #55; credit: vscuorzo]</a>
* **Picklists**: Now makes use of the `slds-is-open` class to show/hide dropdowns
* **Picklists**: Added documentation for the `getValueId` method

---

### Release 2.0.0 — July 29, 2016

#### jQuery
* **Datepickers**: Added markup and functionality for the 'Today' link
* **Datepickers**: Added the `todayLabel` option
* **Datepickers**: Updated the name of the `abbv` property (for objects passed into the `dayLabels` and `monthLabels` options) to `abbr`
* **Datepickers**: Fixed an issue where clicking previous/next buttons to a new year did not update the select element's year <a href="https://github.com/appiphony/appiphony-lightning-js/issues/38">[GitHub Issue #38]</a>
* **Datepickers**: Fixed an issue where the `dayLabels` option was not appropriately updating the markup <a href="https://github.com/appiphony/appiphony-lightning-js/issues/43">[GitHub Issue #43]</a>
* **Lookups**: Updated dropdown and pill container markup/classes to comply with the SLDS 2.0.1 release
* **Lookups**: Added `title` attributes for icons
* **Lookups**: Added 'Typeahead' highlighting functionality
* **Lookups**: Removed support for Multi Select Lookups (no longer supported by SLDS)
* **Lookups**: Fixed an issue where Lookups were receiving incorrect classes for its separate states
* **Picklists**: The `bindChoices` method is now publicly available and documented; allows you to bind dynamically added options <a href="https://github.com/appiphony/appiphony-lightning-js/issues/40">[GitHub Issue #40]</a>

#### Ember
* **All**: Ember is no longer supported

---

### Release 1.0.0 — April 1, 2016

#### jQuery
* **All**: Created the `jquery.aljs-all.min.js` which includes all ALJS jQuery plugins
* **Lookups**: Updated `onChange` to reference `self.selectedResult` instead of `selectResult` <a href="https://github.com/appiphony/appiphony-lightning-js/issues/27">[GitHub Issue #27]</a>
* **Lookups**: `setSelection` now accepts an empty array or object to clear the Lookup <a href="https://github.com/appiphony/appiphony-lightning-js/issues/27">[GitHub Issue #27]</a>
* **Lookups**: Added additional functionality for `clickAddFunction` <a href="https://github.com/appiphony/appiphony-lightning-js/issues/35">[GitHub Issue #35]</a>
* **Lookups**: Fixed an issue where filtering produces an empty results container if `showSearch` and `clickAddFunction` settings are not used
* **Popovers**: Refactored Popovers to accept new SLDS 1.0.0 Popover markup, including its BEM class modifiers <a href="https://github.com/appiphony/appiphony-lightning-js/issues/34">[GitHub Issue #34]</a>
* **Tabs**: Fixed an issue involving focus and keyup events when selecting tabs with the keyboard
* **Tabs**: Added support for nested tabs <a href="https://github.com/appiphony/appiphony-lightning-js/issues/37">[GitHub Issue #37]</a>
* **Tooltips**: Plugin removed in favor of SLDS 1.0.0 Popover markup; see Popovers for new tooltip support <a href="https://github.com/appiphony/appiphony-lightning-js/issues/34">[GitHub Issue #34]</a>

#### Ember
* **Datepickers**: Added support for removing a selected date and setting a typed date on blur instead of just on enter
* **Lookups**: Multi Select Lookups now prevent duplicates if user is allowed to enter new items and presses enter

---

### Release 0.2.0 — February 10, 2016

#### jQuery
* **Lookups**: Added a callback to the `emptySearchTermQuery` option's default function
* **Lookups**: Edited pill container markup/classes to comply with 0.12.0 SLDS release
* **Lookups**: The `customObjectIcon` option is now `useImgTag`; `customObjectIcon` is no longer supported
* **Lookups**: Added a `showSearch` option
* **Lookups**: Fixed an issue where the Add Object button's icon was rendering too large
* **Modals**: Fixed `tabindex` issues when modals are open
* **Picklists**: Now close when the Esc key is pressed <a href="https://github.com/appiphony/appiphony-lightning-js/issues/20">[GitHub Issue #20]</a>
* **Picklists**: Fixed an error when the `getValue` method is used <a href="https://github.com/appiphony/appiphony-lightning-js/issues/31">[GitHub Issue #31]</a>
* **Tooltips**: Markup is now absolutely positioned with new position calculations; elements which trigger tooltips will no longer be wrapped in a relative-positioned span on hover

#### Ember
* **Datepickers**: `selectedDateText` can now be bound
* **Datepickers**: Changed single datepicker year picklist to a select element
* **Datepickers**: Fixed scoping issues with some UI events
* **Datepickers**: Added a `label` attribute binding
* **Datepickers**: Added an `isRequired` attribute binding
* **Datepickers**: Multi Select datepickers now highlight the correct selected dates (previously highlighted previous month sometimes as well) <a href="https://github.com/appiphony/appiphony-lightning-js/issues/28">[Github Issue #28]</a>
* **Lookups**: Added support to disable the lookup and bind a placeholder value <a href="https://github.com/appiphony/appiphony-lightning-js/issues/23">[GitHub Issue #23]</a>
* **Lookups**: Edited pill container markup/classes to comply with 0.12.0 SLDS release <a href="https://github.com/appiphony/appiphony-lightning-js/issues/26">[GitHub Issue #26]</a>
* **Lookups**: The `isObjectIconCustom` parameter is now `useImgTag`; `isObjectIconCustom` is no longer supported
* **Lookups**: Lookups now properly populate when selecting a result on Safari/Firefox/IE 10/IE 11 <a href="https://github.com/appiphony/appiphony-lightning-js/issues/9">[GitHub Issue #9]</a>
* **Lookups**: Multi select lookups are now properly binding to the `selectedResults` attribute; now allows multi select lookups to pass in just an array of text
* **Lookups**: Added a `showSearch` attribute binding
* **Lookups**: Added a `minimumSearchLength` attribute binding
* **Lookups**: Added a `clearOnSelect` attribute binding
* **Lookups**: Added an `allowNewItems` attribute binding
* **Lookups**: Added a `tokenSeparators` attribute binding
* **Modals**: Fixed `tabindex` issues when modals are open
* **Notifications**: Added a `visible` attribute binding
* **Notifications**: Added a `fadeDuration` attribute binding
* **Notifications**: Added a `duration` attribute binding
* **Notifications**: Added a `theme` attribute binding
* **Picklists**: Now only sets selection if `picklistOption` exists (fixes a bug when an undefined value is passed in)
* **Picklists**: Now close when the Esc key is pressed <a href="https://github.com/appiphony/appiphony-lightning-js/issues/20">[GitHub Issue #20]</a>

---

### Release 0.1.3 — December 2, 2015

#### General
* Bower install name has been edited to `appiphony-lightning-js`

#### jQuery
* **Lookups**: Default search when a list of items is passed in is now case insensitive <a href="https://github.com/appiphony/appiphony-lightning-js/issues/10">[GitHub Issue #10]</a>

#### Ember
* **Lookups**: Default search when a list of items is passed in is now case insensitive <a href="https://github.com/appiphony/appiphony-lightning-js/issues/10">[GitHub Issue #10]</a>

---

### Release 0.1.2 — November 30, 2015

#### jQuery
* **Lookups**: Lookups now properly populate when selecting a result on Safari/Firefox/IE 10/IE 11 <a href="https://github.com/appiphony/appiphony-lightning-js/issues/9">[GitHub Issue #9]</a>
* **Lookups**: Updated single selected result markup to comply with 0.12.0 SLDS release
* **Lookups**: Added an `onChange` option to run when a user selects a result
* **Lookups**: Added an `initialSelection` option to set the selected result on load
* **Lookups**: Added a `setSelection` method to programmatically set the selected result
* **Lookups**: Added support for custom object icons and hiding icons from results markup <a href="https://github.com/appiphony/appiphony-lightning-js/issues/8">[GitHub Issue #8]</a>
* **Modals**: Updated backdrop markup to comply with 0.12.0 SLDS release
* **Tabs**: Updated template classes to comply with 0.12.0 SLDS release
* **Tabs**: Updated docs to comply with 0.12.0 SLDS release

#### Ember
* **Lookups**: Added support for a custom icon URL and class
* **Lookups**: Updated single selected result markup to comply with 0.12.0 SLDS release
* **Lookups**: Added support to bind to a route's controller and fixed calling the search methods
* **Lookups**: Added support for custom object icons and hiding icons from results markup <a href="https://github.com/appiphony/appiphony-lightning-js/issues/8">[GitHub Issue #8]</a>
* **Modals**: Updated backdrop markup to comply with 0.12.0 SLDS release
* **Modals**: Added a `show` method to the jQuery call
* **Tabs**: Updated template classes to comply with 0.12.0 SLDS release
* **Notifications**: Added support to customize classes that get applied to the `.slds-notify` div

---

### Release 0.1.1 — November 12, 2015

#### jQuery
* **Datepickers**: Multiple datepickers on a page now properly close each other <a href="https://github.com/appiphony/appiphony-lightning-js/issues/5">[GitHub Issue #5]</a>
* **Datepickers**: Added the ability to pass in an `onChange` callback function <a href="https://github.com/appiphony/appiphony-lightning-js/issues/4">[GitHub Issue #4]</a>
* **Icon Group**: New plugin
* **Modals**: Modals now consistently open when initialized on the body <a href="https://github.com/appiphony/appiphony-lightning-js/issues/1">[GitHub Issue #1]</a>
* **Modals**: Set aria-hidden attribute to `true` by default
* **Modals**: Programmatically dismissing/showing multiple modals now properly shows/hides the modal backdrop <a href="https://github.com/appiphony/appiphony-lightning-js/issues/2">[GitHub Issue #2]</a>
* **Modals**: Added `onShown` and `onDismissed` callbacks
* **Multi Selects**: Changed `multiPicklist` function to `multiSelect`
* **Picklists**: Keyup no longer causes the UI to scroll
* **Picklists**: No longer focusing on the first element when no value is selected
* **Tabs**: Added support for left and right key navigation
* **Tabs**: Updated `aria-selected` and `tabindex` attributes to match SLDS requirements
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
* **Multi Selects**: Changed multi-picklist to multi-select (plugin/component name)
* **Notifications**: Added support to designate UI elements to dismiss a notification
* **Tabs**: Added support to specify the type of tabs class applied to the component
* **Tabs**: Added support to bind the active tab to a property
* **Tabs**: Added support for left and right key navigation
* **Tabs**: Updated `aria-selected` and `tabindex` attributes to match SLDS requirements

---

### Release 0.1.0 — October 30, 2015
* Initial release
* Open sourced: <a href="https://github.com/appiphony/appiphony-lightning-js" target="_blank">https://github.com/appiphony/appiphony-lightning-js</a>