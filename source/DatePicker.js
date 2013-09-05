/**
	_moon.DatePicker_ is a control that can be used to display--or allow the
	selection of--a day, month, and year.

		{
			kind: "moon.DatePicker",
			noneText: "Pick a Date",
			content: "Date",
			onChange: "changed"
		}

	Set the _value_ property to a standard JavaScript Date object to initialize
	the picker, or to change it programmatically at runtime.
*/
enyo.kind({
	name: "moon.DatePicker",
	kind: "moon.DateTimePickerBase",
	published: {
		//* Optional minimum year value
		minYear: 1900,
		//* Optional maximum year value
		//* Optional label for day
		dayText: "day",
		//* Optional label for month
		monthText: "month",
		//* Optional label for year
		yearText: "year",
		maxYear: 2099
	},
	//*@protected
	iLibFormatType: "date",
	defaultOrdering: "mdy",
	setupPickers: function(ordering) {
		var orderingArr = ordering.toLowerCase().split("");
		var doneArr = [];
		var o,f,l,c;
		for(f = 0, l = orderingArr.length; f < l; f++) {
			o = orderingArr[f];
			if (doneArr.indexOf(o) < 0) {               
				doneArr.push(o);
			}
		}

		for(f = 0, l = doneArr.length; f < l; f++) {
			o = doneArr[f];
			if (f === 0) {
				c = " first";
			} else if (f == doneArr.length - 1) {
				c = " last";
			} else {
				c = "";  
			}

			switch (o) {
			case 'd':
				this.createComponent(
					{kind:"enyo.Control", name: "dayWrapper", classes: "moon-date-picker-wrap d" + c, components:[
						{kind:"moon.IntegerScrollPicker", name:"day", classes:"moon-date-picker-day", min:1,
						max:this.monthLength(this.value.getFullYear(), this.value.getMonth()), value:this.value.getDate()}
					]});
				break;
			case 'm':
				this.createComponent(
					{kind:"enyo.Control", name: "monthWrapper", classes: "moon-date-picker-wrap m" + c, components:[
						{kind:"moon.IntegerScrollPicker", name:"month", classes:"moon-date-picker-month", min:1, max:12, value:this.value.getMonth()+1}
					]});
				break;
			case 'y':
				this.createComponent(
					{kind:"enyo.Control", name: "yearWrapper", classes: "moon-date-picker-wrap y" + c, components:[
						{kind:"moon.IntegerScrollPicker", name:"year", classes:"moon-date-picker-year", value:this.value.getFullYear(), min:this.minYear, max:this.maxYear}
					]});
				break;
			default:
				break;
			}
		}

		this.$.dayWrapper.createComponent({ kind:"enyo.Control", name: "dayLabel", content : this.dayText ? this.dayText : "day", classes: "moon-date-picker-label"}, {owner: this});
		this.$.monthWrapper.createComponent({ kind:"enyo.Control", name: "monthLabel", content : this.monthText ? this.monthText : "month", style: "display:block;", classes: "moon-date-picker-label"}, {owner: this});
		this.$.yearWrapper.createComponent({ kind:"enyo.Control", name: "yearLabel", content : this.yearText ? this.yearText : "year", style: "display:block;", classes: "moon-date-picker-label"}, {owner: this});
 
		this.inherited(arguments);
	},
	formatValue: function() {
		if (this._tf) {
			return this._tf.format(new ilib.Date.GregDate({unixtime: this.value.getTime(), timezone:"UTC"}));
		} else {
			return this.getMonthName()[this.value.getMonth()] + " " + this.value.getDate() + ", " + this.value.getFullYear();
		}
	},
	updateValue: function(inSender, inEvent) {
		var day = this.$.day.getValue(),
			month = this.$.month.getValue()-1,
			year = this.$.year.getValue();

		var maxDays = this.monthLength(year, month);
		this.setValue(new Date(year, month, (day <= maxDays) ? day : maxDays));
	},
	setChildPickers: function(inOld) {
		this.$.year.setValue(this.value.getFullYear());
		this.$.month.setValue(this.value.getMonth()+1);

		if (inOld &&
			(inOld.getFullYear() != this.value.getFullYear() ||
			inOld.getMonth() != this.value.getMonth())) {
			this.$.day.setMax(this.monthLength(this.value.getFullYear(), this.value.getMonth()));
		}
		this.$.day.setValue(this.value.getDate());

		this.$.currentValue.setContent(this.formatValue());
		if (this.value) {
			this.doChange({name:this.name, value:this.value});
		}
	},
	getMonthName: function() {
		return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	},
	//* Returns number of days in a particular month/year.
	monthLength: function(inYear, inMonth) {
		return 32 - new Date(inYear, inMonth, 32).getDate();
	},
	yearTextChanged: function (inOldvalue, inNewValue) {
		this.$.yearLabel.setContent(inNewValue);
	},
	monthTextChanged: function (inOldvalue, inNewValue) {
		this.$.monthLabel.setContent(inNewValue);
	},
	dayTextChanged: function (inOldvalue, inNewValue) {
		this.$.dayLabel.setContent(inNewValue);
	}
});
