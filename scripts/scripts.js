class DatePicker {
  //cater for index 0
	constructor(startYear=null, startMonth=null, startOfWeek="sun", limitStartYear=null, limitStartYearMonth=null, limitEndYear=null, limitEndYearMonth=null) {
    this.datepicker = document.querySelector('.date-picker');
		this.calendar = document.querySelector(".calendar");
    this.arrowLeft = document.querySelector('.arrow.left');
    this.arrowRight = document.querySelector('.arrow.right');
    this.htmlDaysOfMonth = document.querySelector(".calendar-daysofmonth");

    //keep track of where we are on calendar
    this.limitStartYear = limitStartYear;
    this.limitStartYearMonth = limitStartYearMonth;
    this.limitEndYear = limitEndYear;
    this.limitEndYearMonth = limitEndYearMonth;

    this.startYear = (startYear === null)? new Date().getFullYear() : startYear;
    this.startMonth = (startMonth === null)? new Date().getMonth() : startMonth-1;//cater for zero index
    this.currentMonth = this.startMonth;//zero-index value
    this.currentYear = this.startYear;
    this.htmlPickedDay = null;
    this.pickedDate = null;

    
    this.datepicker.addEventListener("click", this.onChooseDate);
    this.arrowLeft.addEventListener('click', this.leftClickHandler);
    this.arrowRight.addEventListener('click', this.rightClickHandler);    
    this.htmlDaysOfMonth.addEventListener('click', this.dayClickHandler);  
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

    this.datePickerState = {
      0: 'yearandmonth',
      1: 'year',
      2: 'month'
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
  //NOTE: this function gives same results as when using Date() like: 
  /*
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth()+1, 0); //the ,0 is getting the last day of previous month, and so we +1 to current month
  */
  daysInMonth = (monthIndex = new Date().getMonth(), year = new Date().getFullYear()) => {
    let month = monthIndex + 1;
    return (month === 2) ? (28 + this.isLeapYear(year)) : 31 - (month - 1) % 7 % 2;
  }
    
	//creates the header for days of week
	generateWeekdays = () => {
    let daysOfWeek = document.querySelector(".calendar-daysofweek");
    daysOfWeek.innerHTML = "";
    let row = document.createElement("tr");

		for (let i = 0; i < Object.keys(this.daysOfWeekLabels).length; i++) {
      let day = document.createElement("th");
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
      daysOfWeek.appendChild(row);
			row.appendChild(day);
		}
  };

	//creates the days of the month
	generateDaysOfMonth = (monthIndex = new Date().getMonth(), year = new Date().getFullYear()) => {
		//rows = 5 (weeks) in month
    this.htmlDaysOfMonth.innerHTML = "";

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
        let td = document.createElement("td"); 
        let day = document.createElement("div");     
        let dayText = document.createTextNode("");  

        if(startCounting && dayCount <= daysInMonthCount){   
          td.appendChild(day);      
          dayText = document.createTextNode(dayCount);         
          dayCount++;
          day.appendChild(dayText);
          day.classList.add('day');
                  
        }  
           
        row.appendChild(td);

        //selected day is highlighted
        if(this.pickedDate && ((this.currentYear === this.pickedDate.getFullYear()) && (this.currentMonth === this.pickedDate.getMonth())) ){
          if(parseInt(dayText.nodeValue) === parseInt(this.pickedDate.getDate()) ){
            this.htmlPickedDay = day;
            this.htmlPickedDay.classList.add('active');
          }
        }
      
      }
			this.htmlDaysOfMonth.appendChild(row);
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
		this.calendar.classList.toggle("active");
	};

	onChooseYear = () => {
		console.log("hello world");
  };

  dayClickHandler = (event) => {
    if(event.target.className === 'day'){
      console.log('target:', event.target.className);

      if(this.htmlPickedDay !== null){
        this.htmlPickedDay.classList.remove('active');
      }
      this.htmlPickedDay = event.target;
      //add styling by adding an active class
      this.htmlPickedDay.classList.add('active');
      //the day
      let day = Math.abs(this.htmlPickedDay.innerHTML);
      console.log('day:', day);
      //create new date and assign to pickedDate
      //cater for zero index
      this.pickedDate = new Date(`${this.currentYear}-${this.currentMonth+1}-${day}`);
      console.log('pickedDate:', this.pickedDate); //month is not indexed

      //put text in input
      let formattedDate = this.pickedDate.getFullYear() + '-' + String(this.pickedDate.getMonth()+1).padStart(2,'0') + "-" + String(this.pickedDate.getDate()).padStart(2,'0');
      console.log('formattedDate: ', formattedDate);
      this.datepicker.querySelector('input').value = formattedDate;
    }
  }

  leftClickHandler = () => {
    // console.log('dispatch: leftclick');
    dispatchEvent(new Event('leftclick'));
  }

  rightClickHandler = () => {
    // console.log('dispatch: rightclick');    
    dispatchEvent(new Event('rightclick'));
  }

  //this function is called when month/year is updated
  changeDateHandler = (event) => {
    let updateDate = false;
    switch(event.type){
      case 'leftclick':
        //left 
        if(this.currentYear > this.limitStartYear || this.limitStartYear === null){
          this.currentMonth--;
          updateDate = true;
          if(this.currentMonth < 0){
            this.currentMonth = 11;
            this.currentYear--;
          }
        }
        else if(this.currentYear === this.limitStartYear){
          //-1 caters for index in array
          if( (this.currentMonth > 0 && this.limitStartYearMonth===null) || (this.currentMonth > this.limitStartYearMonth-1)){
            updateDate = true;
            this.currentMonth--;
          }
        }
        else{
          console.log('date is out of bounds');
        }
        break;
      case 'rightclick':
        //right
        if(this.currentYear < this.limitEndYear || this.limitEndYear === null){
          this.currentMonth++;
          updateDate = true;
          if(this.currentMonth > 11){
            this.currentMonth = 0;
            this.currentYear++;
          }
        }
        else if(this.currentYear === this.limitEndYear){
          //-1 caters for index in array
          if( (this.currentMonth < 11 && this.limitEndYearMonth===null) || (this.currentMonth < this.limitEndYearMonth-1)){
            updateDate = true;
            this.currentMonth++;
          }
        }
        else{
          console.log('date is out of bounds');
        }
        break;
    }
    //update
    if(updateDate){
      console.log('changeDateHandler: ', event.type);
      this.updateDate(this.currentMonth, this.currentYear);
    }
  }
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
let d = new DatePicker(1971, 9, "sun", 1970, 1, 1971,12);