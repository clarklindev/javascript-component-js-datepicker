class DatePicker {
	constructor() {
		this.datepicker = document.querySelector('input[name="date-input"]');
		this.datepicker.addEventListener("click", this.onChooseDate);
		this.calendar = document.querySelector(".calendar");
		this.daysOfWeekLabels = {
			0: "mon",
			1: "tue",
			2: "wed",
			3: "thu",
			4: "fri",
			5: "sat",
			6: "sun"
		};
		this.generateWeekdays();
		this.generateDaysOfMonth();
	}

	firstDayInMonthIndex = (
		monthIndex = new Date().getMonth(),
		year = new Date().getFullYear()
	) => {
		return new Date(`${year}-${monthIndex + 1}-01`).getDay();
	};

	//creates the header for days of week
	generateWeekdays = () => {
		let daysOfWeek = document.querySelector(".calendar-daysofweek");
		for (let i = 0; i < 7; i++) {
			let day = document.createElement("td");
			let dayText = document.createTextNode(this.daysOfWeekLabels[i]);
			day.appendChild(dayText);
			daysOfWeek.appendChild(day);
		}
	};

	//creates the days of the month
	generateDaysOfMonth = () => {
		//rows = 5 (weeks) in month
		let daysOfMonth = document.querySelector(".calendar-daysofmonth");
		let rows = 4;
		for (let i = 0; i <= rows; i++) {
			let row = document.createElement("tr");

			//populate month from 1st on that day of week
			for (let j = 1; j <= 7; j++) {
				let day = document.createElement("td");
				//get first day of week place in j
				console.log("day: ", this.firstDayInMonthIndex());
				let dayText = document.createTextNode(j + i * 7);
				day.appendChild(dayText);
				row.appendChild(day);
			}
			daysOfMonth.appendChild(row);
		}
	};

	onChooseDate = () => {
		console.log("onChooseDate");
		this.calendar.classList.toggle("active");
	};

	onChooseYear = () => {
		console.log("hello world");
	};
}

let d = new DatePicker();
