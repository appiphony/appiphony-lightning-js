/* ------------------------------------------------------------
Appiphony Lightning JS Beta

Version: 2.0.0
Website: http://aljs.appiphony.com
GitHub: https://github.com/appiphony/appiphony-lightning-js
License: BSD 2-Clause License
------------------------------------------------------------ */
if (typeof jQuery === "undefined") { throw new Error("Appiphony Lightning JS requires jQuery") }

(function($) {
    if (typeof $.aljs === 'undefined') {
        $.aljs = {
            assetsLocation: '',
            scoped: true,
            scopingClass: 'slds-scope'
        };
        
        $.aljsInit = function(options) {
            $.aljs = options;
        }
    }
})(jQuery);
/* ------------------------------------------------------------
ALJS Datepicker
------------------------------------------------------------ */
if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }
if (typeof moment === "undefined") { throw new Error("The ALJS datepicker plugin requires moment.js") }

// Based on bootstrap-datepicker.js 


(function($) {
    var datepickerMenuMarkup = 
    '<div class="slds-datepicker slds-dropdown slds-dropdown--left" aria-hidden="false">' +
        '<div class="slds-datepicker__filter slds-grid">' +
            '<div class="slds-datepicker__filter--month slds-grid slds-grid--align-spread slds-grow">' +
                '<div class="slds-align-middle">' +
                    '<button id="aljs-prevButton" class="slds-button slds-button--icon-container">' +
                        '<svg aria-hidden="true" class="slds-button__icon slds-button__icon--small">' +
                            '<use xlink:href="{{assetsLocation}}/assets/icons/utility-sprite/svg/symbols.svg#left"></use>' +
                        '</svg>' +
                        '<span class="slds-assistive-text">Previous Month</span>' +
                    '</button>' +
                '</div>' +
                '<h2 id="aljs-month" class="slds-align-middle" aria-live="assertive" aria-atomic="true"></h2>' +
                '<div class="slds-align-middle">' +
                    '<button id="aljs-nextButton" class="slds-button slds-button--icon-container" title="Next Month">' +
                        '<svg aria-hidden="true" class="slds-button__icon">' +
                            '<use xlink:href="{{assetsLocation}}/assets/icons/utility-sprite/svg/symbols.svg#right"></use>' +
                        '</svg>' +
                        '<span class="slds-assistive-text">Next Month</span>' +
                    '</button>' +
                '</div>' +
            '</div>' +
            '<div class="slds-shrink-none">' +
                '<div class="slds-select_container">' + 
                '</div>' +
            '</div>' +
        '</div>';

    var datepickerTableMarkup = 
        '<table class="datepicker__month" role="grid" aria-labelledby="month">' +
            '<thead>' +
                '<tr id="weekdays">' +
                    '<th id="{{label0Full}}" scope="col">' +
                        '<abbr title="{{label0Full}}">{{label0Abbr}}</abbr>' +
                    '</th>' +
                    '<th id="{{label1Full}}" scope="col">' +
                        '<abbr title="{{label1Full}}">{{label1Abbr}}</abbr>' +
                    '</th>' +
                    '<th id="{{label2Full}}" scope="col">' +
                        '<abbr title="{{label2Full}}">{{label2Abbr}}</abbr>' +
                    '</th>' +
                    '<th id="{{label3Full}}" scope="col">' +
                        '<abbr title="{{label3Full}}">{{label3Abbr}}</abbr>' +
                    '</th>' +
                    '<th id="{{label4Full}}" scope="col">' +
                        '<abbr title="{{label4Full}}">{{label4Abbr}}</abbr>' +
                    '</th>' +
                    '<th id="{{label5Full}}" scope="col">' +
                        '<abbr title="{{label5Full}}">{{label5Abbr}}</abbr>' +
                    '</th>' +
                    '<th id="{{label6Full}}" scope="col">' +
                        '<abbr title="{{label6Full}}">{{label6Abbr}}</abbr>' +
                    '</th>' +
                '</tr>' +
            '</thead>' +
            '<tbody>' +
            '</tbody>' +
        '</table>' +
    '</div>';
    
    var todayLinkMarkup = 
      '<tr>' + 
        '<td colspan="7" role="gridcell" data-aljs-date="{{todaysDate}}"><a href="javascript:void(0);" class="slds-show--inline-block slds-p-bottom--x-small">{{todayLabel}}</a></td>' +
      '</tr>';

    var Datepicker = function(el, options) {
        this.$el = $(el);
        this.settings = options;
        
        var initDate = moment(options.initDate) || moment();
        var endDateId = options.endDateInputId;
        var labeledTableMarkup = datepickerTableMarkup;
        
        for (var i = 0; i < this.settings.dayLabels.length; i++) {
            var thisLabel = this.settings.dayLabels[i];
            var fullLabelExp = new RegExp('{{label' + i + 'Full}}', 'g');
            var abbrLabelExp = new RegExp('{{label' + i + 'Abbr}}', 'g');
            
            labeledTableMarkup = labeledTableMarkup.replace(fullLabelExp, thisLabel.full.toString())
                .replace(abbrLabelExp, thisLabel.abbr.toString());
        }
        
        this.$datepickerEl = $(datepickerMenuMarkup.replace(/{{assetsLocation}}/g, options.assetsLocation) + labeledTableMarkup);

        if (options.initDate) {
            this.setSelectedFullDate(initDate);
        }

        if (endDateId && $('#' + endDateId).length === 1) {
            this.$elEndDate = $('#' + endDateId);

            if (options.endDate) {
                this.setSelectedEndDate(options.endDate);
            }
        }
        
        this.initInteractivity();
    };

    Datepicker.prototype = {
        constructor: Datepicker,
        initInteractivity: function() {
            var self = this;
            var $datepickerEl = this.$datepickerEl;
            var $el = this.$el;
            var $elEndDate = this.$elEndDate || [];

            var openDatepicker = function(e) {
                e.stopPropagation();
                
                // Close other datepickers
                $('[data-aljs-datepicker-id]').each(function() {
                    $(this).data('datepicker').closeDatepicker();
                });

                if ((e.target === $el[0] && ($el.val() !== null && $el.val() !== '')) || (e.target === $elEndDate[0] && ($elEndDate.val() !== null && $elEndDate.val() !== ''))) {
                    self.$selectedInput = $(this).parent().find('input');
                    self.$selectedInput.on('keyup', self, self.processKeyup);
                    self.closeDatepicker();
                } else {
                    var initDate = self.selectedFullDate || moment();
                    self.viewedMonth = initDate.month();
                    self.viewedYear = initDate.year();
                    self.fillMonth();
                    self.$selectedInput = $(this).parent().find('input');
                    self.$selectedInput.off('keyup');
                    self.$selectedInput.closest('.slds-form-element').append($datepickerEl);
                    self.settings.onShow(self);
                    self.initYearDropdown();
                    $([$el, $datepickerEl, $elEndDate, $el.prev('svg')]).each(function() {
                        $(this).on('click', self.blockClose);
                    });         
                    $datepickerEl.on('click', self, self.processClick);
                    //self.$selectedInput.blur(); // Mimic Salesforce functionality
                    
                    $('body').on('click', self, self.closeDatepicker);
                }  
            };

            // Opening datepicker
            //$el.on('focus', openDatepicker); // Removed by request of the Salesforce design team
            $el.on('blur', self, self.processBlur);
            $el.on('click', openDatepicker);
            $($el.prev('svg')).on('click', openDatepicker);
            $el.prev('svg').css('cursor', 'pointer');

            if ($elEndDate.length > 0) {
                $elEndDate.on('blur', self, self.processBlur); // To do: fix this to pass in the correct end date datepicker
                $elEndDate.on('focus', openDatepicker);
                $elEndDate.prev('svg').on('click', openDatepicker);
                $elEndDate.prev('svg').css('cursor', 'pointer');
            }
        },
        closeDatepicker: function(e) {
            var self = this; 
            var $target = $('body');
            
            if (e) {
                self = e.data;
                $target = $(this);
            }

            var $datepickerEl = self.$datepickerEl;
            var $selectedInput = self.$selectedInput;

            if ($target.closest(self.$el.parent()).length === 0 && $selectedInput) {
                var $selectedDatepickerEl = $selectedInput.closest('.slds-form-element').find('.slds-datepicker');
                
                if ($selectedDatepickerEl.length > 0) {
                    self.settings.onDismiss(self);
                    $selectedInput.closest('.slds-form-element').find('.slds-datepicker').remove();
                }
                $('body').unbind('click', self.closeDatepicker);
                $datepickerEl.unbind('click', self.processClick);
            }
        },
        fillMonth: function() {
            var self = this;
            var dayLabels = this.settings.dayLabels;
            var monthArray = this.getMonthArray();
            var $monthTableBody = $('<tbody>');
            var isMultiSelect = this.$elEndDate && this.$elEndDate.length > 0;
            var selectedFullDate = this.selectedFullDate;
            var selectedEndDate = this.selectedEndDate;
            
            monthArray.forEach(function(rows) {
                var $weekRow = $('<tr>').appendTo($monthTableBody);
                
                if (rows.hasMultiRowSelection) {
                    $weekRow.addClass('slds-has-multi-row-selection');
                }

                rows.data.forEach(function(col, colIndex) {
                    var $dayCol = $('<td data-aljs-date="' + col.dateValue + '">').appendTo($weekRow);

                    $dayCol.prop({
                        headers: dayLabels[colIndex].full,
                        role: 'gridcell'
                    });

                    $('<span class="slds-day">' + col.value + '</span>').appendTo($dayCol);
                    
                    if (!col.isCurrentMonth) {
                        $dayCol.addClass('slds-disabled-text')
                            .attr('aria-disabled', 'true');
                    }

                    if (col.isSelected || col.isSelectedEndDate || col.isSelectedMulti) {// || 
                                //(!isMultiSelect && !selectedFullDate && col.isToday) ||
                                //(isMultiSelect && !selectedEndDate && col.isToday)) {
                        $dayCol.addClass(isMultiSelect ? 'slds-is-selected-multi slds-is-selected' : 'slds-is-selected')
                            .attr('aria-selected', 'true');
                    } else {
                        $dayCol.attr('aria-selected', 'false');
                    }

                    if (col.isToday) {
                        $dayCol.addClass('slds-is-today');
                    }

                });
            });
            
            // Today link
            $monthTableBody.append(todayLinkMarkup.replace(/{{todaysDate}}/g, this.getMMDDYYYY(moment().month() + 1, moment().date(), moment().year())).replace(/{{todayLabel}}/g, this.settings.todayLabel.toString()));

            this.$datepickerEl.find('tbody').replaceWith($monthTableBody);
            this.$datepickerEl.find('#aljs-month').text(this.settings.monthLabels[this.viewedMonth].full);
            this.$datepickerEl.find('#aljs-year').text(this.viewedYear);
        },
        initYearDropdown: function() {
            var self = this;
            var $yearSelect = this.$datepickerEl.find('select');
            var viewedYear = this.viewedYear;

            if ($yearSelect.length > 0) {
                $yearSelect.val(this.viewedYear);
            } else {
                //var $yearDropdown = $('<label><span class="assistiveText">year</span></label>')
                var $yearDropdown = $('<label></label>')

                $yearSelect = $('<select class="slds-select select picklist__label">').appendTo($yearDropdown);
                
                var currentYear = moment().year();

                for (var i = currentYear - this.settings.numYearsBefore; i <= currentYear + this.settings.numYearsAfter; i++) {
                    var $yearOption = $('<option value="' + i + '">' + i + '</option>').appendTo($yearSelect);
                }

                $yearSelect.val(viewedYear);

                this.$datepickerEl.find('.slds-select_container').append($yearDropdown);
            }

            $yearSelect.on('change', function(e) {
                self.viewedYear = parseInt($(e.target).val());
                self.fillMonth();
            });
            
        },
        getMMDDYYYY: function(month, date, year) {
            return (month > 9 ? month : '0' + month) + '/' + (date > 9 ? date : '0' + date) + '/' + year;
        },
        getMonthArray: function() {
            var self = this;
            var selectedFullDate = this.selectedFullDate;
            var selectedEndDate = this.selectedEndDate;
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
                var iDate = moment(new Date(previousMonth === 11 ? viewedYear - 1 : viewedYear, previousMonth, i));
                
                allDays.push({
                    value: i,
                    dateValue: this.getMMDDYYYY(previousMonth + 1, i, viewedYear),
                    isCurrentMonth: false,
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
                    isSelectedEndDate: selectedEndDate && iDate.isSame(selectedEndDate, 'day'),
                    isSelectedMulti: selectedFullDate && selectedEndDate && (iDate.isBetween(selectedFullDate, selectedEndDate) || iDate.isSame(selectedFullDate, 'day') || iDate.isSame(selectedEndDate, 'day')),
                    isToday: iDate.isSame(moment(), 'day')
                });
            }

            // Split array into rows of 7
            allDays.forEach(function(day, index, allDays) {
                if (index % 7 === 0) {
                    var hasMultiRowSelection = (index >= 7 && allDays[index - 1].isSelectedMulti && day.isSelectedMulti);
                    
                    if (hasMultiRowSelection) {
                        calendarRows[calendarRows.length - 1].hasMultiRowSelection = true;
                    }
                    calendarRows.push({
                        data: [],
                        hasMultiRowSelection: hasMultiRowSelection
                    });
                    
                }

                calendarRows[calendarRows.length - 1].data.push(day);
            });
            
            // Fill last row
            if (calendarRows[calendarRows.length - 1].data.length < 7) {
                var iDate = moment(new Date(nextMonth === 0 ? viewedYear + 1 : viewedYear, nextMonth, i));
                var numColsToFill = 7 - calendarRows[calendarRows.length - 1].data.length;
                for (var i = 1; i <= numColsToFill; i++) {
                    calendarRows[calendarRows.length - 1].data.push({
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
            var oldDate = this.selectedFullDate;

            this.selectedFullDate = selectedFullDate;
            
            if (selectedFullDate !== '' && selectedFullDate !== null && typeof selectedFullDate !== 'undefined') {
                this.$el.val(selectedFullDate.format(this.settings.format));
                
                if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1) { // Addresses bug where Safari does not clear out visible placeholders on first value update
                    this.$el.val(selectedFullDate.format(this.settings.format));     
                }
            } else {
                this.$el.val('');
            }

            if ((!oldDate && selectedFullDate != '') || (typeof(oldDate) === 'object' && !oldDate.isSame(selectedFullDate, 'day'))) {
                this.settings.onChange(this);
            }
        },
        setSelectedEndDate: function(selectedEndDate) {
            var oldDate = this.selectedEndDate;

            this.selectedEndDate = selectedEndDate;
            
            if (selectedEndDate !== '' && selectedEndDate !== null && typeof selectedEndDate !== 'undefined') {
                this.$elEndDate.val(selectedEndDate.format(this.settings.format));
                
                if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1) { // Addresses bug where Safari does not clear out visible placeholders on first value update
                    this.$elEndDate.val(selectedEndDate.format(this.settings.format));     
                }
            } else {
                this.$elEndDate.val('');
            }

            if ((!oldDate && selectedEndDate != '') || (typeof(oldDate) === 'object' && !oldDate.isSame(selectedEndDate, 'day'))) {
                this.settings.onChange(this);
            }
        },
        processClick: function(e) {
            e.preventDefault();
            var self = e.data;
            var $target = $(e.target);

            if ($target.closest('#aljs-prevButton').length > 0) {
                self.clickPrev(e);
            }

            if ($target.closest('#aljs-nextButton').length > 0) {
                self.clickNext(e);
            }

            if ($target.closest('td[data-aljs-date]').length > 0) {
                self.clickDate(e);
            }

            if ($target.closest('li[data-aljs-year]').length > 0) {
                self.clickYear(e);
            }
        },
        processKeyup: function(e) {
            if (e.keyCode === 13) { // Return key
                $(this).blur().off('keyup');
            }
        },
        processBlur: function(e) {
            if (e) {
                var self = e.data;
                
                if (self.$elEndDate && self.$elEndDate.length > 0 && self.$elEndDate[0] === self.$selectedInput[0]) { // Check if current input is for an end date
                    var selectedEndDate = self.$elEndDate.val();
                    var momentSelectedEndDate = moment(selectedEndDate, self.settings.format);
                    
                    if (momentSelectedEndDate.isValid()) {
                        self.setSelectedEndDate(momentSelectedEndDate);
                        self.closeDatepicker(e);
                        self.$selectedInput.off('keyup');
                    } else if (!selectedEndDate.length) {
                        self.setSelectedEndDate('');
                    }
                } else {
                    var selectedFullDate = self.$el.val();
                    var momentSelectedFullDate = moment(selectedFullDate, self.settings.format);
                    
                    if (momentSelectedFullDate.isValid()) {
                        self.setSelectedFullDate(momentSelectedFullDate);
                        self.closeDatepicker(e);
                        self.$selectedInput.off('keyup');
                    } else if (!selectedFullDate.length) {
                        self.setSelectedFullDate('');
                    }
                }
            }  
        },
        clickPrev: function(e) {
            var self = e.data;
            var currentYear = moment().year();
            
            if (self.viewedMonth === 0) {
                self.viewedMonth = 11;
                
                if (self.viewedYear === (currentYear - self.settings.numYearsBefore)) { // Allow looping
                    self.viewedYear = currentYear + self.settings.numYearsAfter;
                    self.$datepickerEl.find('.slds-select option:selected')
                        .prop('selected', false);
                    self.$datepickerEl.find('.slds-select option')
                        .last()
                        .prop('selected', 'selected');
                } else {
                    self.viewedYear--;
                    self.$datepickerEl.find('.slds-select option:selected')
                        .prop('selected', false)
                        .prev()
                        .prop('selected', 'selected');
                }
            } else {
                self.viewedMonth--;
            }
            
            self.fillMonth();
        },
        clickNext: function(e) {
            var self = e.data;
            var currentYear = moment().year();
            
            if (self.viewedMonth === 11) {
                self.viewedMonth = 0;
                
                if (self.viewedYear === (currentYear + self.settings.numYearsAfter)) { // Allow looping
                    self.viewedYear = currentYear - self.settings.numYearsBefore;
                    self.$datepickerEl.find('.slds-select option:selected')
                        .prop('selected', false);
                    self.$datepickerEl.find('.slds-select option')
                        .first()
                        .prop('selected', 'selected');
                } else {
                    self.viewedYear++;
                    self.$datepickerEl.find('.slds-select option:selected')
                        .prop('selected', false)
                        .next()
                        .prop('selected', 'selected');
                }
            } else {
                self.viewedMonth++;
            }
            
            self.fillMonth();
        },
        clickYear: function(e) {
            var self = e.data;
            
            var $clickedYear = $(e.target).closest('li[data-aljs-year]');
            self.viewedYear = parseInt($clickedYear.data('aljs-year'));
            self.fillMonth();
        },
        clickYearDropdown: function(e) {
            var self = e.data;

            if (self.$datepickerEl.find('#aljs-yearDropdown').length > 0) {
                self.hideYearDropdown();
            } else {
                self.showYearDropdown();
            }
        },
        clickDate: function(e) {
            var self = e.data;
            var $clickedDate = $(e.target).closest('td[data-aljs-date]');

            if (!($clickedDate.hasClass('slds-disabled-text'))) {
                var selectedDate = $clickedDate.data('aljs-date');

                if (self.$elEndDate && self.$elEndDate.length > 0 && self.$elEndDate[0] === self.$selectedInput[0]) {
                    self.setSelectedEndDate(moment(selectedDate, 'MM/DD/YYYY'));
                } else {
                    self.setSelectedFullDate(moment(selectedDate, 'MM/DD/YYYY'));
                }
                
                self.settings.onSelect(self, moment(selectedDate, 'MM/DD/YYYY'));
                self.closeDatepicker(e);
            }     
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
        },
        getEndDate: function(format) {
            if (this.$elEndDate && this.selectedEndDate) {
                return format ? this.selectedEndDate.format(format) : this.selectedEndDate;
            }
        },
        setEndDate: function(date) {
            if (this.$elEndDate) {
                this.setSelectedEndDate(moment(date));
            }
        } 
    };

    $.fn.datepicker = function(options, val) {
        var internalReturn;
        var settings = $.extend({
            // These are the defaults
            assetsLocation: $.aljs.assetsLocation,
            numYearsBefore: 50,
            numYearsAfter: 10,
            format: 'MM/DD/YYYY',
            endDateInputId: null,
            onChange: function(datepicker) {},
            onShow: function(datepicker) {},
            onDismiss: function(datepicker) {},
            onSelect: function(datepicker, selectedDate) {},
            dayLabels: [
                {
                    full: 'Sunday',
                    abbr: 'Sun'
                },
                {
                    full: 'Monday',
                    abbr: 'Mon'
                },
                {
                    full: 'Tuesday',
                    abbr: 'Tue'
                },
                {
                    full: 'Wednesday',
                    abbr: 'Wed'
                },
                {
                    full: 'Thursday',
                    abbr: 'Thu'
                },
                {
                    full: 'Friday',
                    abbr: 'Fri'
                },
                {
                    full: 'Saturday',
                    abbr: 'Sat'
                }
            ],
            monthLabels: [
                {
                    full: 'January',
                    abbr: ''
                },
                {
                    full: 'February',
                    abbr: ''
                },
                {
                    full: 'March',
                    abbr: ''
                },
                {
                    full: 'April',
                    abbr: ''
                },
                {
                    full: 'May',
                    abbr: ''
                },
                {
                    full: 'June',
                    abbr: ''
                },
                {
                    full: 'July',
                    abbr: ''
                },
                {
                    full: 'August',
                    abbr: ''
                },
                {
                    full: 'September',
                    abbr: ''
                },
                {
                    full: 'October',
                    abbr: ''
                },
                {
                    full: 'November',
                    abbr: ''
                },
                {
                    full: 'December',
                    abbr: ''
                }
            ],
            todayLabel: 'Today'
        }, typeof options === 'object' ? options : {});

        this.each(function() {
            var $this = $(this),
                data = $this.data('datepicker');

            if (!data) {
                var datepickerData = new Datepicker(this, settings);
                $this.data('datepicker', (data = datepickerData));
                $this.attr('data-aljs-datepicker-id', $this.attr('id'));
            }

            if (typeof options === 'string') {
                internalReturn = data[options](val);
            }
        });

        if (internalReturn === undefined || internalReturn instanceof Datepicker) {
            return this;
        }

        if (this.length > 1) {
            throw new Error('Usage only allowed for the collection of a single element (' + option + ' function)');
        } else {
            return internalReturn;
        }
    };
})(jQuery);
/* ------------------------------------------------------------
ALJS Icon Group
------------------------------------------------------------ */
if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {
    $.fn.iconGroup = function(options) {
        var iconGroupObj = {};
        var isSelected = 'slds-is-selected';
        var notSelected = 'slds-not-selected';
        
        iconGroupObj.settings = $.extend({
            type: 'sort',
            defaultButtonId: '',
            onChange: function(obj) { console.log(obj); },
            assetsLocation: $.aljs.assetsLocation
            // These are the defaults
        }, options);
        
        function select(button) {
            button.removeClass(notSelected)
                .addClass(isSelected)
                .trigger('selected.aljs.button'); // Custom aljs event
        }
        
        function deselect(button) {
            button.removeClass(isSelected)
                .addClass(notSelected)
                .trigger('deselected.aljs.button'); // Custom aljs event
        }
        
        if (typeof options !== 'string') { // If initializing plugin with options
            iconGroupObj.buttons = $('.slds-button', this);
            iconGroupObj.defaultIcon = (iconGroupObj.settings.defaultButtonId === '') ? iconGroupObj.buttons.eq(0) : '#' + iconGroupObj.settings.defaultButtonId;
            
            if (iconGroupObj.settings.type === 'sort') {
                select($(iconGroupObj.defaultIcon));
            }
            
            iconGroupObj.buttons.click(function() {
                iconGroupObj.target = $(this);
                iconGroupObj.targetId = iconGroupObj.target.attr('id');
                
                if (iconGroupObj.target.hasClass(isSelected) && (iconGroupObj.settings.type === 'toggle' || iconGroupObj.settings.type === 'switch')) {
                    deselect(iconGroupObj.target);
                    iconGroupObj.settings.onChange();
                } else if (iconGroupObj.target.hasClass(notSelected) && iconGroupObj.settings.type === 'toggle') {
                    select(iconGroupObj.target);
                    iconGroupObj.settings.onChange();
                } else if (iconGroupObj.target.hasClass(notSelected) && (iconGroupObj.settings.type === 'switch' || iconGroupObj.settings.type === 'sort')) {
                    iconGroupObj.buttons.each(function() {
                        if ($(this) !== iconGroupObj.target && $(this).hasClass(isSelected)) deselect($(this));
                    });
                    
                    select(iconGroupObj.target);
                    iconGroupObj.settings.onChange(iconGroupObj);
                }
            });
            
            return this;
        } else if (typeof options === 'string') { // If calling a method
            return this.each(function() {
                switch(options) {
                    case 'select':
                        select($(this));
                        break;
                        
                    case 'deselect':
                        deselect($(this));
                        break;
                        
                    default:
                        console.error('The method you entered does not exist');
                }
            });
        } else {
            throw new Error("This plugin can only be run with a selector, or with a command")
        }
    }
}(jQuery));
/* ------------------------------------------------------------
ALJS Lookup
------------------------------------------------------------ */
if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {
	var selectContainerMarkup = '<div class="slds-pill_container slds-hide"></div>';
    
	var pillMarkup = 
    	'<span class="slds-pill slds-size--1-of-1">' +
      		'<span class="slds-icon_container slds-icon-standard-account slds-pill__icon_container{{hasIcon}}" title="{{objectLabel}}">' +
        		'<svg aria-hidden="true" class="{{objectIconClass}} slds-icon slds-pill__icon">' +
          			'<use xlink:href="{{objectIconUrl}}"></use>' +
        		'</svg>' +
                '<span class="slds-assistive-text">{{objectLabel}}</span>' + 
            '</span>' +
            '<span class="slds-pill__label" title="{{selectedResultLabel}}">{{selectedResultLabel}}</span>' +
            '<button class="slds-button slds-button--icon-bare slds-pill__remove">' +
                '<svg aria-hidden="true" class="slds-button__icon">' +
                    '<use xlink:href="{{assetsLocation}}/assets/icons/utility-sprite/svg/symbols.svg#close"></use>' +
                '</svg>' +
                '<span class="slds-assistive-text">Remove</span>' +
            '</button>' +
    	'</span>';

	var customPillMarkup = 
    	'<span class="slds-pill slds-size--1-of-1">' +
      		'<span class="slds-icon_container slds-icon-standard-account slds-pill__icon_container{{hasIcon}}" title="{{objectLabel}}">' +
                '<img class="{{objectIconClass}} slds-icon slds-pill__icon" src="{{objectLabel}}"/>' +
                '<span class="slds-assistive-text">{{objectLabel}}</span>' + 
            '</span>' +
            '<span class="slds-pill__label" title="{{selectedResultLabel}}">{{selectedResultLabel}}</span>' +
            '<button class="slds-button slds-button--icon-bare slds-pill__remove">' +
                '<svg aria-hidden="true" class="slds-button__icon">' +
                    '<use xlink:href="{{assetsLocation}}/assets/icons/utility-sprite/svg/symbols.svg#close"></use>' +
                '</svg>' +
                '<span class="slds-assistive-text">Remove</span>' +
            '</button>' +
    	'</span>';

	var lookupSearchContainerMarkup = 
		'<div class="slds-lookup__menu">' +
			'<ul class="slds-lookup__list" role="listbox">' +
			'</ul>' +
		'</div>';

	var searchMarkup = 
		'<li role="presentation">' +
			'<span class="slds-lookup__item-action slds-lookup__item-action--label" role="option" tabindex="1">' +
				'<svg aria-hidden="true" class="slds-icon slds-icon--x-small slds-icon-text-default">' +
					'<use xlink:href="{{assetsLocation}}/assets/icons/utility-sprite/svg/symbols.svg#search"></use>' +
				'</svg>' +
                '<span class="slds-truncate">&quot;{{searchTerm}}&quot; in {{objectPluralLabel}}</span>' +
			'</span>' +
		'</li>';
    
    var recentMarkup = '<div class="slds-lookup__item--label slds-text-body--small">{{recentLabel}}</div>';

	var newItemMarkup = 
		'<li role="presentation">' +
			'<span class="slds-lookup__item-action slds-lookup__item-action--label" role="option" tabindex="1">' +
				'<svg aria-hidden="true" class="slds-icon slds-icon--x-small slds-icon-text-default">' +
					'<use xlink:href="{{assetsLocation}}/assets/icons/utility-sprite/svg/symbols.svg#add"></use>' +
				'</svg>' +
                '<span class="slds-truncate">New {{objectLabel}}</span>' +
			'</span>' +
		'</li>';

	var lookupResultItemMarkup = 
		'<li role="presentation">' +
			'<span class="slds-lookup__item-action slds-media" id="{{resultId}}" role="option" tabindex="1">' +
				'<svg aria-hidden="true" class="{{objectIconClass}} slds-icon slds-icon--small slds-media__figure{{hasIcon}}">' +
					'<use xlink:href="{{objectIconUrl}}"></use>' +
				'</svg>' +
                '<div class="slds-media__body">' +
                    '<div class="slds-lookup__result-text">{{resultLabel}}</div>' +
                    '{{metaLabel}}' +
                '</div>' +
			'</span>' +
		'</li>';

	var customLookupResultItemMarkup = 
		'<li role="presentation">' +
			'<span class="slds-lookup__item-action slds-media" id="{{resultId}}" role="option" tabindex="1">' +
                '<img class="{{objectIconClass}} slds-icon slds-icon--small slds-media__figure{{hasIcon}}" src="{{objectIconUrl}}"/>' +
                '<div class="slds-media__body">' +
                    '<div class="slds-lookup__result-text">{{resultLabel}}</div>' +
                    '{{metaLabel}}' +
                '</div>' +
			'</span>' +
		'</li>';
    
	var searchTimer;
    
    var Lookup = function(el, options) {
        this.$el = $(el);
        this.$lookupContainer = this.$el.closest('.slds-lookup');
        this.isSingle = this.$lookupContainer.data('select') === 'single';
        this.settings = options;
       
       	if (this.isSingle) {
       		this.$singleSelect = $(selectContainerMarkup).insertBefore(this.$el);
       	} else {
       		this.$multiSelect = $(selectContainerMarkup).insertAfter(this.$lookupContainer.find('.slds-form-element__label'));
       		this.selectedResults = []; // We'll have to initialize.
            
            this.$multiSelect.css({
                'padding': 0,
                'margin-top': '-2px',
                'margin-left': '-2px',
                'border': 'none'
            });
       	}
        
        if (!this.isStringEmpty(options.searchTerm)) {
    		this.$el.val(options.searchTerm);
    		this.setSingleSelect();
    	} else if (options.initialSelection) {
    		this.setSelection(options.initialSelection);
    	}
        
        this.initLookup();
    };
    
    var handleResultsKeyup = function(e) {
        var $currentTarget = $(e.currentTarget);
        
        $currentTarget.removeClass('slds-has-focus');
        
        if (e.which === 38 || e.which === 40) { // Up or down arrow, respectively
            e.preventDefault();
            
            var firstItemSelector = ($('.slds-lookup .slds-lookup__list > li:first-child').is('.slds-lookup__item--label')) ? '.slds-lookup .slds-lookup__list > li:nth-child(2) .slds-lookup__item-action' : '.slds-lookup .slds-lookup__list > li:first-child .slds-lookup__item-action';
            
            if (e.which === 38) { // Up arrow
                if ($currentTarget.is(firstItemSelector)) { // Pressing up on the first item, loop over
                    $('.slds-lookup .slds-lookup__list > li:last-child .slds-lookup__item-action')
                        .focus()
                        .addClass('slds-has-focus');
                } else {
                    $currentTarget.closest('li')
                        .prev()
                        .find('.slds-lookup__item-action')
                        .focus()
                        .addClass('slds-has-focus');
                }
            } else { // Down arrow
                if ($currentTarget.is('.slds-lookup .slds-lookup__list > li:last-child .slds-lookup__item-action')) { // Pressing down on the last item, loop over
                    $(firstItemSelector)
                        .focus()
                        .addClass('slds-has-focus');
                } else {
                    $currentTarget.closest('li')
                        .next()
                        .find('.slds-lookup__item-action')
                        .focus()
                        .addClass('slds-has-focus');
                }
            }
        } else if (e.which === 13) { // Return key
            $currentTarget.click();
        }
    }
    
    Lookup.prototype = {
        constructor: Lookup,
        isStringEmpty: function(stringVal) {
        	return stringVal === null || typeof stringVal === 'undefined' || stringVal.trim() === '';
        },
        initLookup: function() {
        	var self = this;

        	this.$el.on('focus', this, this.runSearch)
                .on('blur', this, this.handleBlur)
                .on('keyup', this, this.handleKeyup);
            
            // Prevent multiple bindings
            $('body').off('keyup', '.slds-lookup .slds-lookup__list .slds-lookup__item-action', handleResultsKeyup);
            $('body').on('keyup', '.slds-lookup .slds-lookup__list .slds-lookup__item-action', handleResultsKeyup);
        },
        handleKeyup: function(e) {
            if (e.which === 40) { // Down arrow
                $('.slds-lookup .slds-lookup__list .slds-lookup__item-action').first()
                    .focus()
                    .addClass('slds-has-focus');
            } else {
                e.data.runSearch(e);
            }
        },
        runSearch: function(e) {
            var self = e.data;
            
            if (searchTimer) {
                if (self.settings.showDebugLog) console.log ('Cancelling search ', searchTimer);
                
                clearTimeout(searchTimer);
            }
            
            searchTimer = setTimeout(function() {
                var searchTerm = self.$el.val();
                if (!self.isStringEmpty(searchTerm)) {
                    self.getSearchTermResults(searchTerm);
                } else {
                    self.getDefaultResults();
                }
            }, self.settings.searchDelay);
        },
        setMultiSelect: function(selectedResults) {
        	var self = this;
        	var $multiSelect = this.$multiSelect.html('');
        	var $lookupContainer = this.$lookupContainer;
            var conditionalPillMarkup = (self.settings.useImgTag) ? customPillMarkup : pillMarkup;
            
        	if (selectedResults.length > 0) {
        		selectedResults.forEach(function(result) {
        			var $pill = $(conditionalPillMarkup.replace('{{objectIconUrl}}', self.settings.objectIconUrl)
                        .replace('{{objectIconClass}}', self.settings.objectIconClass)
                        .replace('{{hasIcon}}', (self.settings.objectIconUrl !== '') ? '' : ' slds-hide')
                        .replace('{{assetsLocation}}', self.settings.assetsLocation)
                        .replace(/{{objectLabel}}/g, self.settings.objectLabel)
                        .replace(/{{selectedResultLabel}}/g, result.label));
                    
        			$pill.removeClass('slds-size--1-of-1')
                        .attr('id', result.id)
                        .on('click', 'a, button', self, self.clearMultiSelectResult)
                        .css({
                            'margin': '2px',
                            'display': 'inline-flex'
                        })
                        .find('.slds-pill__remove')
                        .css({
                            'vertical-align': '1px',
                            'margin-left': '0.25rem'
                        });
                    
        			$multiSelect.append($pill);
        		});
                
        		$multiSelect.addClass('slds-show')
                    .removeClass('slds-hide');
        	} else {
        		$multiSelect.html('');
        		$multiSelect.addClass('slds-hide')
                    .removeClass('slds-show');
        	}
        },
        setSingleSelect: function(selectedResultLabel) {
        	var self = this;
        	var newResultLabel = selectedResultLabel || '';
            var conditionalPillMarkup = (self.settings.useImgTag) ? customPillMarkup : pillMarkup;
            
        	this.$singleSelect.html(conditionalPillMarkup.replace('{{objectIconUrl}}', this.settings.objectIconUrl)
                .replace('{{objectIconClass}}', self.settings.objectIconClass)
                .replace('{{hasIcon}}', (self.settings.objectIconUrl !== '') ? '' : ' slds-hide')
                .replace('{{assetsLocation}}', this.settings.assetsLocation)
                .replace(/{{objectLabel}}/g, self.settings.objectLabel)
                .replace(/{{selectedResultLabel}}/g, newResultLabel));
            
        	if (selectedResultLabel) {
        		this.$singleSelect.addClass('slds-show')
                    .removeClass('slds-hide');
                
    			this.$el.addClass('slds-hide')
        		this.$lookupContainer.addClass('slds-has-selection');
                
        		this.$singleSelect.one('click', 'button', this, this.clearSingleSelect);//'a, button', this, this.clearSingleSelect);
        	} else {
        		this.$singleSelect.addClass('slds-hide')
                    .removeClass('slds-show');
                
        		this.$el.val('')
        			.removeClass('slds-hide');
                
        		this.$lookupContainer.removeClass('slds-has-selection');
                
        		setTimeout(function() {
        			self.$el.focus();
        		}, 100);
        	}
        },
        getSearchTermResults: function(searchTerm) {
        	var self = this;
            
        	if (this.settings.items.length > 0) {
        		this.searchResults = this.settings.items.filter(function(item) {
        			return item.label.toLowerCase().match(searchTerm.toLowerCase()) !== null;
        		});
        		this.renderSearchResults();
        	} else { 
	        	var callback = function(searchResults) {
	        		self.searchResults = searchResults;
	        		self.renderSearchResults();
	        	};
                
	        	this.settings.filledSearchTermQuery(searchTerm, callback);
	        }
        },
        getDefaultResults: function() {
        	var self = this;
            
        	if (this.settings.items.length > 0) {
        		this.searchResults = this.settings.items;
        		this.renderSearchResults();
        	} else { 
        		var callback = function(searchResults) {
        			self.searchResults = searchResults;
        			self.renderSearchResults();
        		};
                
        		this.settings.emptySearchTermQuery(callback);
        	}
        },
        renderSearchResults: function() {
        	this.closeSearchDropdown();
            
        	var $lookupSearchContainer = $(lookupSearchContainerMarkup);
        	var $resultsListContainer = $lookupSearchContainer.find('ul.slds-lookup__list');
        	var searchTerm = this.$el.val();
            var regexSearchTerm = new RegExp('(' + searchTerm + ')', 'gi');
        	var self = this;
            var showUseSection = false;
            
        	if (!self.isStringEmpty(searchTerm) && searchTerm.length) {
                if (self.settings.showSearch) {
                    showUseSection = true;
                    
                    $resultsListContainer.prepend(searchMarkup.replace('{{searchTerm}}', searchTerm)
                        .replace('{{objectPluralLabel}}', self.settings.objectPluralLabel)
                        .replace('{{assetsLocation}}', $.aljs.assetsLocation));
                }
        	} else {
                if (self.settings.recentLabel) {
                    $resultsListContainer.before(recentMarkup.replace('{{recentLabel}}', self.settings.recentLabel));
                }
            }
            
        	this.searchResults.forEach(function(result) {
        		var $lookupResultItem;
                var conditionalLookupMarkup = (self.settings.useImgTag) ? customLookupResultItemMarkup : lookupResultItemMarkup;
                var markedResultLabel = result.label.replace(regexSearchTerm, '<mark>$1</mark>');
                
        		if (self.isSingle) {
        			$lookupResultItem = $resultsListContainer.append(conditionalLookupMarkup.replace('{{resultLabel}}', markedResultLabel)
                        .replace('{{hasIcon}}', (self.settings.objectIconUrl !== '') ? '' : ' slds-hide')
                        .replace('{{resultId}}', result.id)
                        .replace('{{objectIconUrl}}', self.settings.objectIconUrl)
                        .replace('{{objectIconClass}}', self.settings.objectIconClass)
                        .replace('{{metaLabel}}', (result.metaLabel) ? '<span class="slds-lookup__result-meta slds-text-body--small">' + result.metaLabel + '</span>' : ''));
        		} else if (self.selectedResults) {
        			var selectedResultsIds = self.selectedResults.map(function(result) { return result.id; });
                    
        			if (selectedResultsIds.length === 0 || selectedResultsIds.indexOf(result.id) === -1) {
        				$lookupResultItem = $resultsListContainer.append(conditionalLookupMarkup.replace('{{resultLabel}}', markedResultLabel)
                            .replace('{{hasIcon}}', (self.settings.objectIconUrl !== '') ? '' : ' slds-hide')
                            .replace('{{resultId}}', result.id)
                            .replace('{{objectIconUrl}}', self.settings.objectIconUrl)
                            .replace('{{objectIconClass}}', self.settings.objectIconClass)
                            .replace('{{metaLabel}}', (result.metaLabel) ? '<span class="slds-lookup__result-meta slds-text-body--small">' + result.metaLabel + '</span>' : ''));
        			}
        		}
                
        		if ($lookupResultItem) {
        			$lookupResultItem.find('.slds-lookup__item-action[id]').on('focus', function() {
	        			self.$el.attr('aria-activedescendant', $(this).attr('id'));
	        		}).on('blur', self, self.handleBlur);
        		}
        	});
            
        	if (this.settings.onClickNew) {
        		var $newItem = $resultsListContainer.append(newItemMarkup
                    .replace('{{objectLabel}}', this.settings.objectLabel)
                    .replace('{{assetsLocation}}', $.aljs.assetsLocation));
                
                $newItem.next().on('click', function() {
                    $newItem.off('click');
                    
                    self.settings.onClickNew();
                });
        	}
            
        	$resultsListContainer.one('click', '.slds-lookup__item-action[id]', this, this.clickResult)
            
            this.$lookupSearchContainer = $lookupSearchContainer.appendTo(this.$lookupContainer);
            
            var shouldShowSearchContainer = (this.searchResults.length > 0 && this.$el.closest('.slds-form-element').find('.slds-lookup__list > li').length > 0) || this.settings.onClickNew || showUseSection;
            
            if (shouldShowSearchContainer) {
                this.$el.attr('aria-expanded', 'true')
                    .closest('.slds-lookup')
                    .addClass('slds-is-open');
            } else {
                this.$lookupSearchContainer.remove();
            }
        },
        closeSearchDropdown: function() {
        	if (this.$lookupSearchContainer) {
        		this.$lookupSearchContainer.remove();
        		this.$lookupSearchContainer = null;
        	}
            
            this.$el.attr('aria-expanded', 'false')
                .attr('aria-activedescendant', null)
                .closest('.slds-lookup')
                .removeClass('slds-is-open');
        },
        handleBlur: function(e) {
        	var self = e.data;
            
            if ($(e.relatedTarget).closest('.slds-lookup.slds-is-open').length === 0 && self.$lookupSearchContainer) {
                self.closeSearchDropdown();
            }
        },
        clickResult: function(e) {
        	var self = e.data;
        	var selectedId = $(this).attr('id');
            
        	self.selectResult(selectedId);
        },
        selectResult: function(selectedId) {
        	var selectedResultArray = this.searchResults.filter(function(result) {
        		return result.id == selectedId;
        	});
            
        	this.closeSearchDropdown();
            
        	if (this.isSingle) {
        		this.selectedResult = selectedResultArray.length > 0 ? selectedResultArray[0] : null;
        		this.setSingleSelect(this.selectedResult.label);
                this.settings.onChange(this.selectedResult, true);
        	} else {
                if (selectedResultArray.length > 0) {
                    this.selectedResults.push(selectedResultArray[0]);
                    this.setMultiSelect(this.selectedResults);
                    this.$el.val('');
                }
                
                this.settings.onChange(this.selectedResults, true);
        	}
        },
        clearSingleSelect: function(e) {
        	var self = e.data;
            self.selectedResult = null;
        	self.setSingleSelect();
            
            self.settings.onChange(self.selectedResult, false);
        },
        clearMultiSelectResult: function(e) {
        	var self = e.data;
        	var $clickedPill = $(this).closest('span.slds-pill');
        	var resultId = $clickedPill.attr('id');
        	var indexToRemove;
            
            self.closeSearchDropdown();
            
        	self.selectedResults.forEach(function(result, index) {
        		if (result.id == resultId) {
        			indexToRemove = index;
        		}
        	});
            
        	if (typeof indexToRemove !== 'undefined' && indexToRemove !== null) {
        		self.selectedResults.splice(indexToRemove, 1);
        		self.setMultiSelect(self.selectedResults);
                
                self.settings.onChange(self.selectedResults, false);
        	}
        },
        getSelection: function() {
            if (this.isSingle) {
                return this.selectedResult || null;
            } else {
                return this.selectedResults || null;
            }
        },
        setSelection: function(selection) {
            var self = this;
            
            if (selection && typeof selection === 'object') {
                if ($.isEmptyObject(selection)) {
                    if (self.isSingle) {
                        self.selectedResult = null;
                        self.setSingleSelect();
                        self.settings.onChange(self.selectedResult, false);
                    } else {
                        self.selectedResults = [];
                        self.setMultiSelect(self.selectedResults);
                        self.settings.onChange(self.selectedResults, false);
                    }
                } else {
                    if (selection instanceof Array) {
                        this.searchResults = selection;
                        this.selectedResults = [];
                        
                        selection.forEach(function(s) {
                            self.selectResult(s.id);
                        });
                    } else {
                        this.selectedResult = null;
                        this.searchResults = [selection];
                        self.selectResult(selection.id);
                    }
                }
            } else {
                throw new Error('setSelection must be called with either a valid result object or an array of result objects.')
            }
        }
    };
    
    $.fn.lookup = function(options) {
        var lookupArguments = arguments;
        var internalReturn;
       // var arguments = arguments;
        
        var settings = $.extend({
            // These are the defaults
            assetsLocation: $.aljs.assetsLocation,
            objectPluralLabel: 'Objects',
            objectLabel: 'Object',
            useImgTag: false,
            objectIconUrl: $.aljs.assetsLocation + '/assets/icons/standard-sprite/svg/symbols.svg#account',
            objectIconClass: 'slds-icon-standard-account',
            searchTerm: '',
            items: [],
            emptySearchTermQuery: function (callback) { callback([]); },
            filledSearchTermQuery: function (searchTerm, callback) { callback([]); },
            onClickNew: null,
            onChange: function() {},
            initialSelection: null,
            recentLabel: 'Recent Objects',
            showSearch: false,
            searchDelay: 500
        }, typeof options === 'object' ? options : {});
        
        this.each(function() {
            var $this = $(this),
                data = $this.data('aljs-lookup');
            
            if (!data) {
                var lookupData = new Lookup(this, settings);
                $this.data('aljs-lookup', (data = lookupData));
            }
            
            if (typeof options === 'string') {
                internalReturn = data[options](lookupArguments[1], lookupArguments[2]);
            }
        });
        
        if (internalReturn === undefined || internalReturn instanceof Lookup) {
            return this;
        }
        
        if (this.length > 1) {
            throw new Error('Using only allowed for the collection of a single element (' + option + ' function)');
        } else {
            return internalReturn;
        }
    }
}(jQuery));

/* ------------------------------------------------------------
ALJS Modal
------------------------------------------------------------ */
if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {
    var aljsBodyTag = 'body';
    var aljsModals = $('.slds-modal');
    var aljsRefocusTarget = null; // Element to refocus on modal dismiss
    var isShowing, aljsScope;
    
    function initModals() {        
        aljsScope = ($.aljs.scoped) ? (typeof($.aljs.scopingClass) === 'string') ? '.' + $.aljs.scopingClass : '.slds-scope' :  aljsBodyTag;
        
        $('.slds-backdrop').remove(); // Remove any existing backdrops
        $(aljsScope).append('<div class="aljs-modal-container"></div>');
        
        var modalContainer = $('.aljs-modal-container');
        
        aljsModals.appendTo(modalContainer)
            .append('<div class="slds-backdrop"></div>')
            .attr('aria-hidden', 'true')
            .addClass('slds-hide');
    }
    
    function showModal(obj, args) {
        var modalId = obj.data('aljs-show');
        var targetModal = $('#' + modalId);
        
        if (modalId === undefined) console.error('No "data-aljs-show" attribute has been set');
        else {
            targetModal.modal('show', args);
            obj.blur();
            aljsRefocusTarget = obj;
        }
    }
    
    $.fn.modal = function(args, options) {
        var modalObj = {};
        modalObj.$el = this;
        modalObj.hasSelector = (args && args.hasOwnProperty('selector')) ? true : false;
        
        if (args !== null && typeof args === 'string') { // If calling a method
            var settings = $.extend({
                    selector: null,
                    dismissSelector: '[data-aljs-dismiss="modal"]',
                    backdropDismiss: false,
                    onShow: function(obj) {},
                    onShown: function(obj) {},
                    onDismiss: function(obj) {},
                    onDismissed: function(obj) {}
                    // These are the defaults
                }, options);
            var dismissModalElement = $(settings.dismissSelector);
            var modalElements = $('.slds-modal__header, .slds-modal__content, .slds-modal__footer');
            
            function processKeyup(e) {
                if (e.which == 27 && aljsModals.is(':visible')) dismissModal(); // Esc key
            }
            
            function dismissModal() {
                modalObj.$el.modal('dismiss', settings)
                    .unbind('click');
                aljsModals.unbind('click');
                dismissModalElement.unbind('click');
                $(aljsBodyTag).unbind('keyup', processKeyup);
            }
            
            switch (args) {
                case 'show':
                    isShowing = true;

                    modalObj.id = this.attr('id');
                    
                    // Close existing modals
                    $('.slds-modal').removeClass('slds-fade-in-open slds-show')
                                    .addClass('slds-hide')
                                    .attr('aria-hidden', 'true')
                                    .attr('tabindex', -1);

                    $('.slds-backdrop').remove(); // Remove any existing backdrops
                    $('.aljs-modal-container').append('<div class="slds-backdrop"></div>');
                    
                    modalObj.$el.addClass('slds-show')
                        .removeClass('slds-hide')
                        .attr('aria-hidden', 'false')
                        .attr('tabindex', 1);
                    
                    setTimeout(function() { // Ensure elements are displayed and rendered before adding classes
                        var backdrop = $('.slds-backdrop');
                        var handleTransitionEnd = function() {
                            modalObj.$el.trigger('shown.aljs.modal'); // Custom aljs event
                            settings.onShown(modalObj);
                            isShowing = false;
                            $(aljsBodyTag).unbind('keyup', processKeyup)
                                .bind('keyup', processKeyup);
                            
                            dismissModalElement.click(function(e) { // Bind events based on options
                                e.preventDefault();
                                dismissModal();
                            });
                            
                            if (settings.backdropDismiss) {
                                aljsModals.click(dismissModal);
                                modalElements.click(function(e) { e.stopPropagation(); });
                            }
                        };
                        
                        backdrop.one('transitionend', handleTransitionEnd)
                            .addClass('slds-backdrop--open');
                        modalObj.$el.addClass('slds-fade-in-open')
                            .trigger('show.aljs.modal'); // Custom aljs event
                        settings.onShow(modalObj);
                    }, 25);
                    break;
                    
                case 'dismiss':
                    if (!isShowing) {
                        var backdrop = $('.slds-backdrop');
                        var handleTransitionEnd = function() {
                            if (!isShowing) backdrop.remove();
                            
                            aljsRefocusTarget = null;
                            modalObj.$el.addClass('slds-hide')
                                .removeClass('slds-show')
                                .trigger('dismissed.aljs.modal'); // Custom aljs event
                            settings.onDismissed(modalObj);
                        };
                        
                        backdrop.one('transitionend', handleTransitionEnd)
                            .removeClass('slds-backdrop--open');
                    }
                    
                    settings.onDismiss(modalObj);
                    modalObj.$el.removeClass('slds-fade-in-open')
                        .attr('aria-hidden', 'true')
                        .attr('tabindex', -1);
                    
                    if (aljsRefocusTarget !== null) aljsRefocusTarget.focus();
                    
                    modalObj.$el.trigger('dismiss.aljs.modal'); // Custom aljs event
                    break;
                    
                case 'trigger':
                    var modalId = modalObj.$el.data('aljs-show');
                    var targetModal = $('#' + modalId);
                    
                    targetModal.modal('show', settings);
                    break;
                    
                default:
                    console.error('The method you entered does not exist');
            }
        } else if (modalObj.hasSelector && this.length === 1) { // If allowing for selector to trigger modals post-init
            function clickEvent(e) { showModal($(this), args); }
            
            initModals();
            this.on('click', args.selector, clickEvent);
        } else { // If initializing plugin with options
            initModals();
            modalObj.$el.click(function() { showModal($(this), args); });
        }
        
        return this;
    }
}(jQuery));
/* ------------------------------------------------------------
ALJS Multi Select
------------------------------------------------------------ */
if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {
    var picklistItemMarkup = 
    '<li draggable="true" id="{{optionId}}" class="slds-picklist__item slds-has-icon slds-has-icon--left" aria-selected="false" tabindex="0" role="option">' +
        '<span class="slds-truncate">' +
            '<span>{{optionLabel}}</span>' +
        '</span>' +
    '</li>';

    var multiSelect = function(el, options) {
        this.$el = $(el);
        this.$selectedContainer = this.$el.find('[data-aljs-multi-select="selected"]').find('ul');
        this.$unselectedContainer = this.$el.find('[data-aljs-multi-select="unselected"]').find('ul');
        this.selectedItems = options.selectedItems;
        this.unselectedItems = options.unselectedItems;

        this.settings = options;

        this.init();
    };

    multiSelect.prototype = {
        constructor: multiSelect,
        init: function() {
            this.renderUnselectedItems();
            this.renderSelectedItems();

            this.$el.find('[data-aljs-multi-select="unselect"]').on('click', this, this.unselectItem);
            this.$el.find('[data-aljs-multi-select="select"]').on('click', this, this.selectItem);
            this.$el.find('[data-aljs-multi-select="move-up"]').on('click', this, this.moveItemUp);
            this.$el.find('[data-aljs-multi-select="move-down"]').on('click', this, this.moveItemDown);
        },
        renderUnselectedItems: function() {
            var self = this;
            
            this.$unselectedContainer.empty();

            this.unselectedItems.forEach(function(item) {
                self.$unselectedContainer.append(self.createPicklistDomItem(item));
            });

            this.$unselectedContainer
                .off()
                .on('click', 'li', function(e) {
                    $(this).addClass('slds-is-selected')
                           .attr('aria-selected', 'true')
                           .siblings()
                           .removeClass('slds-is-selected')
                           .attr('aria-selected', 'false');
                    self.itemToSelect = $(this).data('aljs-picklist-obj');
                })
                .on('dragstart', 'li', function(e) {
                    self.itemToSelect = $(this).data('aljs-picklist-obj');
                
                    e.originalEvent.dataTransfer.setData('text/plain', null);
                })
                .on('dragover', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                })
                .on('dragenter', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                })
                .on('drop', function(e) {
                    e.preventDefault();  
                    e.stopPropagation();
                    self.$el.find('[data-aljs-multi-select="unselect"]').click();
                });
        },
        renderSelectedItems: function() {
            var self = this;
            
            this.$selectedContainer.empty();

            this.selectedItems.forEach(function(item) {
                self.$selectedContainer.append(self.createPicklistDomItem(item));
            });

            this.$selectedContainer
                .off()
                .on('click', 'li', function(e) {
                    $(this).addClass('slds-is-selected')
                           .attr('aria-selected', 'true')
                           .siblings()
                           .removeClass('slds-is-selected')
                           .attr('aria-selected', 'false');
                    self.itemToUnselect = $(this).data('aljs-picklist-obj');
                })
                .on('dragstart', 'li', function(e) {
                    self.itemToUnselect = $(this).data('aljs-picklist-obj');
                    
                    e.originalEvent.dataTransfer.setData('text/plain', null);
                })
                .on('dragover', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                })
                .on('dragenter', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                })
                .on('drop', function(e) {
                    e.preventDefault();  
                    e.stopPropagation();
                    self.$el.find('[data-aljs-multi-select="select"]').click();
                });
        },
        selectItem: function(e) {
            var self = e.data;

            if (self.itemToSelect) {
                var item = self.$unselectedContainer.find('#' + self.itemToSelect.id)
                    .removeClass('slds-is-selected')
                    .attr('aria-selected', 'false')
                    .appendTo(self.$selectedContainer);
                
                self.unselectedItems.splice(self.unselectedItems.indexOf(self.itemToSelect), 1);
                self.selectedItems.push(self.itemToSelect);
                self.itemToSelect = null;
                
                self.settings.onSelectItem(self);
            }
        },
        unselectItem: function(e) {
            var self = e.data;

            if (!self.itemToUnselect) { return; }

            var item = self.$selectedContainer.find('#' + self.itemToUnselect.id)
                .removeClass('slds-is-selected')
                .attr('aria-selected', 'false')
                .appendTo(self.$unselectedContainer);
            
            self.selectedItems.splice(self.selectedItems.indexOf(self.itemToUnselect), 1);
            self.unselectedItems.push(self.itemToUnselect);
            self.itemToUnselect = null;
            
            self.settings.onUnselectItem(self);
        },
        moveItemUp: function(e) {
            var self = e.data;

            if (!self.itemToUnselect) { return; }

            var itemIndex = self.selectedItems.indexOf(self.itemToUnselect);

            if (itemIndex > 0) {
                self.selectedItems.splice(itemIndex, 1);
                self.selectedItems.splice(itemIndex - 1, 0, self.itemToUnselect);

                var $itemToMove = self.$selectedContainer.find('#' + self.itemToUnselect.id);

                $itemToMove.removeClass('slds-is-selected')
                           .attr('aria-selected', 'false')
                           .insertBefore($itemToMove.prev('li'));

                self.itemToUnselect = null;
                
                self.settings.onMoveItem(self, 'up');
            }
        },
        moveItemDown: function(e) {
            var self = e.data;

            if (!self.itemToUnselect) { return; }

            var itemIndex = self.selectedItems.indexOf(self.itemToUnselect);

            if (itemIndex < self.selectedItems.length - 1) {
                self.selectedItems.splice(itemIndex, 1);
                self.selectedItems.splice(itemIndex + 1, 0, self.itemToUnselect);

                var $itemToMove = self.$selectedContainer.find('#' + self.itemToUnselect.id);

                $itemToMove.removeClass('slds-is-selected')
                           .attr('aria-selected', 'false')
                           .insertAfter($itemToMove.next('li'));

                self.itemToUnselect = null;
                
                self.settings.onMoveItem(self, 'down');
            }
        },
        createPicklistDomItem: function(item) {
            //var $picklistItem = 
            return $(picklistItemMarkup.replace('{{optionId}}', item.id)
                                       .replace('{{optionLabel}}', item.label.toString()))
                                       .data('aljs-picklist-obj', item);
        },
        setSelectedItems: function(objs) {
            this.selectedItems = objs;
            this.renderSelectedItems();
        },
        setUnselectedItems: function(objs) {
            this.unselectedItems = objs;
            this.renderUnselectedItems();
        },
        getSelectedItems: function() {
            return this.selectedItems;
        },
        getUnselectedItems: function() {
            return this.unselectedItems;
        }
    };

    $.fn.multiSelect = function(options) {
        var multiSelectArguments = arguments;
        var internalReturn;
       // var arguments = arguments;

        var settings = $.extend({
            // These are the defaults
            selectedItems: [],
            unselectedItems: [],
            onSelectItem: function(obj) {},
            onUnselectItem: function(obj) {},
            onMoveItem: function(obj, direction) {},
            assetsLocation: $.aljs.assetsLocation
        }, typeof options === 'object' ? options : {});

        this.each(function() {
            var $this = $(this),
                data = $this.data('aljs-multi-select');

            if (!data) {
                var multiSelectData = new multiSelect(this, settings);
                $this.data('aljs-multi-select', (data = multiSelectData));
            }
            
            if (typeof options === 'string') {
                internalReturn = data[options](multiSelectArguments[1], multiSelectArguments[2]);
            }
        });

        if (internalReturn === undefined || internalReturn instanceof multiSelect) {
            return this;
        }

        if (this.length > 1) {
            throw new Error('Using only allowed for the collection of a single element (' + option + ' function)');
        } else {
            return internalReturn;
        }
    }
}(jQuery));
/* ------------------------------------------------------------
ALJS Notification
------------------------------------------------------------ */
if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {    
    $.fn.notification = function(options) {
        var settings = $.extend({
            assetsLocation: $.aljs.assetsLocation
            // These are the defaults
        }, options );
        
        if (this.length === 1 && typeof options !== 'string') { // If initializing plugin with options
            return this.on('click', '[data-aljs-dismiss="notification"]', function(e) {
                var $notification = $(this).closest('.slds-notify');
                
                if ($notification.length > 0) {
                    $notification.trigger('dismissed.aljs.notification'); // Custom aljs event
                    $notification.addClass('slds-hide');
                }
            });
        } else if (typeof options === 'string') { // If calling a method
            return this.each(function() {
                var $node = $(this);
                
                if (!($node.hasClass('slds-notify'))) {
                    throw new Error("This method can only be run on a notification with the slds-notify class on it");
                } else {
                    if (options === 'show' || (options === 'toggle' && $node.hasClass('slds-hide'))) {
                        $node.removeClass('slds-hide');
                        $node.trigger('dismissed.aljs.notification'); // Custom aljs event
                    } else if (options === 'dismiss' || (options === 'toggle' && !($node.hasClass('slds-hide')))) {
                        $node.addClass('slds-hide');
                        $node.trigger('shown.aljs.notification'); // Custom aljs event
                    }
                }
            }); 
        } else {
            throw new Error("This plugin can only be run with a selector, or with a command")
        }
    };
}(jQuery));
/* ------------------------------------------------------------
ALJS Picklist
------------------------------------------------------------ */
if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {
    var Picklist = function(el, options) {
        this.$el = $(el);
        this.settings = options;
        this.obj = {};
        this.bindTrigger();
        this.bindChoices();
    };
    
    Picklist.prototype = {
        constructor: Picklist,
        bindTrigger: function() {
            var self = this;
            var $el = this.$el;
            
            this.obj.$trigger = $('.slds-lookup__search-input', $el);
            this.obj.$dropdown = $('.slds-dropdown__list', $el);
            this.obj.$choices = $('.slds-dropdown__list > li > span', $el).prop('tabindex', 1);
            
            this.$el.on('keyup', self, self.processKeypress)
                .find('.slds-lookup__search-input + .slds-button')
                .css('pointer-events', 'none');
                        
            this.obj.$trigger.unbind() // Prevent multiple bindings
                .click(function(e) {
                    e.stopPropagation();
                
                    self.obj.id = $(this).attr('id');
                
                    if (self.$el.hasClass('slds-is-open')) {
                        self.$el.removeClass('slds-is-open');
                        self.obj.$dropdown.unbind('keyup', self.processKeypress);
                    } else {
                        // Close other picklists
                        $('[data-aljs="picklist"]').not(self.$el).picklist('close');
                        
                        self.$el.addClass('slds-is-open');
                        
                        if (self.obj.valueId === null || typeof self.obj.valueId === 'undefined') {
                            self.focusedIndex = null;
                        } else {
                            self.focusedIndex = self.obj.$dropdown.find('li > span').index(self.obj.$dropdown.find('#' + self.obj.valueId));
                        }
                        
                        self.focusOnElement();
                    }
                return false; // Prevent scrolling on keypress
                });
            
            $('body').click(function() { 
                self.$el.removeClass('slds-is-open');
            });
            
        },
        processKeypress: function(e) {
            var self = e.data;
            var optionsLength = self.obj.$choices.length;
            
            
            if (self.$el.hasClass('slds-is-open')) {
                switch (e.which) {
                    case (40): // Down
                        if (self.focusedIndex === null) {
                            self.focusedIndex = 0;
                        } else {
                            self.focusedIndex = self.focusedIndex === optionsLength - 1 ? 0 : self.focusedIndex + 1;
                        }
                        
                        self.focusOnElement();
                        break;
                    case (38): // Up
                        if (self.focusedIndex === null) {
                            self.focusedIndex = optionsLength - 1;
                        } else {
                            self.focusedIndex = self.focusedIndex === 0 ? optionsLength - 1 : self.focusedIndex - 1;
                        }
                        
                        self.focusOnElement();
                        break;
                    case (27): // Esc
                        self.$el.picklist('close');
                        break;
                    case (13): // Return
                        if (self.focusedIndex !== null) {
                            var focusedId = self.obj.$choices.eq(self.focusedIndex).attr('id');
                            
                            self.setValueAndUpdateDom(focusedId);
                        }
                        break;
                }
            } else if (e.which === 13) { // Return
                self.$el.addClass('slds-is-open');
                self.focusOnElement();
            }
            
            return false; // Prevents scrolling
        },
        focusOnElement: function() {
            if (this.focusedIndex !== null) {
                this.obj.$choices.eq(this.focusedIndex).focus();
            }
        },
        bindChoices: function() {
            var self = this;
            this.obj.$valueContainer = $('.slds-lookup__search-input', this.$el);
            
            this.obj.$choices.unbind() // Prevent multiple bindings
                .click(function(e) {
                    e.stopPropagation();
                
                    var optionId = $(this).closest('span').attr('id');
                
                    self.setValueAndUpdateDom(optionId);
                });
        },
        setValueAndUpdateDom: function(optionId) {
            var self = this;
            var $span = self.$el.find('#' + optionId);
            var index = self.obj.$choices.index($span);
            
            this.obj.value = $span.text().trim();
            this.obj.valueId = optionId;
            this.$el.removeClass('slds-is-open');
            
            this.obj.$trigger.trigger('change.aljs.picklist') // Custom aljs event
                .focus();
            
            this.obj.$valueContainer.val(this.obj.value);
            this.obj.$choices.removeClass('slds-is-selected');
            
            $span.addClass('slds-is-selected');
            self.focusedIndex = index;
            self.settings.onChange(self.obj);
        },
        setValue: function(optionId, callOnChange) {
            this.setValueAndUpdateDom(optionId);
            if (callOnChange) {
                this.settings.onChange(this.obj);
            }
        },
        getValueId: function() {
            return this.obj.valueId;
        },
        getValue: function() {
            return this.obj;
        },
        close: function() {
            this.$el.removeClass('slds-is-open');
        }
    };
    
    $.fn.picklist = function(options) {
        var picklistArguments = arguments;
        var internalReturn;
        
        var settings = $.extend({
            assetsLocation: $.aljs.assetsLocation,
            onChange: function(obj) {
            // These are the defaults
            }
        }, typeof options === 'object' ? options : {});
        
        this.each(function() {
            var $this = $(this);
            var data = $this.data('aljs-picklist');
            
            if (!data) {
                var picklistData = new Picklist(this, settings);
                $this.data('aljs-picklist', (data = picklistData));
            }
            
            if (typeof options === 'string') {
                internalReturn = data[options](picklistArguments[1], picklistArguments[2]);
            }
        });
        
        if (internalReturn === undefined || internalReturn instanceof Picklist) {
            return this;
        }
        
        if (this.length > 1) {
            throw new Error('Using only allowed for the collection of a single element (' + option + ' function)');
        } else {
            return internalReturn;
        }
    }
}(jQuery));
/* ------------------------------------------------------------
ALJS Pill
------------------------------------------------------------ */
if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {    
    $.fn.pill = function(options) {
        var settings = $.extend({
            assetsLocation: $.aljs.assetsLocation
            // These are the defaults
        }, options );
        
        if (this.length === 1) {
            return this.on('click', '[data-aljs-dismiss="pill"]', function(e) {
                var $pill = $(this).closest('.slds-pill');
                
                if ($pill.length > 0) {
                    $pill.trigger('dismissed.aljs.pill'); // Custom aljs event
                    $pill.remove();
                }
            });
        } else {
            throw new Error("This plugin can only be run with a selector targeting one container (e.g., 'body')")
        }
    };
}(jQuery));
/* ------------------------------------------------------------
ALJS Popover
------------------------------------------------------------ */
if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {
    var nubbinHeight = 15;
    var nubbinWidth = 15;

    var showPopover = function(e) {
        
        var settings = e.data;
        var $target = $(e.target).is($(settings.selector)) ? $(e.target) : $(e.target).closest(settings.selector || '[data-aljs="popover"]');
        var isMarkup = ($target.attr('data-aljs-show')) ? true : false;
        
        if (!$target.attr('data-aljs-title') && !isMarkup) {
            $target.attr('data-aljs-title', $target.attr('title'));
            $target.attr('title', '');
        }
        
        var popoverContent = (!isMarkup) ? htmlEncode($target.attr('data-aljs-title')) : $('#' + $target.data('aljs-show')).html();
        
        if (popoverContent.length > 0) {            
            var lineHeightFix = ($target.parent().hasClass('slds-button')) ? ' style="line-height: normal;"' : ''; // Adjust line height if popover is inside a button
            var popoverId = $target.attr('data-aljs-id') || 'aljs-' + (new Date()).valueOf();
            var popoverPosition = $target.attr('data-aljs-placement') || 'top';
            var popoverNubbins = {
                top: 'bottom',
                bottom: 'top',
                left: 'right',
                right: 'left'
            };
            var popoverPositioningCSS = 'overflow: visible; display: block; position: absolute;';
            var modifier = (settings.modifier != '') ? ' slds-popover--' + settings.modifier : '';
            var theme = (settings.theme != '') ? ' slds-theme--' + settings.theme : '';
            var popoverMarkup = '<div id="' + popoverId + '" aria-describedby="' + popoverId + '" class="slds-popover' + modifier + theme + ' slds-nubbin--' + (popoverNubbins[popoverPosition] || 'top') + '" style="' + popoverPositioningCSS +'">' +
                                    '<div class="slds-popover__body"' + lineHeightFix + '>' +
                                    popoverContent +
                                    '</div>' +
                                '</div>';

            if ($target.next('.slds-popover').length === 0) {
                var $popoverNode = ($.aljs.scoped) ? (typeof($.aljs.scopingClass) === 'string') ? $(popoverMarkup).appendTo('.' + $.aljs.scopingClass) : $(popoverMarkup).appendTo('.slds-scope') : $(popoverMarkup).appendTo('body');
                var actualWidth  = $popoverNode[0].offsetWidth;
                var actualHeight = $popoverNode[0].offsetHeight;// + 15;
                var targetPos = getPosition($target)
                var calculatedOffset = getCalculatedOffset(popoverPosition, targetPos, actualWidth, actualHeight);
                applyPlacement(calculatedOffset, popoverPosition, actualWidth, actualHeight, $popoverNode);
            }
        }
    };

    var htmlEncode = function(val) {
        var str = String(val);
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\//g, '&#x2F;');
    }

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

/* ------------------------------------------------------------
ALJS Tab
------------------------------------------------------------ */
if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }

(function($) {
    var Tabs = function(el, settings) {
        this.$el = $(el);
        this.settings = settings;
        this.initTabs();
    };
    
    Tabs.prototype = {
        constructor: Tabs,
        initTabs: function() {
            // Bind buttons
            var self = this;
            var $tabButtons = this.$el.find('> .slds-tabs--default__nav > .slds-tabs--default__item > .slds-tabs--default__link, > .slds-tabs--scoped__nav > .slds-tabs--scoped__item > .slds-tabs--scoped__link');
            var children = this.$el.find('> .slds-tabs--default__nav > .slds-tabs--default__item, > .slds-tabs--scoped__nav > .slds-tabs--scoped__item');
            var tabsObj = {
                self: self,
                children: children
            }
            
            $tabButtons.on('click', function(e) {
                e.stopPropagation();
                self.selectTab($(e.target).data('aljs-show'));
                $(this).trigger('selected.aljs.tab'); // Custom aljs event
                return false;
            });
            
            // Show first tab
            if (this.settings.defaultTabId === '' || $('#' + this.settings.defaultTabId).length === 0) {
                this.selectTab($tabButtons.first().data('aljs-show'));
            } else {
                this.selectTab(this.settings.defaultTabId);
            }
            
            children.keyup(tabsObj, this.processKeypress);
        },
        selectTab: function(tabId) {
            this.$el.find('> .slds-tabs--default__nav > .slds-tabs--default__item, > .slds-tabs--scoped__nav > .slds-tabs--scoped__item')
                .removeClass('slds-active')
                .blur()
                .find('> .slds-tabs--default__link, > .slds-tabs--scoped__link')
                .attr('tabindex', '-1')
                .attr('aria-selected', 'false');
            this.$el.find('> .slds-tabs--default__content, > .slds-tabs--scoped__content')
                .hide();
            this.$el.find('[data-aljs-show="' + tabId + '"]')
                .focus()
                .closest('li')
                .addClass('slds-active')
                .find('> .slds-tabs--default__link, > .slds-tabs--scoped__link')
                .attr('tabindex', '0')
                .attr('aria-selected', 'true');
            this.$el.find('#' + tabId).show()
                .trigger('shown.aljs.tabcontent'); // Custom aljs event
            
            this.id = tabId;
            this.settings.onChange(this);
        },
        processKeypress: function(e) {
            var children = e.data.children;
            var length = $(children).length - 1;
            var selectedPos = $('.slds-active', $(children).parent()).index();
            var tabId;
            
            if (e.which == 37) { // Left arrow
                if (selectedPos == 0) {
                    tabId = $(children).eq(length).find('[data-aljs-show]').data('aljs-show');
                } else {
                    tabId = $(children).eq((selectedPos - 1)).find('[data-aljs-show]').data('aljs-show');
                }
                e.data.self.selectTab(tabId);
            } else if (e.which == 39) { // Right arrow
                if (selectedPos == length) {
                    tabId = $(children).eq(0).find('[data-aljs-show]').data('aljs-show');
                } else {
                    tabId = $(children).eq((selectedPos + 1)).find('[data-aljs-show]').data('aljs-show');
                }
                e.data.self.selectTab(tabId);
            }
        }
    };
    
    $.fn.tabs = function(options) {
        var tabsArguments = arguments;
        var internalReturn;
        
        var settings = $.extend({
            // These are the defaults
            defaultTabId: '',
            onChange: function(obj) {},
            assetsLocation: $.aljs.assetsLocation
        }, typeof options === 'object' ? options : {});
        
        this.each(function() {
            var $this = $(this);
            var data = $this.data('aljs-tabs');
            
            if (!data) {
                var tabsData = new Tabs(this, settings);
                $this.data('aljs-tabs', (data = tabsData));
            }
            
            if (typeof options === 'string') {
                internalReturn = data[options](tabsArguments[1], tabsArguments[2]);
            }
        });
        
        if (internalReturn === undefined || internalReturn instanceof Tabs) {
            return this;
        }
        
        if (this.length > 1) {
            throw new Error('Using only allowed for the collection of a single element (' + option + ' function)');
        } else {
            return internalReturn;
        }
    }
}(jQuery));