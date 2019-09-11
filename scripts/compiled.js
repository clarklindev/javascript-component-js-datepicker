"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DatePicker = //cater for index 0
function DatePicker(startYear, startMonth, startOfWeek, limitStartYear, limitStartYearMonth, limitEndYear, limitEndYearMonth) {
  var _this = this;

  if (startYear === void 0) {
    startYear = null;
  }

  if (startMonth === void 0) {
    startMonth = null;
  }

  if (startOfWeek === void 0) {
    startOfWeek = "sun";
  }

  if (limitStartYear === void 0) {
    limitStartYear = null;
  }

  if (limitStartYearMonth === void 0) {
    limitStartYearMonth = null;
  }

  if (limitEndYear === void 0) {
    limitEndYear = null;
  }

  if (limitEndYearMonth === void 0) {
    limitEndYearMonth = null;
  }

  _defineProperty(this, "updateDate", function (monthIndex, year) {
    _this.generateDaysOfMonth(monthIndex, year);

    _this.generateYearAndMonth(monthIndex, year);
  });

  _defineProperty(this, "firstDayInMonthIndex", function (monthIndex, year) {
    if (monthIndex === void 0) {
      monthIndex = new Date().getMonth();
    }

    if (year === void 0) {
      year = new Date().getFullYear();
    }

    var month = monthIndex + 1;
    return new Date(year + "-" + month + "-01").getDay();
  });

  _defineProperty(this, "isLeapYear", function (year) {
    if (year === void 0) {
      year = new Date().getFullYear();
    }

    return year % 4 || year % 100 === 0 && year % 400 ? 0 : 1;
  });

  _defineProperty(this, "daysInMonth", function (monthIndex, year) {
    if (monthIndex === void 0) {
      monthIndex = new Date().getMonth();
    }

    if (year === void 0) {
      year = new Date().getFullYear();
    }

    var month = monthIndex + 1;
    return month === 2 ? 28 + _this.isLeapYear(year) : 31 - (month - 1) % 7 % 2;
  });

  _defineProperty(this, "generateWeekdays", function () {
    var daysOfWeek = document.querySelector(".calendar-daysofweek");
    daysOfWeek.innerHTML = "";
    var row = document.createElement("tr");

    for (var i = 0; i < Object.keys(_this.daysOfWeekLabels).length; i++) {
      var day = document.createElement("th");
      var posInArray = void 0; //start of week is sunday

      if (_this.startOfWeek === _this.daysOfWeekLabels[0]) {
        posInArray = i;
      } //start of week is monday
      else if (_this.startOfWeek === _this.daysOfWeekLabels[1]) {
          posInArray = i + 1;

          if (i === 6) {
            posInArray = 0;
          }
        }

      var dayText = document.createTextNode(_this.daysOfWeekLabels[posInArray]);
      day.appendChild(dayText);
      daysOfWeek.appendChild(row);
      row.appendChild(day);
    }
  });

  _defineProperty(this, "generateDaysOfMonth", function (monthIndex, year) {
    if (monthIndex === void 0) {
      monthIndex = new Date().getMonth();
    }

    if (year === void 0) {
      year = new Date().getFullYear();
    }

    //rows = 5 (weeks) in month
    _this.htmlDaysOfMonth.innerHTML = "";

    var firstDay = _this.firstDayInMonthIndex(monthIndex, year);

    var daysInMonthCount = _this.daysInMonth(monthIndex, year);

    console.log('daysInMonthCount:', daysInMonthCount);
    var startCounting = false;
    var dayCount = 1;
    var rows = 5; //needs to be 5 to cater for 1st starting on last day of generated week (Sat) which would push another row

    for (var i = 0; i <= rows; i++) {
      var row = document.createElement("tr"); //populate month from 1st on that day of week

      for (var j = 1; j <= 7; j++) {
        if (startCounting === false) {
          //has not started counting yet, firstDay is zeroIndexed starting with 0
          if (_this.startOfWeek === 'mon') {
            //start counting at j or when j = 7 is a sun
            if (firstDay === j || firstDay === 0 && j === 7) {
              console.log('start day of month: ', j);
              startCounting = true;
            }
          } else if (_this.startOfWeek === 'sun') {
            if (firstDay === j - 1) {
              console.log('start day of month: ', j - 1);
              startCounting = true;
            }
          }
        } //get first day of week place in j     


        var td = document.createElement("td");
        var day = document.createElement("div");
        var dayText = document.createTextNode("");

        if (startCounting && dayCount <= daysInMonthCount) {
          td.appendChild(day);
          dayText = document.createTextNode(dayCount);
          dayCount++;
          day.appendChild(dayText);
          day.classList.add('day');
        }

        row.appendChild(td); //selected day is highlighted

        if (_this.pickedDate && _this.currentYear === _this.pickedDate.getFullYear() && _this.currentMonth === _this.pickedDate.getMonth()) {
          if (parseInt(dayText.nodeValue) === parseInt(_this.pickedDate.getDate())) {
            _this.htmlPickedDay = day;

            _this.htmlPickedDay.classList.add('active');
          }
        }
      }

      _this.htmlDaysOfMonth.appendChild(row);
    }
  });

  _defineProperty(this, "generateYearAndMonth", function (monthIndex, year) {
    if (monthIndex === void 0) {
      monthIndex = new Date().getMonth();
    }

    if (year === void 0) {
      year = new Date().getFullYear();
    }

    var htmlYearAndMonth = document.querySelector(".yearandmonth");
    htmlYearAndMonth.querySelector('.year').innerHTML = "";
    htmlYearAndMonth.querySelector('.month').innerHTML = "";
    htmlYearAndMonth.querySelector('.year').appendChild(document.createTextNode(year));
    htmlYearAndMonth.querySelector('.month').appendChild(document.createTextNode(_this.monthsOfYear[monthIndex]));
  });

  _defineProperty(this, "onChooseDate", function () {
    console.log("onChooseDate");

    _this.calendar.classList.toggle("active");
  });

  _defineProperty(this, "onChooseYear", function () {
    console.log("hello world");
  });

  _defineProperty(this, "dayClickHandler", function (event) {
    if (event.target.className === 'day') {
      console.log('target:', event.target.className);

      if (_this.htmlPickedDay !== null) {
        _this.htmlPickedDay.classList.remove('active');
      }

      _this.htmlPickedDay = event.target; //add styling by adding an active class

      _this.htmlPickedDay.classList.add('active'); //the day


      var day = Math.abs(_this.htmlPickedDay.innerHTML);
      console.log('day:', day); //create new date and assign to pickedDate
      //cater for zero index

      _this.pickedDate = new Date(_this.currentYear + "-" + (_this.currentMonth + 1) + "-" + day);
      console.log('pickedDate:', _this.pickedDate); //month is not indexed
      //put text in input

      var formattedDate = _this.pickedDate.getFullYear() + '-' + String(_this.pickedDate.getMonth() + 1).padStart(2, '0') + "-" + String(_this.pickedDate.getDate()).padStart(2, '0');
      console.log('formattedDate: ', formattedDate);
      _this.datepicker.querySelector('input').value = formattedDate;
    }
  });

  _defineProperty(this, "leftClickHandler", function () {
    // console.log('dispatch: leftclick');
    dispatchEvent(new Event('leftclick'));
  });

  _defineProperty(this, "rightClickHandler", function () {
    // console.log('dispatch: rightclick');    
    dispatchEvent(new Event('rightclick'));
  });

  _defineProperty(this, "changeDateHandler", function (event) {
    var updateDate = false;

    switch (event.type) {
      case 'leftclick':
        //left 
        if (_this.currentYear > _this.limitStartYear || _this.limitStartYear === null) {
          _this.currentMonth--;
          updateDate = true;

          if (_this.currentMonth < 0) {
            _this.currentMonth = 11;
            _this.currentYear--;
          }
        } else if (_this.currentYear === _this.limitStartYear) {
          //-1 caters for index in array
          if (_this.currentMonth > 0 && _this.limitStartYearMonth === null || _this.currentMonth > _this.limitStartYearMonth - 1) {
            updateDate = true;
            _this.currentMonth--;
          }
        } else {
          console.log('date is out of bounds');
        }

        break;

      case 'rightclick':
        //right
        if (_this.currentYear < _this.limitEndYear || _this.limitEndYear === null) {
          _this.currentMonth++;
          updateDate = true;

          if (_this.currentMonth > 11) {
            _this.currentMonth = 0;
            _this.currentYear++;
          }
        } else if (_this.currentYear === _this.limitEndYear) {
          //-1 caters for index in array
          if (_this.currentMonth < 11 && _this.limitEndYearMonth === null || _this.currentMonth < _this.limitEndYearMonth - 1) {
            updateDate = true;
            _this.currentMonth++;
          }
        } else {
          console.log('date is out of bounds');
        }

        break;
    } //update


    if (updateDate) {
      console.log('changeDateHandler: ', event.type);

      _this.updateDate(_this.currentMonth, _this.currentYear);
    }
  });

  this.datepicker = document.querySelector('.date-picker');
  this.calendar = document.querySelector(".calendar");
  this.arrowLeft = document.querySelector('.arrow.left');
  this.arrowRight = document.querySelector('.arrow.right');
  this.htmlDaysOfMonth = document.querySelector(".calendar-daysofmonth"); //keep track of where we are on calendar

  this.limitStartYear = limitStartYear;
  this.limitStartYearMonth = limitStartYearMonth;
  this.limitEndYear = limitEndYear;
  this.limitEndYearMonth = limitEndYearMonth;
  this.startYear = startYear === null ? new Date().getFullYear() : startYear;
  this.startMonth = startMonth === null ? new Date().getMonth() : startMonth - 1; //cater for zero index

  this.currentMonth = this.startMonth; //zero-index value

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
    6: "sat"
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
  };
  this.datePickerState = {
    0: 'yearandmonth',
    1: 'year',
    2: 'month'
  };
  this.startOfWeek = startOfWeek; //mon || sun

  this.generateWeekdays();
  this.updateDate(this.currentMonth, this.currentYear);
}; // DatePicker(
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


var d = new DatePicker(1971, 9, "sun", 1970, 1, 1971, 12);