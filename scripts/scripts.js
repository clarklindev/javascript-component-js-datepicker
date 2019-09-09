let datepicker = document.querySelector('input[name="date-input"]');
let calendar = document.querySelector('.calendar');
datepicker.onclick = function(){
    console.log('onChooseDate');
    calendar.classList.toggle('active');
}

function onChooseYear(){
    console.log('hello world')
}