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