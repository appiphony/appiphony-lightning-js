if (typeof jQuery.aljs === "undefined") { throw new Error("Please include the ALJS initializer file") }
if (typeof moment === "undefined") { throw new Error("The ALJS datepicker plugin requires moment.js") }

// Based on bootstrap-datepicker.js 


(function($) {
    var datepickerMenuMarkup = 
    '<div class="slds-dropdown slds-dropdown--left slds-datepicker" aria-hidden="false" data-selection="single">' +
        '<div class="slds-datepicker__filter slds-grid">' +
            '<div class="slds-datepicker__filter--month slds-grid slds-grid--align-spread slds-size--3-of-4">' +
                '<div class="slds-align-middle">' +
                    '<button id="aljs-prevButton" class="slds-button slds-button--icon-container">' +
                        '<svg aria-hidden="true" class="slds-button__icon slds-button__icon--small">' +
                            '<use xlink:href="{{assetsLocation}}/assets/icons/utility-sprite/svg/symbols.svg#left"></use>' +
                        '</svg>' +
                        '<span class="slds-assistive-text">Previous Month</span>' +
                    '</button>' +
                '</div>' +
                '<h2 id="month" class="slds-align-middle" aria-live="assertive" aria-atomic="true"></h2>' +
                '<div class="slds-align-middle">' +
                    '<button id="aljs-nextButton" class="slds-button slds-button--icon-container">' +
                        '<svg aria-hidden="true" class="slds-button__icon slds-button__icon--small">' +
                            '<use xlink:href="{{assetsLocation}}/assets/icons/utility-sprite/svg/symbols.svg#right"></use>' +
                        '</svg>' +
                        '<span class="slds-assistive-text">Next Month</span>' +
                    '</button>' +
                '</div>' +
            '</div>' +
            '<div class="slds-form-element"><div class="slds-form-element__control">' +
                '<div class="slds-picklist datepicker__filter--year slds-shrink-none">' +
                // '<button id="year" class="slds-button slds-button--neutral slds-picklist__label" aria-haspopup="true">' +
                //     '<span id="aljs-year"></span>' +
                //     '<svg aria-hidden="true" class="slds-icon slds-icon--small">' +
                //         '<use xlink:href="{{assetsLocation}}/assets/icons/utility-sprite/svg/symbols.svg#down"></use>' +
                //     '</svg>' +
                // '</button>' +
            '</div></div>' +
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
        this.$el = $(el);

        var initDate = moment(options.initDate) || moment();
        var endDateId = options.endDateInputId;

        this.$datepickerEl = $(datepickerMenuMarkup.replace(/{{assetsLocation}}/g, options.assetsLocation) + datepickerTableMarkup);
        this.settings = options;

        if (options.initDate) {
            this.setSelectedFullDate(initDate);
        }

        if (endDateId && $('#' + endDateId).length === 1) {
            this.$elEndDate = $('#' + endDateId);

            if (options.endDate) {
                this.setEndFullDate(endDate);
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
                $('[data-aljs-datepicker-id]').not(this).each(function() {
                    $(this).data('datepicker').closeDatepicker();
                });

                if ((e.target === $el[0] && ($el.val() !== null && $el.val() !== '')) || (e.target === $elEndDate[0] && ($elEndDate.val() !== null && $elEndDate.val() !== ''))) {
                    self.$selectedInput = $(this).parent().find('input');
                    self.$selectedInput.on('keyup', self, self.processKeyup)
                                       .on('blur', self, self.processBlur);
                    self.closeDatepicker();
                } else {
                    var initDate = self.selectedFullDate || moment();
                    self.viewedMonth = initDate.month();
                    self.viewedYear = initDate.year();
                    self.fillMonth();
                    self.$selectedInput = $(this).parent().find('input');
                    self.$selectedInput.off('keyup')
                                       .off('blur');
                    // if ($el.closest('.slds-form-element').next('.slds-datepicker').length > 0) {
                    //     $datepickerEl.show();
                    // } else {
                    self.$selectedInput.closest('.slds-form-element').append($datepickerEl);   
                    self.initYearDropdown();
                    $([$el, $datepickerEl, $elEndDate, $el.prev('svg')]).each(function() {
                        $(this).on('click', self.blockClose);
                    });         
                    $datepickerEl.on('click', self, self.processClick);
                    //}  
                    //if ()
                    self.$selectedInput.blur();

                    $('body').on('click', self, self.closeDatepicker); 
                }  
            };

            // Opening datepicker
            $($el).on('focus', openDatepicker);
            $($el.prev('svg')).on('click', openDatepicker);
            $el.prev('svg').css('cursor', 'pointer');

            if ($elEndDate.length > 0) {
                $($elEndDate).on('focus', openDatepicker);
                $($elEndDate.prev('svg')).on('click', openDatepicker);
                $elEndDate.prev('svg').css('cursor', 'pointer');
            }

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
                        $dayCol.addClass('slds-disabled-text');
                        $dayCol.prop('aria-disabled', 'true');
                    }

                    if (col.isSelected || col.isSelectedEndDate || col.isSelectedMulti) {// || 
                                //(!isMultiSelect && !selectedFullDate && col.isToday) ||
                                //(isMultiSelect && !selectedEndDate && col.isToday)) {
                        $dayCol.prop('aria-selected', 'true');
                        $dayCol.addClass(isMultiSelect ? 'slds-is-selected-multi slds-is-selected' : 'slds-is-selected');
                    } else {
                        $dayCol.prop('aria-selected', 'false');
                    }

                    if (col.isToday) {
                        $dayCol.addClass('slds-is-today');
                    }

                });
            });

            this.$datepickerEl.find('tbody').replaceWith($monthTableBody);
            this.$datepickerEl.find('#month').text(this.settings.monthLabels[this.viewedMonth].full);
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

             //   var $yearContainer = $('<div id="aljs-yearDropdown" class="slds-dropdown slds-dropdown--menu">');
             //   var $yearDropdown = $('<ul class="slds-dropdown__list" style="max-height: 13.5rem; overflow-y:auto;"></ul>').appendTo($yearContainer);
                var currentYear = moment().year();
                // var selectedIconMarkup = ('<svg aria-hidden="true" class="slds-icon slds-icon--small slds-icon--left">' +
                //                         '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="{{assetsLocation}}/assets/icons/standard-sprite/svg/symbols.svg#task2" data-reactid=".46.0.0.1:$=10:0.0.$=11:0.0.0.0"></use>' +
                //                     '</svg>').replace(/{{assetsLocation}}/g, this.settings.assetsLocation);

                for (var i = currentYear - this.settings.numYearsBefore; i <= currentYear + this.settings.numYearsAfter; i++) {
                    var $yearOption = $('<option value="' + i + '">' + i + '</option>').appendTo($yearSelect);
                }

                $yearSelect.val(viewedYear);

                this.$datepickerEl.find('.datepicker__filter--year').append($yearDropdown);
            }

            $yearSelect.on('change', function(e) {
                self.viewedYear = $(e.target).val();
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
                                                //|| (allDays[index + 6] && allDays[index + 6].isSelectedMulti === true 
                                                //    && allDays[index + 7] && allDays[index + 7].isSelectedMulti === true);
                    
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
            this.$el.val(selectedFullDate.format(this.settings.format));

            if (!oldDate || (!oldDate.isSame(selectedFullDate, 'day'))) {
                this.settings.onChange(this);
            }
        },
        setSelectedEndDate: function(selectedEndDate) {
            var oldDate = this.selectedEndDate;

            this.selectedEndDate = selectedEndDate;
            this.$elEndDate.val(selectedEndDate.format(this.settings.format));

            if (!oldDate || (!oldDate.isSame(selectedEndDate, 'day'))) {
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

            // if ($target.closest('#year').length > 0) {
            //     self.clickYearDropdown(e);
            // } else {
            //     self.hideYearDropdown();
            // }
        },
        processKeyup: function(e) {
            if (e.keyCode === 13) {
                $(this).blur();
                // var self = e.data;
                // var selectedDate = $(this).val();

                // if (moment(selectedDate).isValid()) {
                //     if (self.$elEndDate && self.$elEndDate.length > 0 && self.$elEndDate[0] === self.$selectedInput[0]) {
                //         self.setSelectedEndDate(moment(selectedDate, self.settings.format));
                //     } else {
                //         self.setSelectedFullDate(moment(selectedDate, self.settings.format));
                //     }

                //     self.closeDatepicker(e);
                //     $(this).blur();
                // } 
            }  
        },
        processBlur: function(e) {
            if (e) {
                var self = e.data;
                var selectedDate = $(this).val();
                var momentSelectedDate = moment(selectedDate, self.settings.format);

                if (momentSelectedDate.isValid()) {
                    if (self.$elEndDate && self.$elEndDate.length > 0 && self.$elEndDate[0] === self.$selectedInput[0]) {
                        self.setSelectedEndDate(momentSelectedDate);
                    } else {
                        self.setSelectedFullDate(momentSelectedDate);
                    }

                    self.closeDatepicker(e);
                    self.$selectedInput.off('keyup')
                                       .off('blur');
                    //$(this).blur();
                } 
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
                
                self.closeDatepicker(e); 

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
                $selectedInput.closest('.slds-form-element').find('.slds-datepicker').remove();
                $('body').unbind('click', self.closeDatepicker);
                $datepickerEl.unbind('click', self.processClick);
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
            throw new Error('Using only allowed for the collection of a single element (' + option + ' function)');
        } else {
            return internalReturn;
        }
    };
})(jQuery);