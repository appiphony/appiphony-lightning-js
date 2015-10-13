if (typeof jQuery === "undefined") { throw new Error("The Salesforce Lightning JavaScript Toolkit requires jQuery") }

(function($) {

    var datepickerMenuMarkup = 
    '<div class="slds-dropdown slds-dropdown--left slds-datepicker" aria-hidden="false" data-selection="single">' +
        '<div class="slds-datepicker__filter slds-grid">' +
            '<div class="slds-datepicker__filter--month slds-grid slds-grid--align-spread slds-size--3-of-4">' +
                '<div class="slds-align-middle">' +
                    '<button class="slds-button slds-button--icon-container">' +
                        '<svg aria-hidden="true" class="slds-button__icon slds-button__icon--small">' +
                            '<use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#left"></use>' +
                        '</svg>' +
                        '<span class="slds-assistive-text">Previous Month</span>' +
                    '</button>' +
                '</div>' +
                '<h2 id="month" class="slds-align-middle" aria-live="assertive" aria-atomic="true">June</h2>' +
                '<div class="slds-align-middle">' +
                    '<button class="slds-button slds-button--icon-container">' +
                        '<svg aria-hidden="true" class="slds-button__icon slds-button__icon--small">' +
                            '<use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#right"></use>' +
                        '</svg>' +
                        '<span class="slds-assistive-text">Next Month</span>' +
                    '</button>' +
                '</div>' +
            '</div>' +
            '<div class="slds-picklist datepicker__filter--year slds-shrink-none">' +
                '<button id="year" class="slds-button slds-button--neutral slds-picklist__label" aria-haspopup="true">2015' +
                    '<svg aria-hidden="true" class="slds-icon slds-icon--small">' +
                        '<use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#down"></use>' +
                    '</svg>' +
                '</button>' +
            '</div>' +
        '</div>';

    var datepickerTableMarkup = 
        '<table class="datepicker__month" role="grid" aria-labelledby="month">' +
            '<thead>' +
                '<tr id="weekdays">' +
                    '<th id="Sunday">' +
                        '<abbr title="Sunday">S</abbr>' +
                    '</th>' +
                    '<th id="Monday">' +
                        '<abbr title="Monday">M</abbr>' +
                    '</th>' +
                    '<th id="Tuesday">' +
                        '<abbr title="Tuesday">T</abbr>' +
                    '</th>' +
                    '<th id="Wednesday">' +
                        '<abbr title="Wednesday">W</abbr>' +
                    '</th>' +
                    '<th id="Thursday">' +
                        '<abbr title="Thursday">T</abbr>' +
                    '</th>' +
                    '<th id="Friday">' +
                        '<abbr title="Friday">F</abbr>' +
                    '</th>' +
                    '<th id="Saturday">' +
                        '<abbr title="Saturday">S</abbr>' +
                    '</th>' +
                '</tr>' +
            '</thead>' +
            '<tbody>' +
                
            '</tbody>' +
        '</table>' +
    '</div>';

    $.fn.datepicker = function(options) {
    
        var settings = $.extend({
            numYearsBefore: 50,
            numYearsAfter: 10,
            dayLabels: [
                {
                    full: 'Sunday',
                    abbv: 'S'
                },
                {
                    full: 'Monday',
                    abbv: 'M'
                },
                {
                    full: 'Tuesday',
                    abbv: 'T'
                },
                {
                    full: 'Wednesday',
                    abbv: 'W'
                },
                {
                    full: 'Thursday',
                    abbv: 'T'
                },
                {
                    full: 'Friday',
                    abbv: 'F'
                },
                {
                    full: 'Saturday',
                    abbv: 'S'
                }
            ],
            monthLabels: [
                {
                    full: 'January',
                    abbv: ''
                },
                {
                    full: 'February',
                    abbv: ''
                },
                {
                    full: 'March',
                    abbv: ''
                },
                {
                    full: 'April',
                    abbv: ''
                },
                {
                    full: 'May',
                    abbv: ''
                },
                {
                    full: 'June',
                    abbv: ''
                },
                {
                    full: 'July',
                    abbv: ''
                },
                {
                    full: 'August',
                    abbv: ''
                },
                {
                    full: 'September',
                    abbv: ''
                },
                {
                    full: 'October',
                    abbv: ''
                },
                {
                    full: 'November',
                    abbv: ''
                },
                {
                    full: 'December',
                    abbv: ''
                }
            ]
            // These are the defaults.
            
        }, options );

        return this.each(function() {
            var $el = $(this);
            initDatepicker(this);
        });
    };
})(jQuery);
/*
<tr>
    <td class="slds-disabled-text" headers="Sunday" role="gridcell" aria-disabled="true">
        <span class="slds-day">31</span>
    </td>
    <td headers="Monday" role="gridcell" aria-selected="false">
        <span class="slds-day">1</span>
    </td>
    <td headers="Tuesday" role="gridcell" aria-selected="false">
        <span class="slds-day">2</span>
    </td>
    <td headers="Wednesday" role="gridcell" aria-selected="false">
        <span class="slds-day">3</span>
    </td>
    <td headers="Thursday" role="gridcell" aria-selected="false">
        <span class="slds-day">4</span>
    </td>
    <td headers="Friday" role="gridcell" aria-selected="false">
        <span class="slds-day">5</span>
    </td>
    <td headers="Saturday" role="gridcell" aria-selected="false">
        <span class="slds-day">6</span>
    </td>
</tr>
<tr>
    <td headers="Sunday" role="gridcell" aria-selected="false">
        <span class="slds-day">7</span>
    </td>
    <td headers="Monday" role="gridcell" aria-selected="false">
        <span class="slds-day">8</span>
    </td>
    <td headers="Tuesday" role="gridcell" aria-selected="false">
        <span class="slds-day">9</span>
    </td>
    <td headers="Wednesday" role="gridcell" aria-selected="false">
        <span class="slds-day">10</span>
    </td>
    <td headers="Thursday" role="gridcell" aria-selected="false">
        <span class="slds-day">11</span>
    </td>
    <td headers="Friday" role="gridcell" aria-selected="false">
        <span class="slds-day">12</span>
    </td>
    <td headers="Saturday" role="gridcell" aria-selected="false">
        <span class="slds-day">13</span>
    </td>
</tr>
<tr>
    <td headers="Sunday" role="gridcell" aria-selected="false">
        <span class="slds-day">14</span>
    </td>
    <td headers="Monday" role="gridcell" aria-selected="false">
        <span class="slds-day">15</span>
    </td>
    <td headers="Tuesday" role="gridcell" aria-selected="false">
        <span class="slds-day">16</span>
    </td>
    <td headers="Wednesday" role="gridcell" aria-selected="false">
        <span class="slds-day">17</span>
    </td>
    <td class="slds-is-today" headers="Thursday" role="gridcell" aria-selected="false">
        <span class="slds-day">18</span>
    </td>
    <td headers="Friday" role="gridcell" aria-selected="false">
        <span class="slds-day">19</span>
    </td>
    <td headers="Saturday" role="gridcell" aria-selected="false">
        <span class="slds-day">20</span>
    </td>
</tr>
<tr>
    <td headers="Sunday" role="gridcell" aria-selected="false">
        <span class="slds-day">21</span>
    </td>
    <td headers="Monday" role="gridcell" aria-selected="false">
        <span class="slds-day">22</span>
    </td>
    <td class="slds-is-selected" headers="Tuesday" role="gridcell" aria-selected="true">
        <span class="slds-day">23</span>
    </td>
    <td headers="Wednesday" role="gridcell" aria-selected="false">
        <span class="slds-day">24</span>
    </td>
    <td headers="Thursday" role="gridcell" aria-selected="false">
        <span class="slds-day">25</span>
    </td>
    <td headers="Friday" role="gridcell" aria-selected="false">
        <span class="slds-day">26</span>
    </td>
    <td headers="Saturday" role="gridcell" aria-selected="false">
        <span class="slds-day">27</span>
    </td>
</tr>
<tr>
    <td headers="Sunday" role="gridcell" aria-selected="false">
        <span class="slds-day">28</span>
    </td>
    <td headers="Monday" role="gridcell" aria-selected="false">
        <span class="slds-day">29</span>
    </td>
    <td headers="Tuesday" role="gridcell" aria-selected="false">
        <span class="slds-day">30</span>
    </td>
    <td class="slds-disabled-text" headers="Wednesday" role="gridcell" aria-disabled="true">
        <span class="slds-day">1</span>
    </td>
    <td class="slds-disabled-text" headers="Thursday" role="gridcell" aria-disabled="true">
        <span class="slds-day">2</span>
    </td>
    <td class="slds-disabled-text" headers="Friday" role="gridcell" aria-disabled="true">
        <span class="slds-day">3</span>
    </td>
    <td class="slds-disabled-text" headers="Saturday" role="gridcell" aria-disabled="true">
        <span class="slds-day">4</span>
    </td>
</tr>
*/