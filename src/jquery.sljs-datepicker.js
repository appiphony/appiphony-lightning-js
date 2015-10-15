if (typeof jQuery === "undefined") { throw new Error("The Salesforce Lightning JavaScript Toolkit requires jQuery") }
if (typeof moment === "undefined") { throw new Error("The Salesforce Lightning JavaScript Toolkit requires momentjs") }

// based on bootstrap-datepicker.js 


(function($) {

    var datepickerMenuMarkup = 
    '<div class="slds-dropdown slds-dropdown--left slds-datepicker" aria-hidden="false" data-selection="single">' +
        '<div class="slds-datepicker__filter slds-grid">' +
            '<div class="slds-datepicker__filter--month slds-grid slds-grid--align-spread slds-size--3-of-4">' +
                '<div class="slds-align-middle">' +
                    '<button id="sljs-prevButton" class="slds-button slds-button--icon-container">' +
                        '<svg aria-hidden="true" class="slds-button__icon slds-button__icon--small">' +
                            '<use xlink:href="{{sldsUrl}}/assets/icons/utility-sprite/svg/symbols.svg#left"></use>' +
                        '</svg>' +
                        '<span class="slds-assistive-text">Previous Month</span>' +
                    '</button>' +
                '</div>' +
                '<h2 id="month" class="slds-align-middle" aria-live="assertive" aria-atomic="true"></h2>' +
                '<div class="slds-align-middle">' +
                    '<button id="sljs-nextButton" class="slds-button slds-button--icon-container">' +
                        '<svg aria-hidden="true" class="slds-button__icon slds-button__icon--small">' +
                            '<use xlink:href="{{sldsUrl}}/assets/icons/utility-sprite/svg/symbols.svg#right"></use>' +
                        '</svg>' +
                        '<span class="slds-assistive-text">Next Month</span>' +
                    '</button>' +
                '</div>' +
            '</div>' +
            '<div class="slds-picklist datepicker__filter--year slds-shrink-none">' +
                '<button id="year" class="slds-button slds-button--neutral slds-picklist__label" aria-haspopup="true">' +
                    '<span id="sljs-year"></span>' +
                    '<svg aria-hidden="true" class="slds-icon slds-icon--small">' +
                        '<use xlink:href="{{sldsUrl}}/assets/icons/utility-sprite/svg/symbols.svg#down"></use>' +
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

    var Datepicker = function(el, options) {
        var initDate = moment(options.initDate) || moment();

        this.$el = $(el);
        this.$datepickerEl = $(datepickerMenuMarkup.replace(/{{sldsUrl}}/g, options.assetsLocation) + datepickerTableMarkup);
        this.options = options;

        if (options.initDate) {
            this.setSelectedFullDate(initDate);
        }

        this.initInteractivity();  
    };

    Datepicker.prototype = {
        constructor: Datepicker,
        initInteractivity: function() {
            var self = this;
            var $datepickerEl = this.$datepickerEl;
            var $el = this.$el;

            // Opening datepicker
            $el.on('focus', function(e) {
                var initDate = self.selectedFullDate || moment();
                self.viewedMonth = initDate.month();
                self.viewedYear = initDate.year();
                self.fillMonth();

                if ($el.closest('.slds-form-element').next($datepickerEl).length > 0) {
                    $datepickerEl.show();
                } else {
                    $el.closest('.slds-form-element').after($datepickerEl);   
                    $([$el, $datepickerEl]).each(function() {
                        $(this).on('click', self.blockClose);
                    });         
                }   
            });

            $datepickerEl.on('click', this, this.processClick);

            $('body').on('click', function(e) {
                self.closeDatepicker();
            });

            /* focus out?
            $([$el, $datepickerEl.find('button')]).each(function() {
                $(this).on('blur', function(e) {
                    if ($(e.relatedTarget).closest('.slds-form--stacked').find($el).length === 0) {
                        self.closeDatepicker();
                    }
                    //self.closeDatepicker();
                });
            });
            */
        },
        fillMonth: function() {
            var self = this;
            var dayLabels = this.options.dayLabels;
            var monthArray = this.getMonthArray();
            var $monthTableBody = $('<tbody>');
            
            monthArray.forEach(function(rows) {
                var $weekRow = $('<tr>').appendTo($monthTableBody);

                rows.forEach(function(col, colIndex) {
                    var $dayCol = $('<td data-sljs-date="' + col.dateValue + '">').appendTo($weekRow);

                    $dayCol.prop({
                        headers: dayLabels[colIndex].full,
                        role: 'gridcell'
                    });

                    $('<span class="slds-day">' + col.value + '</span>').appendTo($dayCol);
                    
                    if (!col.isCurrentMonth) {
                        $dayCol.addClass('slds-disabled-text');
                        $dayCol.prop('aria-disabled', 'true');
                    }

                    if (col.isSelected) {
                        $dayCol.prop('aria-selected', 'true');
                        $dayCol.addClass('slds-is-selected');
                    } else {
                        $dayCol.prop('aria-selected', 'false');
                    }

                    if (col.isToday) {
                        $dayCol.addClass('slds-is-today');
                    }

                });
            });

            this.$datepickerEl.find('tbody').replaceWith($monthTableBody);
            this.$datepickerEl.find('#month').text(this.options.monthLabels[this.viewedMonth].full);
            this.$datepickerEl.find('#sljs-year').text(this.viewedYear);
        },
        showYearDropdown: function() {
            var $yearContainer = $('<div id="sljs-yearDropdown" class="slds-dropdown slds-dropdown--menu">');
            var $yearDropdown = $('<ul class="slds-dropdown__list" style="max-height: 13.5rem; overflow-y:auto;"></ul>').appendTo($yearContainer);
            var viewedYear = this.viewedYear;
            var currentYear = moment().year();
            var selectedIconMarkup = ('<svg aria-hidden="true" class="slds-icon slds-icon--small slds-icon--left">' +
                                    '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{sldsUrl}}/assets/icons/standard-sprite/svg/symbols.svg#task2" data-reactid=".46.0.0.1:$=10:0.0.$=11:0.0.0.0"></use>' +
                                '</svg>').replace(/{{sldsUrl}}/g, this.options.assetsLocation);

            for (var i = currentYear - this.options.numYearsBefore; i <= currentYear + this.options.numYearsAfter; i++) {
                var $yearLi = $('<li id="sljs-yearDropdown' + i + '" class="slds-dropdown__item" data-sljs-year="' + i + '">').appendTo($yearDropdown);
                var $yearA = $('<a href="#" class="slds-truncate slds-has-icon--left" role="menuitemradio"><span>' + i + '</span></a>').appendTo($yearLi);

                if (viewedYear === i) {
                    $yearLi.prop('aria-selected', 'true');
                    $yearA.addClass('slds-is-selected');
                    $yearA.prepend(selectedIconMarkup);
                } else {
                    $yearLi.prop('aria-selected', 'false');
                }
            }

            this.$datepickerEl.find('#year').after($yearContainer);

            $yearDropdown.scrollTop(this.$datepickerEl.find('#sljs-yearDropdown' + viewedYear).position().top);
        },
        hideYearDropdown: function() {
            this.$datepickerEl.find('#sljs-yearDropdown').remove();
        },
        getMMDDYYYY: function(month, date, year) {
            return (month > 9 ? month : '0' + month) + '/' + (date > 9 ? date : '0' + date) + '/' + year;
        },
        getMonthArray: function() {
            var self = this;
            var selectedFullDate = this.selectedFullDate;
            var selectedDate = selectedFullDate ? selectedFullDate.date() : null;
            var selectedMonth = selectedFullDate ? selectedFullDate.month() : null;
            var selectedYear = selectedFullDate ? selectedFullDate.year() : null;

            var viewedMonth = this.viewedMonth;
            var viewedYear = this.viewedYear;

            var previousMonth = viewedMonth === 0 ? 11 : viewedMonth - 1;
            var nextMonth = viewedMonth === 11 ? 0 : viewedMonth + 1;
            var numDaysInMonth = this.getNumDaysInMonth(viewedYear, viewedMonth);
            var numDaysInPrevMonth = this.getNumDaysInMonth(viewedYear, previousMonth);
            var numDaysInNextMonth = this.getNumDaysInMonth(viewedYear, nextMonth);
            var firstDayOfMonth = (new Date(viewedYear, viewedMonth, 1)).getDay();
            var allDays = [];
            var calendarRows = [];
            var dayLabels = this.dayLabels;

            // Fill previous month
            for (var i = numDaysInPrevMonth - (firstDayOfMonth - 1); i <= numDaysInPrevMonth; i++) {
                var iDate = moment(new Date(viewedYear, viewedMonth, i));
                allDays.push({
                    value: i,
                    dateValue: this.getMMDDYYYY(previousMonth + 1, i, viewedYear),
                    isCurrentMonth: false,
                    isSelected: !selectedFullDate && iDate.isSame(selectedFullDate, 'day'),
                    isToday: iDate.isSame(moment(), 'day')
                });
            }

            // Fill current month
            for (var i = 1; i <= numDaysInMonth; i++) {
                var iDate = moment(new Date(viewedYear, viewedMonth, i));
                allDays.push({
                    value: i,
                    dateValue: this.getMMDDYYYY(viewedMonth + 1, i, viewedYear),
                    isCurrentMonth: true,
                    isSelected: selectedFullDate && iDate.isSame(selectedFullDate, 'day'),
                    isToday: iDate.isSame(moment(), 'day')
                });
            }

            // Split array into rows of 7
            allDays.forEach(function(day, index) {
                if (index % 7 === 0) {
                    calendarRows.push([]);
                }

                calendarRows[calendarRows.length - 1].push(day);
            });
            
            // Fill last row
            if (calendarRows[calendarRows.length - 1].length < 7) {
                var iDate = moment(new Date(viewedYear, viewedMonth, i));
                var numColsToFill = 7 - calendarRows[calendarRows.length - 1].length;
                for (var i = 1; i <= numColsToFill; i++) {
                    calendarRows[calendarRows.length - 1].push({
                        value: i,
                        dateValue: this.getMMDDYYYY(nextMonth + 1, i, (nextMonth === 0 ? viewedYear + 1 : viewedYear)),
                        isCurrentMonth: false,
                        isSelected: selectedFullDate && iDate.isSame(selectedFullDate, 'day'),
                        isToday: iDate.isSame(moment(), 'day')
                    });
                }
            }

            return calendarRows;
        },
        setSelectedFullDate: function(selectedFullDate) {
            this.selectedFullDate = selectedFullDate;
            this.$el.val(selectedFullDate.format(this.options.format));
        },
        processClick: function(e) {
            e.preventDefault();
            var self = e.data;
            var $target = $(e.target);
            
            if ($target.closest('#sljs-prevButton').length > 0) {
                self.clickPrev(e);
            }

            if ($target.closest('#sljs-nextButton').length > 0) {
                self.clickNext(e);
            }

            if ($target.closest('td[data-sljs-date]').length > 0) {
                self.clickDate(e);
            }

            if ($target.closest('li[data-sljs-year]').length > 0) {
                self.clickYear(e);
            }

            if ($target.closest('#year').length > 0) {
                self.clickYearDropdown(e);
            } else {
                self.hideYearDropdown();
            }
        },
        clickPrev: function(e) {
            var self = e.data;
            if (self.viewedMonth === 0) {
                self.viewedMonth = 11;
                self.viewedYear--;
            } else {
                self.viewedMonth--;
            }

            self.fillMonth();
        },
        clickNext: function(e) {
            var self = e.data;

            if (self.viewedMonth === 11) {
                self.viewedMonth = 0;
                self.viewedYear++;
            } else {
                self.viewedMonth++;
            }

            self.fillMonth();
        },
        clickYear: function(e) {
            var self = e.data;

            var $clickedYear = $(e.target).closest('li[data-sljs-year]');
            self.viewedYear = parseInt($clickedYear.data('sljs-year'));
            self.fillMonth();
        },
        clickYearDropdown: function(e) {
            var self = e.data;

            if (self.$datepickerEl.find('#sljs-yearDropdown').length > 0) {
                self.hideYearDropdown();
            } else {
                self.showYearDropdown();
            }
        },
        clickDate: function(e) {
            var self = e.data;
            var $clickedDate = $(e.target).closest('td[data-sljs-date]');

            if (!($clickedDate.hasClass('slds-disabled-text'))) {
                var selectedDate = $clickedDate.data('sljs-date');

                self.setSelectedFullDate(moment(selectedDate, 'MM/DD/YYYY'));
                self.closeDatepicker();
            }     
        },
        closeDatepicker: function() {
            var $datepickerEl = this.$datepickerEl;
            var $el = this.$el;

            $el.closest('.slds-form-element').next($datepickerEl).hide();
        },
        blockClose: function(e) {
            e.stopPropagation();
        },
        isLeapYear: function (year) {
            return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
        },
        getNumDaysInMonth: function(year, month) {
            return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        },
        getDate: function(format) {
            return format ? this.selectedFullDate.format(format) : this.selectedFullDate;
        },
        setDate: function(date) {
            this.setSelectedFullDate(moment(date));
        }
    };

    $.fn.datepicker = function(options, val) {
    
        var settings = $.extend({
            assetsLocation: '',
            numYearsBefore: 50,
            numYearsAfter: 10,
            format: 'MM/DD/YYYY',
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
            
        }, typeof options === 'object' ? options : {});

        return this.each(function() {
            var $this = $(this),
                data = $this.data('datepicker');
            if (!data) {
                $this.data('datepicker', (data = new Datepicker(this, settings)));
            }
            if (typeof options === 'string') data[options](val);
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