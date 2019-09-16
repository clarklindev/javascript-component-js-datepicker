# Date picker

## features
* multiple instances associated with a class of your choice
* choose start of week (Sunday or Monday)

## usage
* instance - required a html dom element with class to associate to datepicker 
* startyear - yyyy, default is current year
* startMonth - 1-12 (not zero indexed), default is current month
* startOfWeek - "sun" or "mon", which day calendar should start on
* limitStartYear - yyyy (limit which year you can go back to)
* limitStartYearMonth - 1-12 (not zero indexed)
* limitEndYear = yyyy (limit which year you can go farward to)
* limitEndYearMonth = 1-12 (not zero indexed) 

### example
```js
 new Datepicker(
  instance, 
  startYear = null,
  startMonth = null,
  startOfWeek = "sun",
  limitStartYear = null,
  limitStartYearMonth = null,
  limitEndYear = null,
  limitEndYearMonth = null
) 

//support for multiple instances
//currently all defaults start with same value can create array and assign possitions then use the index of map to assign different values
//overlapping elements
Array.from(document.getElementsByClassName("datepicker")).map(
	(instance, index) => {
		return new Datepicker(instance, null, null, "sun", null, null, null, null);
	}
);
```
## browser support
* tested on firefox
* works on Edge (if compiled with babbel to ES5)

## future updates
* localization for multiple languages (days of week, months of year)
* limiting navigating month/years as set in constructor

## Analysis of the problem
* find the reason or context of where the date picker is supposed to be used, 
* if there is no test-case then pick your own 
* ideally date picker is different for say credit card expiry as for picking someones birthday to set calandar reminder, because for credit card expiry you arent interested in day of week (monday-sunday) but maybe this information would be needed when you want to find out someones birthday, coding a date picker with day of week would require you to know which day the 1st falls in that month

* Scott Flansburg youtube video relearning math - possible to find out any day of week based on algorithm

## Algorithms
* the reason I want to use an algorithm...
* less mistakes (note: this is the formula needed to create a calendar, and its interesting to see how these calculations unfold, however there are quicker methods to deduce certain results required in the Calendar calculations using the html/js Date() class)
* proven formula for edge cases
* i think its also so that we can separate actions and visuals from the logic and reuse logic for different ways to present the consistently same results.

## ALGORITHM - which day of the week is the 1st of the month
* algorithm for figuring out which day of the week the 1st is for current month and display current month as base case to work off that we want to pick a date closer to where we are now (as it is more relavant) than say 1500?

### why we want this? 
* for presentation of the data so that we know where to plot the 1st day of the month, everything else can be plotted in relation to this starting point of current day/current month/where the 1st of month is, and in the same block, any overflow of days from previous month and next month that is supposed to show

https://www.tondering.dk/claus/cal/chrweek.php#calcdow

```js
const firstDayInMonthIndex = (
  monthIndex = new Date().getMonth(), 
  year = new Date().getFullYear()
) => (
  new Date(`${year}-${monthIndex + 1}-01`).getDay()
)

// 6 - Saturday, 0-Sunday
//day = (day===0) ? 7 : day
```

## ALGORITHM - finding days in a month
* reference days in a month: http://www.dispersiondesign.com/articles/time/number_of_days_in_a_month
* my understanding of this algorithm, the %7 give us a pattern for 31 or 30 days because counting 1 to 7 is jan-july and the count needs to start over at 7 to make 8 start at same number as January, the %2 turns this to binary
* and then when its a leap year there is 29 days but 28 when it is not, and so this calculated and added to 28.
* note count index begins at 0 and this gives you an even or odd number
* also note: there is no year in this calculation, but there is a year variable in the isLeapYear calculation

* you can use the Date class to acquire Days in month..
* note: lastDay:  //the ,0 is getting the last day of previous month, and so we +1 to current month
```js
  let date = new Date();
  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  let lastDay = new Date(date.getFullYear(), date.getMonth()+1, 0);
```


```js
var daysInMonth = (month === 2) ? (28 + isLeapYear) : 31 - (month - 1) % 7 % 2;
```

## ALGORITHM - Leap year? how many days are in February
* problem of leap year: http://www.dispersiondesign.com/articles/time/determining_leap_years
* a year is a leap year if it is divisible by four, UNLESS it is also divisible by 100. A year is NOT a leap year if it is divisible by 100 UNLESS it is also divisible by 400.

```js
var isLeapYear = (year % 4) || ((year % 100 === 0) && (year % 400)) ? 0 : 1;
```

### VISUALS
* initial state - starting date should be current Date, styling of current day vs selected day
* your arrows are going to show previous or next month
* how is the date picker activated? is it a textbox that you click and then once selected the input shows the picked date
* or a button that you click and this brings up the date picker
* mobile/responsive?
* figure out how many lines (weeks) should show for each month block, this should a fixed consistent size accross all months
* styling days of month not related to current month differently

## Backward Compatibility
* this is a tough one, makes your hair go grey when you try do compatibility check for ie9
* whole bunch of es6 syntax is not supported
* feels like hacking, my solution will not support IE as it will require majority of the time to get it to work, for Edge have opted to use babbel to convert js to es2015 and it seems to work fine

