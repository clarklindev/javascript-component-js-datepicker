class DatePicker {
	constructor(startMonth=new Date().getMonth(), startYear=new Date().getFullYear(), startOfWeek="sun", limitStartYear=null, limitEndYear=null) {
		this.datepicker = document.querySelector('input[name="date-input"]');
		this.calendar = document.querySelector(".calendar");
    this.arrowLeft = document.querySelector('.arrow.left');
    this.arrowRight = document.querySelector('.arrow.right');

    //keep track of where we are on calendar
    this.limitStartYear = limitStartYear;
    this.limitEndYear = limitEndYear;
    this.startMonth = startMonth;
    this.startYear = startYear;
    this.currentMonth = startMonth;
    this.currentYear = startYear;

    //eventlistener
    this.datepicker.addEventListener("click", this.onChooseDate);
    this.arrowLeft.addEventListener('click', this.leftClickHandler);
    this.arrowRight.addEventListener('click', this.rightClickHandler);    
    addEventListener('leftclick', this.changeDateHandler);
    addEventListener('rightclick', this.changeDateHandler);

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
    this.startOfWeek = startOfWeek; //mon || sun
    this.generateWeekdays();
    this.updateDate(this.currentMonth, this.currentYear);
  }
  
  updateDate = (monthIndex, year) =>{
    this.generateDaysOfMonth(monthIndex, year);
    this.generateYearAndMonth(monthIndex, year);    
  }

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
  isLeapYear = (year=new Date().getFullYear()) => {
    return (year % 4) || ((year % 100 === 0) && (year % 400)) ? 0 : 1;
  }

  //calculates amount of days in a month of specific year
  //default: current month, current year
  daysInMonth = (monthIndex = new Date().getMonth(), year = new Date().getFullYear()) => {
    let month = monthIndex + 1;
    return (month === 2) ? (28 + this.isLeapYear(year)) : 31 - (month - 1) % 7 % 2;
  }
    
	//creates the header for days of week
	generateWeekdays = () => {
    let daysOfWeek = document.querySelector(".calendar-daysofweek");
    daysOfWeek.innerHTML = "";
		for (let i = 0; i < Object.keys(this.daysOfWeekLabels).length; i++) {
      let day = document.createElement("td");
      let posInArray;

      //start of week is sunday
      if(this.startOfWeek === this.daysOfWeekLabels[0]){
        posInArray = i;
      }

      //start of week is monday
      else if(this.startOfWeek === this.daysOfWeekLabels[1]){
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
	generateDaysOfMonth = (monthIndex = new Date().getMonth(), year = new Date().getFullYear()) => {
		//rows = 5 (weeks) in month
    let htmlDaysOfMonth = document.querySelector(".calendar-daysofmonth");
    htmlDaysOfMonth.innerHTML = "";
    
    let firstDay = this.firstDayInMonthIndex(monthIndex, year);
    let daysInMonthCount = this.daysInMonth(monthIndex, year);
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
              console.log('start day of month: ', j);
              startCounting = true;
            }
          }
          else if(this.startOfWeek === 'sun'){
            if(firstDay === j-1){          
              console.log('start day of month: ', j-1);
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
    htmlYearAndMonth.querySelector('.year').innerHTML = "";
    htmlYearAndMonth.querySelector('.month').innerHTML = "";
    htmlYearAndMonth.querySelector('.year').appendChild(document.createTextNode(year));
    htmlYearAndMonth.querySelector('.month').appendChild(document.createTextNode(this.monthsOfYear[monthIndex]));
  }

	onChooseDate = () => {
		console.log("onChooseDate");
		//this.calendar.classList.toggle("active");
	};

	onChooseYear = () => {
		console.log("hello world");
  };
  
  leftClickHandler = () => {
    console.log('dispatch: leftclick');
    dispatchEvent(new Event('leftclick'));
  }

  rightClickHandler = () => {
    console.log('dispatch: rightclick');    
    dispatchEvent(new Event('rightclick'));
  }

  //this function is called when month/year is updated
  changeDateHandler = (event) => {
    console.log('changeDateHandler: ', event.type);
    switch(event.type){
      case 'leftclick':
        //left 
        if(this.currentYear > this.limitStartYear || this.limitStartYear === null){
          this.currentMonth--;
          if(this.currentMonth < 0){
            this.currentMonth = 11;
            this.currentYear--;
          }
        }
        else if(this.currentYear === this.limitStartYear){
          if(this.currentMonth > 0){
            this.currentMonth--;
          }
        }
        break;
      case 'rightclick':
        //right
        if(this.currentYear < this.limitEndYear || this.limitEndYear === null){
          this.currentMonth++;
          if(this.currentMonth > 11){
            this.currentMonth = 0;
            this.currentYear++;
          }
        }
        else if(this.currentYear === this.limitEndYear){
          if(this.currentMonth < 11){
            this.currentMonth++;
          }
        }
        break;
    }
    //update
    this.updateDate(this.currentMonth, this.currentYear);
  }
}

let d = new DatePicker(0, 2100,"mon",2099,2101);
