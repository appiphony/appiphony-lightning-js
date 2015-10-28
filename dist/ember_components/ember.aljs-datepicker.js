if (typeof _AljsApp === 'undefined') { throw new Error("Please include ember.aljs-init.js in your compiled Ember Application"); }
if (typeof moment === 'undefined') { throw new Error("Please include moment.js in your compiled Ember Application"); }

_AljsApp.AljsDatepickerComponent = Ember.Component.extend(Ember.Evented, {
    attributeBindings: ['selectedDate', 'format', 'dayLabels', 'monthLabels'],
    init: function() {
        var self = this;

        this._super();
        this.initCalendar();

        if (!Ember.Handlebars.helpers['convertNumberToMonth']) {
            Ember.Handlebars.registerBoundHelper('convertNumberToMonth', function(index) {            
                if(!Ember.isNone(index)) {
                    return new Ember.Handlebars.SafeString(self.get('monthLabels')[index].full);
                } else {
                    return '';
                }
            });
        }

        if (!Ember.Handlebars.helpers['convertNumberToDayOfWeek']) {
            Ember.Handlebars.registerBoundHelper('convertNumberToDayOfWeek', function(index) {
                if(!Ember.isNone(index)) {
                    return new Ember.Handlebars.SafeString(self.get('dayLabels')[index]);
                } else {
                    return '';
                }
            });
        }

        if (Ember.isEmpty(this.get('dayLabels'))) {
            this.set('dayLabels', this.get('dayLabelsDefaults'));
        }

        if (Ember.isEmpty(this.get('monthLabels'))) {
            this.set('monthLabels', this.get('monthLabelsDefaults'));
        }
    },
    initCalendar: function() {
        if (!this.get('isOpen')) {
            var initDate = this.get('selectedDate') || moment();

            this.set('selectedYear', initDate.toDate().getFullYear());
            this.set('selectedMonth', initDate.toDate().getMonth());

            if (!Ember.isNone(this.get('selectedDate'))) {
                this.set('selectedDateText', this.get('selectedDate').format(this.getWithDefault('format', 'MM/DD/YYYY')));
            }
        }
    },
    numYearsBefore: 50,
    numYearsAfter: 10,
    layoutName: 'components/aljs-datepicker',
    didInsertElement: function() {
        var self = this;

        $('body').on('click', function() {
           self.closeDatepicker();
        });

        $('body').on('keyup', this, this.triggerClickNextOrPrev);
    },
    willClearRender: function() {
        $('body').unbind('keyup', this, this.triggerClickNextOrPrev);
    },
    years: function() {
        var currentYear = (new Date()).getFullYear();
        var years = [];
        for (var i = currentYear - this.get('numYearsBefore'); i <= currentYear + this.get('numYearsAfter'); i++) {
            years.push(Ember.Object.create({
                value: i,
                isSelected: i === currentYear
            }));
        }

        return  years;
    }.property(),
    dayLabelsDefaults: [
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
    monthLabelsDefaults: [
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
    ],
    isLeapYear: function () {
        var year = this.get('selectedYear');
        return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
    }.property('selectedYear'),
    getNumDaysInMonth: function(month) {
        return [31, (this.get('isLeapYear') ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },
    numDaysInMonth: function () {
        return this.getNumDaysInMonth(this.get('selectedMonth'));
    }.property('selectedMonth'),
    calendarRows: function() {
        var selectedDate = this.get('selectedDate');
        var selectedMonth = this.get('selectedMonth');
        var selectedYear = this.get('selectedYear');
        var numDaysInMonth = this.getNumDaysInMonth(this.get('selectedMonth'));
        var numDaysInPrevMonth = this.getNumDaysInMonth(selectedMonth === 0 ? 11 : selectedMonth - 1);
        var numDaysInNextMonth = this.getNumDaysInMonth(selectedMonth === 11 ? 0 : selectedMonth + 1);
        var firstDayOfMonth = (new Date(this.get('selectedYear'), this.get('selectedMonth'), 1)).getDay();
        var allDays = [];
        var calendarRows = [];
        var dayLabels = this.get('dayLabels');

        // Fill previous month
        for (var i = numDaysInPrevMonth - (firstDayOfMonth - 1); i <= numDaysInPrevMonth; i++) {
            var iDate = moment(new Date(selectedYear, selectedMonth, i));
            allDays.push({
                value: i,
                isCurrentMonth: false,
                isSelected: !Ember.isNone(selectedDate) && iDate.isSame(selectedDate, 'day'),
                isToday: iDate.isSame(moment(), 'day')
            });
        }

        // Fill current month
        for (var i = 1; i <= numDaysInMonth; i++) {
            var iDate = moment(new Date(selectedYear, selectedMonth, i));
            allDays.push({
                value: i,
                isCurrentMonth: true,
                isSelected: !Ember.isNone(selectedDate) && iDate.isSame(selectedDate, 'day'),
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
            var iDate = moment(new Date(selectedYear, selectedMonth, i));
            var numColsToFill = 7 - calendarRows[calendarRows.length - 1].length;
            for (var i = 1; i <= numColsToFill; i++) {
                calendarRows[calendarRows.length - 1].push({
                    value: i,
                    isCurrentMonth: false,
                    isSelected: !Ember.isNone(selectedDate) && iDate.isSame(selectedDate, 'day'),
                    isToday: iDate.isSame(moment(), 'day')
                });
            }
        }

        return calendarRows;
    }.property('selectedMonth', 'selectedYear', 'selectedDate'),
    focusIn: function() {
        this.openDatepicker();
    },
    click: function(e) {
        e.stopPropagation();
        var $target = $(e.target);
        if (!Ember.isEmpty($target.closest('.slds-datepicker')) && Ember.isEmpty($target.closest('.datepicker__filter--year'))) {
            this.closeYearDropdown();
        }
    },
    keyPress: function(e) {
        if (e.keyCode === 13) {
            this.setDateFromInput();
        }
    },
    triggerClickNextOrPrev: function(e) {
        var self = e.data;
        if(self.get('isOpen') === true && Ember.isEmpty(self.$().find('input:focus'))) {
            if (e.keyCode === 37) {
                self.send('clickNextOrPrevMonth', 'prev');
            } else if (e.keyCode === 39) {
                self.send('clickNextOrPrevMonth', 'next');
            }
        }
    },
    openDatepicker: function() {
        this.initCalendar();
        this.set('isOpen', true);
    },
    closeDatepicker: function() {
        this.setProperties({
            isYearOpen: false,
            isOpen: false
        });
        this.$().find('input').blur();
    },
    openYearDropdown: function() {
        this.set('isYearOpen', true);
    },
    closeYearDropdown: function() {
        if (this.get('isYearOpen') === true) {
            this.set('isYearOpen', false);
        }
    },
    yearDropdownOpened: function() {
        if (this.get('isYearOpen')) {
            Ember.run.scheduleOnce('afterRender', this, function() {
                this.$().find('#yearDropdown').scrollTop(this.$().find('#yearDropdown' + this.get('selectedYear')).position().top);
            });
        }
    }.observes('isYearOpen'),
    selectedYearChanged: function() {
        console.log(this.get('selectedYear'));
        this.get('years').findBy('isSelected', true).set('isSelected', false);
        this.get('years').findBy('value', this.get('selectedYear')).set('isSelected', true);
    }.observes('selectedYear'),
    setDateFromInput: function(){
        var selectedDateText = this.get('selectedDateText');
        var momentDate = moment(new Date(selectedDateText));
        var currentYear = (new Date()).getFullYear();
        var earliestCalendarYear = new Date(currentYear - this.get('numYearsBefore'), 0, 1);
        var latestCalendarYear = new Date(currentYear + this.get('numYearsAfter'), 11, 31);

        if (momentDate && momentDate.isValid() && momentDate.isAfter(earliestCalendarYear) && momentDate.isBefore(latestCalendarYear)) {
            this.set('selectedDate', momentDate);
            this.closeDatepicker();
            this.$().find('input').trigger('selected.aljs.datepicker');
        }
    },
    actions: {
        clickSelectYear: function(year) {
            this.set('selectedYear', year);
            this.closeYearDropdown();
        },
        clickYearDropdown: function() {
            this.toggleProperty('isYearOpen');
        },
        clickNextOrPrevMonth: function(direction) {
            var selectedMonth = this.get('selectedMonth');

            if (direction === 'next') {
                if (selectedMonth === 11) {
                    this.set('selectedMonth', 0);
                    this.incrementProperty('selectedYear');
                } else {
                    this.incrementProperty('selectedMonth');
                }
            } else if (direction === 'prev') {
                if (selectedMonth === 0) {
                    this.set('selectedMonth', 11);
                    this.decrementProperty('selectedYear');
                } else {
                    this.decrementProperty('selectedMonth');
                }
            }
        },
        clickSelectDate: function(dayObj) {
            var selectedMonth = this.get('selectedMonth');
            var selectedYear = this.get('selectedYear');
            var selectedDay = dayObj.value;

            if (dayObj.isCurrentMonth === true) {
                this.set('selectedDate', moment(new Date(selectedYear, selectedMonth, selectedDay)));
                this.set('selectedDateText', moment(new Date(selectedYear, selectedMonth, selectedDay)).format(this.getWithDefault('format', 'MM/DD/YYYY')));
                this.closeDatepicker();

                this.$().find('input').trigger('selected.aljs.datepicker');
            }
        }
    }
});