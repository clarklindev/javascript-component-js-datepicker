class Datepicker {
	//cater for index 0
	constructor(
		obj,
		startYear = null,
    startMonth = null,
		startOfWeek = "sun",
		limitStartYear = null,
		limitStartYearMonth = null,
		limitEndYear = null,
		limitEndYearMonth = null
	) {
		this.instance = obj;
		// console.log("this.instance: ", this.instance);

		// DO NOT EDIT ORDER... this is tracked by this.startOfWeek
		this.daysOfWeekLabels = {
			0: "sun",
			1: "mon",
			2: "tue",
			3: "wed",
			4: "thu",
			5: "fri",
			6: "sat"
		};

		this.monthsOfYear = {
			0: "january",
			1: "february",
			2: "march",
			3: "april",
			4: "may",
			5: "june",
			6: "july",
			7: "august",
			8: "september",
			9: "october",
			10: "november",
			11: "december"
		};

		//tracks which state we are in, picking days/months/years
		this.datePickerStateOptions = {
			0: "yearandmonth",
			1: "year",
			2: "month"
		};

		this.dateinput = this.instance.querySelector(".dateinput");
		this.calendar = this.instance.querySelector(".calendar");
		this.calendarDayView = this.instance.querySelector(".calendar-dayview");
		this.calendarMonthView = this.instance.querySelector(".calendar-monthview");
		this.calendarYearview = this.instance.querySelector(".calendar-yearview");

		this.chevronTop = this.calendar.querySelector(".chevron.top");
		this.chevronBottom = this.calendar.querySelector(".chevron.bottom");

		this.htmlYearAndMonth = this.instance.querySelector(".yearandmonth");
		this.htmlDaysOfMonth = this.instance.querySelector(".calendar-daysofmonth");
		this.htmlMonthsOfYear = this.instance.querySelector(".calendar-monthsofyear");
		this.htmlYearsOfDecade = this.instance.querySelector(".calendar-decades");

		//keep track of where we are on calendar
		this.limitStartYear = limitStartYear;
		this.limitStartYearMonth = limitStartYearMonth;
		this.limitEndYear = limitEndYear;
		this.limitEndYearMonth = limitEndYearMonth;

		this.startYear = startYear === null ? new Date().getFullYear() : startYear;
    this.startMonth = startMonth === null ? new Date().getMonth() : startMonth - 1; //startMonth is zero indexd
		this.startOfWeek = startOfWeek; //mon || sun

    this.currentMonth = this.startMonth; //zero-index value
		this.currentYear = this.startYear;
		this.currentDecade = this.getDecade(this.currentYear); //temp variable to store when selecting decade
    
    this.htmlPickedDay = null;
    this.pickedDate = null;    

		this.dateinput.addEventListener("click", this.onShowCalendar);
		this.chevronTop.addEventListener("click", this.leftClickHandler);
		this.chevronBottom.addEventListener("click", this.rightClickHandler);
		this.htmlDaysOfMonth.addEventListener("click", this.dayClickHandler);
		this.htmlMonthsOfYear.addEventListener("click", this.monthClickHandler);
		this.htmlYearsOfDecade.addEventListener("click", this.decadeClickHandler);
		this.htmlYearAndMonth.addEventListener("click", this.yearAndMonthClickHandler);
		//class listener
		this.instance.addEventListener("leftclick", this.changeDateHandler);
		this.instance.addEventListener("rightclick", this.changeDateHandler);

		//set initial state
		this.datePickerState = this.datePickerStateOptions[0];  
    
    this.generateWeekdays();
		this.updateDate(this.currentMonth, this.currentYear);
		this.generateCalendarMonths();
    this.generateCalendarDecade();
	}

  //call this function when month//year changes
	updateDate = (monthIndex, year) => {
		this.generateDaysOfMonth(monthIndex, year);
		this.generateYearAndMonth(monthIndex, year);
	};

	//pass in 2 optional props: month(zero indexed), year.
	//default uses current month and year
	//returns zero index day of week 0-sunday...6-saturday
	firstDayInMonthIndex = (
		monthIndex = new Date().getMonth(),
		year = new Date().getFullYear()
	) => {
		let month = monthIndex + 1;
		return new Date(`${year}-${month}-01`).getDay();
	};

	//returns 0 or 1,
	//defaults to using current year
	isLeapYear = (year = new Date().getFullYear()) => {
		return year % 4 || (year % 100 === 0 && year % 400) ? 0 : 1;
	};

	//get decade - returns YYYY where rounded to closest decade
	getDecade = (year = new Date().getFullYear()) => {
		//take the year, divide by ten, then rid the decimal by flooring it, then multiply by 10
		return Math.floor(year / 10) * 10;
	};

	//calculates amount of days in a month of specific year
	//default: current month, current year
	//NOTE: this function gives same results as when using Date() like:
	/*
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth()+1, 0); //the ,0 is getting the last day of previous month, and so we +1 to current month
    */
	daysInMonth = (
		monthIndex = new Date().getMonth(),
		year = new Date().getFullYear()
	) => {
		let month = monthIndex + 1;
		return month === 2
			? 28 + this.isLeapYear(year)
			: 31 - (((month - 1) % 7) % 2);
	};

	//creates the header for days of week
	generateWeekdays = () => {
		let daysOfWeek = this.instance.querySelector(".calendar-daysofweek");
		daysOfWeek.innerHTML = "";
		let row = document.createElement("tr");

		for (let i = 0; i < Object.keys(this.daysOfWeekLabels).length; i++) {
			let day = document.createElement("th");
			let posInArray;

			//start of week is sunday
			if (this.startOfWeek === this.daysOfWeekLabels[0]) {
				posInArray = i;
			}
			//start of week is monday
			else if (this.startOfWeek === this.daysOfWeekLabels[1]) {
        posInArray = (i === 6) ? 0 : i + 1; //if i is 6 while looping, use 0,
			}
			let dayText = document.createTextNode(this.daysOfWeekLabels[posInArray]);
			day.appendChild(dayText);
			row.appendChild(day);
			daysOfWeek.appendChild(row);
		}
	};

	//creates the days of the month
	generateDaysOfMonth = (
		monthIndex = new Date().getMonth(),
		year = new Date().getFullYear()
	) => {
		//rows = 5 (weeks) in month
		this.htmlDaysOfMonth.innerHTML = "";

		let firstDay = this.firstDayInMonthIndex(monthIndex, year);
		let daysInMonthCount = this.daysInMonth(monthIndex, year);
		console.log("daysInMonthCount:", daysInMonthCount);

		let startCounting = false;
		let dayCount = 1;
		let rows = 5; //needs to be 5 to cater for 1st starting on last day of generated week (Sat) which would push another row

		for (let i = 0; i <= rows; i++) {
			let row = document.createElement("tr");
			//populate month from 1st on that day of week
			for (let j = 1; j <= 7; j++) {
				if (startCounting === false) {
					//has not started counting yet, firstDay is zeroIndexed starting with 0
					if (this.startOfWeek === "mon") {
						//start counting at j or when j = 7 is a sun
						if (firstDay === j || (firstDay === 0 && j === 7)) {
							console.log("start day of month: ", j);
							startCounting = true;
						}
					} else if (this.startOfWeek === "sun") {
						if (firstDay === j - 1) {
							console.log("start day of month: ", j - 1);
							startCounting = true;
						}
					}
				}
				//get first day of week place in j
				let td = document.createElement("td");
				let day = document.createElement("div");
				let dayText = document.createTextNode("");

				if (startCounting && dayCount <= daysInMonthCount) {
					td.appendChild(day);
					dayText = document.createTextNode(dayCount);
					dayCount++;
					day.appendChild(dayText);
					day.classList.add("day");
				}

				row.appendChild(td);

				//selected day is highlighted
				if (
					this.pickedDate &&
					(this.currentYear === this.pickedDate.getFullYear() &&
						this.currentMonth === this.pickedDate.getMonth())
				) {
          //compare the text and picked date, if equal...
					if (
						parseInt(dayText.nodeValue) === parseInt(this.pickedDate.getDate())
					) {
						this.htmlPickedDay = day;
						this.htmlPickedDay.classList.add("active");
					}
				}
			}
			this.htmlDaysOfMonth.appendChild(row);
		}
	};

	//generate current view year - yyyy
	generateYear = (year = new Date().getFullYear()) => {
		this.htmlYearAndMonth.querySelector(".year").innerHTML = "";
		this.htmlYearAndMonth
			.querySelector(".year")
			.appendChild(document.createTextNode(year));
	};

  //generate current decade format: yyyy-yyyy
	generateDecade = (year = new Date().getFullYear()) => {
		console.log("generateDecade: ", year);
		this.htmlYearAndMonth.querySelector(".year").innerHTML = "";
    let decadeString = this.getDecade(year);
    //format decade range to yyyy-yyyy (decade is 10 years, counting from 0-9 years) 
		let decadeRange = `${decadeString}-${decadeString + 9}`;
		this.htmlYearAndMonth
			.querySelector(".year")
			.appendChild(document.createTextNode(decadeRange));
	};

	//generate current view month
	generateMonth = (monthIndex = new Date().getMonth()) => {
		this.htmlYearAndMonth.querySelector(".month").innerHTML = "";
    let monthString = this.monthsOfYear[monthIndex];
    //Capitalize first letter
		let monthStringFormatted =
			monthString.charAt(0).toUpperCase() + monthString.slice(1);
		this.htmlYearAndMonth
			.querySelector(".month")
			.appendChild(document.createTextNode(monthStringFormatted));
	};

	//generate current year and month
	generateYearAndMonth = (
		monthIndex = new Date().getMonth(),
		year = new Date().getFullYear()
	) => {
		this.generateYear(year);
		this.generateMonth(monthIndex);
	};

	generateCalendarMonths = () => {
		const totalMonths = Object.keys(this.monthsOfYear).length;
		const rows = 4;
		const cols = 3;
		let counter = 0;
		let calendarMonthsOfYear = this.calendarMonthView.querySelector(
			".calendar-monthsofyear"
		);
		for (var k = 0; k < rows; k++) {
			let row = document.createElement("tr");
			for (var i = 0; i < cols; i++) {
				if (counter < totalMonths) {
					let td = document.createElement("td");
					let month = document.createElement("div");
					let monthString = this.monthsOfYear[counter];
					let monthStringFormatted =
						monthString.charAt(0).toUpperCase() + monthString.slice(1, 3);
					month.appendChild(document.createTextNode(monthStringFormatted));
					month.classList.add("month");
					td.appendChild(month);
					row.appendChild(td);
					counter++;
				}
			}
			calendarMonthsOfYear.appendChild(row);
		}
	};

	//generate years for decade
	generateCalendarDecade = () => {
		const totalYears = 10;
		const rows = 5;
		const cols = 2;
		let counter = 0;
		console.log("this.calendarYearview:", this.calendarYearview);
		let calendarYearsOfDecade = this.calendarYearview.querySelector(
			".calendar-decades"
		);
    calendarYearsOfDecade.innerHTML = "";
    let decade = this.getDecade(this.currentDecade);

    console.log('decade: ', decade);
		for (var k = 0; k < rows; k++) {
			let row = document.createElement("tr");
			for (var i = 0; i < cols; i++) {
				if (counter < totalYears) {
					let td = document.createElement("td");
					let year = document.createElement("div");
					let yearString = decade + counter;
					console.log("yearString: ", yearString);
					year.appendChild(document.createTextNode(yearString));
					year.classList.add("year");
					td.appendChild(year);
					row.appendChild(td);
					counter++;
				}
			}
			calendarYearsOfDecade.appendChild(row);
		}
	};

	// Show an element
	show = elem => {
		elem.classList.remove("hide");
	};

	// Hide an element
	hide = elem => {
		elem.classList.add("hide");
	};

	//when input or calendar icon is clicked
	onShowCalendar = () => {
		console.log("onShowCalendar");
		//filter all calendar and hide and show this one
		let allCalendar = document.querySelectorAll(".calendar");
		if (this.pickedDate) {
			//make sure that if we move away and close the calendar, when we open it again it is on the same day/month as that which was picked
			this.currentMonth = this.pickedDate.getMonth();
			this.currentYear = this.pickedDate.getFullYear();
			this.currentDecade = this.getDecade(this.currentYear);
			console.log("picked month: ", this.pickedDate.getMonth());
			this.updateDate(
				this.pickedDate.getMonth(),
				this.pickedDate.getFullYear()
			);
		} else {
			//use current date
			this.currentMonth = new Date().getMonth();
			this.currentYear = new Date().getFullYear();
			this.updateDate(this.currentMonth, this.currentYear);
			this.currentDecade = this.getDecade(this.currentYear);
		}
		Array.from(allCalendar).filter(each => {
			if (each === this.calendar) {
				each.classList.toggle("active");
				//hide year
				this.hide(this.calendarYearview);
				//hide month
				this.hide(this.calendarMonthView);
				//show days
				this.show(this.calendarDayView);
				this.show(this.htmlYearAndMonth.querySelector(".month"));
				//show arrows
				this.show(this.chevronTop);
				this.show(this.chevronBottom);
				this.datePickerState = this.datePickerStateOptions[0];
			} else {
				each.classList.toggle("active", false);
			}
		});
	};

	yearAndMonthClickHandler = event => {
		switch (event.target.className) {
			case "year":
				console.log("year");
				//setting state
				//only generate if current state is not on decade
				if (this.datePickerState !== this.datePickerStateOptions[1]) {
          this.datePickerState = this.datePickerStateOptions[1];
          this.generateCalendarDecade();
          this.generateDecade(this.currentYear);        
        }
				//show arrows
				this.show(this.chevronTop);
				this.show(this.chevronBottom);
				this.hide(this.htmlYearAndMonth.querySelector(".month"));
				//hide days
				this.hide(this.calendarDayView);
				//hide month
				this.hide(this.calendarMonthView);
				//show years
				this.show(this.calendarYearview);

				break;
			case "month":
				console.log("month");
				//setting state
				this.datePickerState = this.datePickerStateOptions[2];
				//hide arrows
				this.hide(this.chevronTop);
				this.hide(this.chevronBottom);
				this.hide(this.htmlYearAndMonth.querySelector(".month"));
				//hide year
				this.hide(this.calendarYearview);
				//show month
				this.show(this.calendarMonthView);
				//hide days
				this.hide(this.calendarDayView);
				break;
		}
	};

	decadeClickHandler = event => {
    if (event.target.className === "year") {
			console.log("target: ", event.target.className);
      console.log("event.target.innerText: ", event.target.innerText);
      this.currentYear = event.target.innerText;
    }

    //show days
		this.show(this.calendarDayView);
		this.updateDate(this.currentMonth, this.currentYear);
		//show arrows
		this.show(this.chevronTop);
		this.show(this.chevronBottom);
		this.show(this.htmlYearAndMonth.querySelector(".month"));
		//hide month
		this.hide(this.calendarMonthView);
		//hide years
		this.hide(this.calendarYearview);
		//set the state to picking day
		this.datePickerState = this.datePickerStateOptions[0];
  };

	monthClickHandler = event => {
		if (event.target.className === "month") {
			console.log("target: ", event.target.className);
			console.log("event.target.innerText: ", event.target.innerText);
		}

		//goto day view
		let selectedMonth = Object.keys(this.monthsOfYear).filter(key => {
			let monthInMonthsOfYear = this.monthsOfYear[key]
				.substr(0, 3)
				.toLowerCase();
			let clickedMonth = event.target.innerText.toLowerCase();
			// console.log('in arr: ', monthInMonthsOfYear, 'clicked Month: ', clickedMonth);
			return monthInMonthsOfYear === clickedMonth;
		});
		console.log("selectedMonth:", parseInt(selectedMonth[0])); //zero-indexed+1 for viewer to see which month
		this.currentMonth = parseInt(selectedMonth[0]);
		//show days
    this.show(this.calendarDayView);
    this.updateDate(this.currentMonth, this.currentYear);
		//show arrows
		this.show(this.chevronTop);
		this.show(this.chevronBottom);
		this.show(this.htmlYearAndMonth.querySelector(".month"));
		//hide month
		this.hide(this.calendarMonthView);
		//hide years
		this.hide(this.calendarYearview);
		
		//set the state to picking day
		this.datePickerState = this.datePickerStateOptions[0];
	};

	dayClickHandler = event => {
		if (event.target.className === "day") {
			console.log("target:", event.target.className);

			if (this.htmlPickedDay !== null) {
				this.htmlPickedDay.classList.remove("active");
			}
			this.htmlPickedDay = event.target;
			//add styling by adding an active class
			this.htmlPickedDay.classList.add("active");
			//the day
			let day = Math.abs(this.htmlPickedDay.innerHTML);
			console.log("day:", day);
			//create new date and assign to pickedDate
			//cater for zero index
			this.pickedDate = new Date(
				`${this.currentYear}-${this.currentMonth + 1}-${day}`
			);
			console.log("pickedDate:", this.pickedDate); //month is not indexed

			//set the state to picking day
			this.datePickerState = this.datePickerStateOptions[0];
			this.show(this.htmlYearAndMonth.querySelector(".month"));

      //update the input field
			this.updateInputHandler(this.pickedDate);
		}
  };
  
  updateInputHandler = (date) =>{
    //put text in input, pad with extra 0 if only one digit
    let formattedDate =
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0");
    console.log("formattedDate: ", formattedDate);
    this.dateinput.querySelector("input").value = formattedDate;
  }

	leftClickHandler = () => {
		// console.log("dispatch: leftclick");
		this.instance.dispatchEvent(new Event("leftclick"));
	};

	rightClickHandler = () => {
		// console.log('dispatch: rightclick');
		this.instance.dispatchEvent(new Event("rightclick"));
	};

  //this function is called when month/year is updated
  //left click and right click are multifunction
	changeDateHandler = event => {
		let shouldUpdate = false;
		switch (event.type) {
			case "leftclick":
				switch (this.datePickerState) {
					case "yearandmonth":
            //left
            //if no limits to start year
						if (
							this.currentYear > this.limitStartYear ||
							this.limitStartYear === null
						) {
							this.currentMonth--;
              shouldUpdate = true;
              //when current month gets to 0, make it 11
							if (this.currentMonth < 0) {
								this.currentMonth = 11;
								this.currentYear--;
							}
            }
            //when current year is the limit 
            else if (this.currentYear === this.limitStartYear) {
              //-1 caters for index in array
              //make sure that the year wont go less than limit
							if (
								(this.currentMonth > 0 && this.limitStartYearMonth === null) ||
								this.currentMonth > this.limitStartYearMonth - 1
							) {
								shouldUpdate = true;
								this.currentMonth--;
							}
						} else {
							console.log("date is out of bounds");
            }
            //update decade
            this.currentDecade = this.getDecade(this.currentYear);
						break;
					case "year":
						console.log("year");
						if (this.currentDecade === null) {
							this.currentDecade = this.getDecade(this.currentYear);
						}
						let previousDecade = parseInt(this.currentDecade - 10);
						console.log("previousDecade: ", previousDecade);
						this.generateDecade(previousDecade);
						this.currentDecade = previousDecade;
						this.generateCalendarDecade();
						break;
				}
				break;

			case "rightclick":
				switch (this.datePickerState) {
					case "yearandmonth":
						//right
						if (
							this.currentYear < this.limitEndYear ||
							this.limitEndYear === null
						) {
							this.currentMonth++;
							shouldUpdate = true;
							if (this.currentMonth > 11) {
								this.currentMonth = 0;
								this.currentYear++;
							}
						} else if (this.currentYear === this.limitEndYear) {
							//-1 caters for index in array
							if (
								(this.currentMonth < 11 && this.limitEndYearMonth === null) ||
								this.currentMonth < this.limitEndYearMonth - 1
							) {
								shouldUpdate = true;
								this.currentMonth++;
							}
						} else {
							console.log("date is out of bounds");
            }
            //update decade
            this.currentDecade = this.getDecade(this.currentYear);
						break;
					case "year":
						console.log("year");
						if (this.currentDecade === null) {
							this.currentDecade = this.getDecade(this.currentYear);
						}
						let nextDecade = parseInt(this.currentDecade + 10);
						console.log("nextDecade: ", nextDecade);
						this.generateDecade(nextDecade);
						this.currentDecade = nextDecade;
						this.generateCalendarDecade();
						break;
				}
				break;
		}
		//update
		if (shouldUpdate) {
			console.log("changeDateHandler: ", event.type);
			this.updateDate(this.currentMonth, this.currentYear);
		}
	};
}

// DatePicker(
// startYear,
// startMonth,
// startOfWeek,
// limitStartYear,
// limitStartYearMonth,
// limitEndYear,
// limitEndYearMonth)

//constructor values are non-zero indexed

//startYear > 0, current year: new Date().getFullYear() or null
//startMonth = 1-12, current month: new Date().getMonth() or null

//startOfWeek = "mon" || "sun"

//limitStartYear < startYear
//0 < limitStartMonth < 12

//limitEndYear > startYear
//0 < limitEndMonth < 12

//currently all defaults start with same value can create array and assign possitions then use the index of map to assign different values
//overlapping elements
Array.from(document.getElementsByClassName("datepicker")).map(
	(instance, index) => {
		return new Datepicker(instance, null, null, "sun", null, null, null, null);
	}
);
