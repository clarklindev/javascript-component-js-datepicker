let datepicker = document.querySelector('input[name="date-input"]');
let calendar = document.querySelector('.calendar');
let daysOfWeekLabels = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
generateWeekdays();
generateDaysOfMonth();

//creates the header for days of week
function generateWeekdays(){
    let daysOfWeek = document.querySelector('.calendar-daysofweek');
    for(let i=0; i< daysOfWeekLabels.length; i++){
        let day = document.createElement('td');
        let dayText = document.createTextNode(daysOfWeekLabels[i]);
        day.appendChild(dayText);
        daysOfWeek.appendChild(day);
    }
}

//creates the days of the month
function generateDaysOfMonth(){

}

datepicker.onclick = function(){
    console.log('onChooseDate');
    calendar.classList.toggle('active');
}

function onChooseYear(){
    console.log('hello world')
}