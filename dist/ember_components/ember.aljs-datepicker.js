if (typeof _AljsApp === 'undefined') { throw new Error("Please include ember.aljs-init.js in your compiled Ember Application"); }
if (typeof moment === 'undefined') { throw new Error("Please include moment.js in your compiled Ember Application"); }


_AljsApp.AljsDatepickerFixtures = Ember.Object.create({
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
});

_AljsApp.AljsDatepickerComponent = Ember.Component.extend(Ember.Evented, {
    attributeBindings: ['selectedDate', 'selectedDateText', 'format', 'dayLabels', 'monthLabels', 'label', 'hasError', 'errorMessage'],
    init: function() {
        var self = this;

        this._super();
        this.initCalendar();

        if (!Ember.isEmpty(this.get('dayLabels'))) {
            _AljsApp.AljsDatepickerFixtures.set('dayLabels', this.get('dayLabels'));
        }

        if (!Ember.isEmpty(this.get('monthLabels'))) {
            _AljsApp.AljsDatepickerFixtures.set('monthLabels', this.get('monthLabels'));
        }


        if (!Ember.Handlebars.helpers['convertNumberToMonth']) {
            Ember.Handlebars.registerBoundHelper('convertNumberToMonth', function(index) {            
                if(!Ember.isNone(index)) {
                    return new Ember.Handlebars.SafeString(_AljsApp.AljsDatepickerFixtures.get('monthLabels')[index].full);
                } else {
                    return '';
                }
            });
        }

        if (!Ember.Handlebars.helpers['convertNumberToDayOfWeek']) {
            Ember.Handlebars.registerBoundHelper('convertNumberToDayOfWeek', function(index, format) {
                if(!Ember.isNone(index)) {
                    return new Ember.Handlebars.SafeString(_AljsApp.AljsDatepickerFixtures.get('dayLabels')[parseInt(index)][format]);
                } else {
                    return '';
                }
            });
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
        
        $('body').on('keyup.' + this.get('elementId'), this, this.triggerClickNextOrPrev);
        $('body').on('click.' + this.get('elementId'), this, function() {
            self.setDateFromInput();
            self.closeDatepicker();
        });
    },
    willClearRender: function() {
        $('body').off('.' + this.get('elementId'));
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

            day.headerText = _AljsApp.AljsDatepickerFixtures.dayLabels[index % 7]['full'];

            calendarRows[calendarRows.length - 1].push(day);
        });
        
        // Fill last row
        if (calendarRows[calendarRows.length - 1].length < 7) {
            var iDate = moment(new Date(selectedYear, selectedMonth, i));
            var numColsToFill = 7 - calendarRows[calendarRows.length - 1].length;
            var dayIndexReference = 7 - numColsToFill - 1; // This calculation figures out the first 'day index' to start with to properlly populate the day header.
                                                           // Subtracting one to compensate for i starting at 1 below.
            for (var i = 1; i <= numColsToFill; i++) {
                calendarRows[calendarRows.length - 1].push({
                    value: i,
                    isCurrentMonth: false,
                    isSelected: !Ember.isNone(selectedDate) && iDate.isSame(selectedDate, 'day'),
                    isToday: iDate.isSame(moment(), 'day'),
                    headerText: _AljsApp.AljsDatepickerFixtures.dayLabels[(dayIndexReference + i)]['full']
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
        if (e.which === 13) {
            this.setDateFromInput();
        }
    },
    triggerClickNextOrPrev: function(e) {
        var self = e.data ? e.data : this;
        if(self.get('isOpen') === true && Ember.isEmpty(self.$().find('input:focus'))) {
            if (e.which === 37) {
                self.send('clickNextOrPrevMonth', 'prev');
            } else if (e.which === 39) {
                self.send('clickNextOrPrevMonth', 'next');
            }
        }
    },
    openDatepicker: function() {
        this.initCalendar();
        this.set('isOpen', true);

        Ember.run.scheduleOnce('afterRender', this, function() {
            if (Ember.isEmpty(this.get('selectedDate'))) {
                this.$().find('input').blur();
            }
        });
    },
    closeDatepicker: function(event) {
        var self = event && event.data ? event.data : this;
        
        self.setProperties({
            isYearOpen: false,
            isOpen: false
        });
        self.$().find('input').blur();
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
        this.get('years').findBy('isSelected', true).set('isSelected', false);
        this.get('years').findBy('value', this.get('selectedYear')).set('isSelected', true);
    }.observes('selectedYear'),
    setDateFromInput: function(){
        var selectedDateText = this.get('selectedDateText');
        if (Ember.isEmpty(selectedDateText)) {
            this.set('selectedDate', null);
            this.closeDatepicker();
            this.$().find('input').trigger('selected.aljs.datepicker');

        } else {
            var momentDate = moment(new Date(selectedDateText));
            var currentYear = (new Date()).getFullYear();
            var earliestCalendarYear = new Date(currentYear - this.get('numYearsBefore'), 0, 1);
            var latestCalendarYear = new Date(currentYear + this.get('numYearsAfter'), 11, 31);

            if (momentDate && momentDate.isValid() && momentDate.isAfter(earliestCalendarYear) && momentDate.isBefore(latestCalendarYear)) {
                this.set('selectedDate', momentDate);
                this.closeDatepicker();
                this.$().find('input').trigger('selected.aljs.datepicker');
            } 
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
        },
        clickEventIcon: function() {
            this.$().find('input').focus();
        }
    }
});

_AljsApp.MultiDatepickerInputComponent = Ember.TextField.extend({
    attributeBindings: ['data-aljs-multi-datepicker']
});

_AljsApp.AljsMultiDatepickerComponent = Ember.Component.extend(Ember.Evented, {
    attributeBindings: ['selectedStartDate', 'selectedEndDate', 'format', 'dayLabels', 'monthLabels', 'startLabel', 'endLabel', 
                        'selectedStartDateText', 'seelctedEndDateText'],
    init: function() {
        var self = this;

        this._super();
        this.set('startLabel', this.getWithDefault('startLabel', 'Start Date'));
        this.set('endLabel', this.getWithDefault('endLabel', 'End Date'));
        this.initCalendar('Start');
        this.initCalendar('End');

        if (!Ember.isEmpty(this.get('dayLabels'))) {
            _AljsApp.AljsDatepickerFixtures.set('dayLabels', this.get('dayLabels'));
        }

        if (!Ember.isEmpty(this.get('monthLabels'))) {
            _AljsApp.AljsDatepickerFixtures.set('monthLabels', this.get('monthLabels'));
        }


        if (!Ember.Handlebars.helpers['convertNumberToMonth']) {
            Ember.Handlebars.registerBoundHelper('convertNumberToMonth', function(index) {            
                if(!Ember.isNone(index)) {
                    return new Ember.Handlebars.SafeString(_AljsApp.AljsDatepickerFixtures.get('monthLabels')[index].full);
                } else {
                    return '';
                }
            });
        }

        if (!Ember.Handlebars.helpers['convertNumberToDayOfWeek']) {
            Ember.Handlebars.registerBoundHelper('convertNumberToDayOfWeek', function(index, format) {
                if(!Ember.isNone(index)) {
                    return new Ember.Handlebars.SafeString(_AljsApp.AljsDatepickerFixtures.get('dayLabels')[parseInt(index)][format]);
                } else {
                    return '';
                }
            });
        }
    },
    initCalendar: function(inputType) {
        if (!this.get('is' + inputType + 'Open')) {
            var initDate = this.get('selected' + inputType + 'Date') || moment();

            this.set('selected' + inputType + 'Year', initDate.toDate().getFullYear());
            this.set('selected' + inputType + 'Month', initDate.toDate().getMonth());

            if (!Ember.isNone(this.get('selected' + inputType + 'Date'))) {
                this.set('selected' + inputType + 'DateText', this.get('selected' + inputType + 'Date').format(this.getWithDefault('format', 'MM/DD/YYYY')));
            }
        }
    },
    numYearsBefore: 50,
    numYearsAfter: 10,
    layoutName: 'components/aljs-multi-datepicker',
    didInsertElement: function() {
        var self = this;

        $('body').on('keyup.' + this.get('elementId'), this, this.triggerClickNextOrPrev);
        $('body').on('click.' + this.get('elementId'), this, this.closeDatepicker);
    },
    willClearRender: function() {
        $('body').off('.' + this.get('elementId'));
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
    isLeapYear: function () {
        var year = this.get('selected' + this.get('inputType') + 'Year');
        return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
    }.property('selectedStartYear', 'selectedEndYear', 'inputType'),
    getNumDaysInMonth: function(month) {
        return [31, (this.get('isLeapYear') ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },
    numDaysInMonth: function () {
        return this.getNumDaysInMonth(this.get('selected' + this.get('inputType') + 'Month'));
    }.property('selectedStartMonth', 'selectedEndMonth', 'inputType'),
    calendarRows: function() {
        var inputType = this.get('inputType');
        var otherInputType = inputType === 'Start' ? 'End' : 'Start';

        var selectedDate = this.get('selected' + inputType + 'Date');
        var selectedMonth = this.get('selected' + inputType + 'Month');
        var selectedYear = this.get('selected' + inputType + 'Year');

        var selectedOtherDate = this.get('selected' + otherInputType + 'Date');

        var selectedStartDate = inputType === 'Start' ? selectedDate : selectedOtherDate;
        var selectedEndDate = inputType === 'End' ? selectedDate : selectedOtherDate;

        var numDaysInMonth = this.getNumDaysInMonth(selectedMonth);
        var numDaysInPrevMonth = this.getNumDaysInMonth(selectedMonth === 0 ? 11 : selectedMonth - 1);
        var numDaysInNextMonth = this.getNumDaysInMonth(selectedMonth === 11 ? 0 : selectedMonth + 1);
        var firstDayOfMonth = (new Date(selectedYear, selectedMonth, 1)).getDay();
        var allDays = [];
        var calendarRows = [];

        // Fill previous month
        for (var i = numDaysInPrevMonth - (firstDayOfMonth - 1); i <= numDaysInPrevMonth; i++) {
            var iDate = moment(new Date(selectedYear, selectedMonth - 1, i));
            allDays.push({
                value: i,
                isCurrentMonth: false,
                isSelected: !Ember.isNone(selectedDate) && (iDate.isSame(selectedDate, 'day') || iDate.isSame(selectedOtherDate, 'day') || iDate.isBetween(selectedStartDate, selectedEndDate)),
                isToday: iDate.isSame(moment(), 'day')
            });
        }

        // Fill current month
        for (var i = 1; i <= numDaysInMonth; i++) {
            var iDate = moment(new Date(selectedYear, selectedMonth, i));
            allDays.push({
                value: i,
                isCurrentMonth: true,
                isSelected: !Ember.isNone(selectedDate) && (iDate.isSame(selectedDate, 'day') || iDate.isSame(selectedOtherDate, 'day') || iDate.isBetween(selectedStartDate, selectedEndDate)),
                isToday: iDate.isSame(moment(), 'day')
            });
        }

        // Split array into rows of 7
        allDays.forEach(function(day, index) {
            if (index % 7 === 0) {
                calendarRows.push({
                    data: [],
                    'slds-has-multi-row-selection': (index > 6 && calendarRows[calendarRows.length - 1].data[6].isSelected === true && day.isSelected === true)
                                                        || (!Ember.isNone(allDays[index + 6]) && allDays[index + 6].isSelected === true && !Ember.isNone(allDays[index + 7]) && allDays[index + 7].isSelected === true) 
                });
            }

            day.headerText = _AljsApp.AljsDatepickerFixtures.dayLabels[index % 7]['full'];

            calendarRows[calendarRows.length - 1].data.push(day);
        });
        
        // Fill last row
        if (calendarRows[calendarRows.length - 1].data.length < 7) {
            var iDate = moment(new Date(selectedYear, selectedMonth, i));
            var numColsToFill = 7 - calendarRows[calendarRows.length - 1].data.length;
            var dayIndexReference = 7 - numColsToFill - 1; // This calculation figures out the first 'day index' to start with to properlly populate the day header.
                                                           // Subtracting one to compensate for i starting at 1 below.
            for (var i = 1; i <= numColsToFill; i++) {
                calendarRows[calendarRows.length - 1].data.push({
                    value: i,
                    isCurrentMonth: false,
                    isSelected: !Ember.isNone(selectedDate) && (iDate.isSame(selectedDate, 'day') || iDate.isSame('selectedOtherDate', 'day') || iDate.isBetween(selectedDate, selectedOtherDate)),
                    isToday: iDate.isSame(moment(), 'day'),
                    headerText: _AljsApp.AljsDatepickerFixtures.dayLabels[(dayIndexReference + i)]['full']
                });
            }
        }

        return calendarRows;
    }.property('selectedStartMonth', 'selectedStartYear', 'selectedStartDate', 'selectedEndMonth', 'selectedEndYear', 'selectedEndDate', 'inputType'),
    focusIn: function(e) {
        if ($(e.target).is('input')) {
            this.set('inputType', $(e.target).data('aljs-multi-datepicker').capitalize());
            this.openDatepicker();
        }
    },
    click: function(e) {
        e.stopPropagation();
        var $target = $(e.target);
        if (!Ember.isEmpty($target.closest('.slds-datepicker')) && Ember.isEmpty($target.closest('.datepicker__filter--year'))) {
            this.closeYearDropdown();
        }
    },
    keyPress: function(e) {
        if (e.which === 13) {
            this.setDateFromInput();
        }
    },
    triggerClickNextOrPrev: function(e) {
        var self = e.data;
        if(self.get('isOpen') === true && Ember.isEmpty(self.$().find('input:focus'))) {
            if (e.which === 37) {
                self.send('clickNextOrPrevMonth', 'prev');
            } else if (e.which === 39) {
                self.send('clickNextOrPrevMonth', 'next');
            }
        }
    },
    openDatepicker: function() {
        var inputType = this.get('inputType');
        var otherInputType = inputType === 'Start' ? 'End' : 'Start';

        this.initCalendar(inputType);
        this.set('is' + otherInputType + 'YearOpen', false);
        this.set('is' + otherInputType + 'Open', false);
        this.set(('is' + inputType + 'Open'), true);

        Ember.run.scheduleOnce('afterRender', this, function() {
            if (Ember.isEmpty(this.get('selected' + inputType + 'Date'))) {
                this.$().find('input').blur();
            }
        });
    },
    closeDatepicker: function(e) {
        var self = this;

        if (e) {
            self = e.data;
        }

        var inputType = self.get('inputType');

        self.set('is' + inputType + 'YearOpen', false);
        self.set('is' + inputType + 'Open', false);

        self.$().find('[data-aljs-multi-datepicker="' + inputType + '"]').blur();
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
        this.get('years').findBy('isSelected', true).set('isSelected', false);
        this.get('years').findBy('value', this.get('selectedYear')).set('isSelected', true);
    }.observes('selectedYear'),
    setDateFromInput: function(){
        var inputType = this.get('inputType');
        var selectedDateText = this.get('selected' + inputType + 'DateText');

        if (Ember.isEmpty(selectedDateText)) {
            this.set('selected' + inputType + 'Date', null);
            
            this.closeDatepicker();
            this.$().find('input').trigger('selected.aljs.datepicker');
        } else {
            var momentDate = moment(new Date(selectedDateText));
            var currentYear = (new Date()).getFullYear();
            var earliestCalendarYear = new Date(currentYear - this.get('numYearsBefore'), 0, 1);
            var latestCalendarYear = new Date(currentYear + this.get('numYearsAfter'), 11, 31);

            if (momentDate && momentDate.isValid() && momentDate.isAfter(earliestCalendarYear) && momentDate.isBefore(latestCalendarYear)) {
                this.set('selected' + inputType + 'Date', momentDate);
                
                this.closeDatepicker();
                this.$().find('input').trigger('selected.aljs.datepicker');
            }
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
            var inputType = this.get('inputType');
            var selectedMonthString = 'selected' + inputType + 'Month';
            var selectedYearString = 'selected' + inputType + 'Year';
            var selectedMonth = this.get(selectedMonthString);

            if (direction === 'next') {
                if (selectedMonth === 11) {
                    this.set(selectedMonthString, 0);
                    this.incrementProperty(selectedYearString);
                } else {
                    this.incrementProperty(selectedMonthString);
                }
            } else if (direction === 'prev') {
                if (selectedMonth === 0) {
                    this.set(selectedMonthString, 11);
                    this.decrementProperty(selectedYearString);
                } else {
                    this.decrementProperty(selectedMonthString);
                }
            }
        },
        clickSelectDate: function(dayObj) {
            var inputType = this.get('inputType');

            var selectedMonth = this.get('selected' + inputType + 'Month');
            var selectedYear = this.get('selected' + inputType + 'Year');
            var selectedDay = dayObj.value;

            if (dayObj.isCurrentMonth === true) {
                this.set('selected' + inputType + 'Date', moment(new Date(selectedYear, selectedMonth, selectedDay)));
                this.set('selected' + inputType + 'DateText', moment(new Date(selectedYear, selectedMonth, selectedDay)).format(this.getWithDefault('format', 'MM/DD/YYYY')));
                
                this.closeDatepicker();

                this.$().find('input').trigger('selected.aljs.datepicker');
            }
        },
        clickStartEventIcon: function() {
            this.$().find('[data-aljs-multi-datepicker="start"]').focus();
        },
        clickEndEventIcon: function() {
            this.$().find('[data-aljs-multi-datepicker="end"]').focus();
        }
    }
});