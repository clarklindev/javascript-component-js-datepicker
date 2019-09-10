class DatePicker {
	constructor() {
		this.datepicker = document.querySelector('input[name="date-input"]');
		this.datepicker.addEventListener("click", this.onChooseDate);
		this.calendar = document.querySelector(".calendar");
		this.daysOfWeekLabels = {
      0: "sun",
      1: "mon",
			2: "tue",
			3: "wed",
			4: "thu",
			5: "fri",
      6: "sat",		      	
    };
    this.monthsOfYear = {
      0: 'january',
      1: 'february',
      2: 'march',
      3: 'april',
      4: 'may',
      5: 'june',
      6: 'july',
      7: 'august',
      8: 'september',
      9: 'october',
      10: 'november',
      11: 'december'
    }
    this.startOfWeek = "mon"; //mon || sun
		this.generateWeekdays();
    this.generateDaysOfMonth();
    this.generateYearAndMonth();
	}

  //pass in 2 optional props: month(zero indexed), year
  //returns zero index day of week 0-sunday...6-saturday
	firstDayInMonthIndex = (
		monthIndex = new Date().getMonth(),
		year = new Date().getFullYear()
	) => {
		return new Date(`${year}-${monthIndex + 1}-01`).getDay();
  };
  
  //returns 0 or 1, defaults to using current year
  isLeapYear = (year=new Date().getFullYear()) => {
    return (year % 4) || ((year % 100 === 0) && (year % 400)) ? 0 : 1;
  }

  //calculates amount of days in a month of specific year, default: current month, current year
  daysInMonth = (monthIndex = new Date().getMonth(), year = new Date().getFullYear()) => {
    let month = monthIndex + 1;
    return (month === 2) ? (28 + isLeapYear(year)) : 31 - (month - 1) % 7 % 2;
  }
    
	//creates the header for days of week
	generateWeekdays = () => {
		let daysOfWeek = document.querySelector(".calendar-daysofweek");
		for (let i = 0; i < 7; i++) {
      let day = document.createElement("td");
      let posInArray;
      if(this.startOfWeek === "sun"){
        posInArray = i;
      }
      else if(this.startOfWeek === "mon"){
        posInArray = i+1;
        if(i === 6){
          posInArray = 0;
        }
      }
			let dayText = document.createTextNode(this.daysOfWeekLabels[posInArray]);
			day.appendChild(dayText);
			daysOfWeek.appendChild(day);
		}
  };

	//creates the days of the month
	generateDaysOfMonth = () => {
		//rows = 5 (weeks) in month
		let htmlDaysOfMonth = document.querySelector(".calendar-daysofmonth");
    
    let firstDay = this.firstDayInMonthIndex();//of current month sunday = 0
    let daysInMonthCount = this.daysInMonth();
    console.log('daysInMonthCount:', daysInMonthCount);

    let startCounting = false;
    let dayCount = 1;
    let rows = 5;//needs to be 5 to cater for 1st starting on last day of generated week (Sat) which would push another row
    
		for (let i = 0; i <= rows; i++) {
			let row = document.createElement("tr");
			//populate month from 1st on that day of week
      for (let j = 1; j <= 7; j++) {
        if(startCounting === false){
          //has not started counting yet, firstDay is zeroIndexed starting with 0
          if(this.startOfWeek === 'mon'){
            //start counting at j or when j = 7 is a sun
            if(firstDay === j || (firstDay===0 && j===7)){
              console.log('here j: ', j);
              startCounting = true;
            }
          }
          else if(this.startOfWeek === 'sun'){
            if(firstDay === j-1){          
              console.log('here j: ', j);
              startCounting = true;
            }
          }
        }
				//get first day of week place in j     
        let day = document.createElement("td");      
        let dayText = document.createTextNode("");   
        if(startCounting && dayCount <= daysInMonthCount){             
          dayText = document.createTextNode(dayCount);         
          dayCount++;          
        }   
        day.appendChild(dayText);
        row.appendChild(day);
			}
			htmlDaysOfMonth.appendChild(row);
		}
  };
  
  generateYearAndMonth = (monthIndex = new Date().getMonth(), year = new Date().getFullYear()) => {
    let htmlYearAndMonth = document.querySelector(".yearandmonth");
    htmlYearAndMonth.querySelector('.year').appendChild(document.createTextNode(year));
    htmlYearAndMonth.querySelector('.month').appendChild(document.createTextNode(this.monthsOfYear[monthIndex]));
  }

	onChooseDate = () => {
		console.log("onChooseDate");
		this.calendar.classList.toggle("active");
	};

	onChooseYear = () => {
		console.log("hello world");
	};
}

let d = new DatePicker();
