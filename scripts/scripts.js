let datepicker = document.querySelector('input[name="date-input"]');
let calendar = document.querySelector('.calendar');
let daysOfWeekLabels = {0:'mon', 1:'tue', 2:'wed', 3:'thu', 4:'fri', 5:'sat', 6:'sun'};
generateWeekdays();
generateDaysOfMonth();

//creates the header for days of week
function generateWeekdays(){
    let daysOfWeek = document.querySelector('.calendar-daysofweek');
    for(let i=0; i< Object.keys(daysOfWeekLabels).length; i++){
        let day = document.createElement('td');
        let dayText = document.createTextNode(daysOfWeekLabels[i]);
        day.appendChild(dayText);
        daysOfWeek.appendChild(day);
    }
}

//creates the days of the month
function generateDaysOfMonth(){
    //rows = 5 (weeks) in month
    let daysOfMonth = document.querySelector('.calendar-daysofmonth');
    for(let i=0; i<= 4; i++){
        let row = document.createElement('tr');

        //populate month from 1st on that day of week
        for(let j=1; j<=7;j++){
            let day = document.createElement('td');
            let dayText = document.createTextNode(j + i*7);
            day.appendChild(dayText);
            row.appendChild(day);
        }
        daysOfMonth.appendChild(row);
    }

}

datepicker.onclick = function(){
    console.log('onChooseDate');
    calendar.classList.toggle('active');
}

function onChooseYear(){
    console.log('hello world')
}