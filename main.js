let forecastData;
const hours = ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"];

function handleMobileNav() {
    let navMenu = document.getElementById("mobile-nav");
    if (navMenu.style.display === "block") {
        navMenu.style.display = "none";
    }
    else {
        navMenu.style.display = "block";
    }
}

function handleSearch() {
    let userSearch = document.getElementById("location-input").value;
    fetch("main.php?userSearch=" + userSearch)
    .then(response => response.json())
    .then(data => {
        createData(data.forecast);
    })
}

function createData(fullData) {
    forecastData = fullData;
    createHourBlocks("today");
}

function createHourBlocks(type) {
    let today = new Date();
    let currentHour = today.getHours();
    let day = setDay(type);
    type = validateType(type, day);
    let targetHourMin = setTargetHourMin(type, currentHour);
    let targetHourMax = setTargetHourMax(type, currentHour);
    let forecastOutput = initializeForecastOutput(type);
    forecastOutput += fillForecastOutput(targetHourMin, targetHourMax, type, day);
    updatePage(type, forecastOutput);
    addListeners(day);
    adjustPageScroll();
}

function setDay(type) {
    if (type == "today" || type == "earlier") {
        return 0;
    }
    else if (type == "next") {
        let day = parseInt(document.querySelector("#hourly-next").dataset.day);
        return day;
    }
    else {
        let day = document.querySelector("#hourly-previous").dataset.day;
        return day;
    }
}

function validateType(type, day) {
    if (type == "previous" && day == 0) {
        console.log("today");
        return "today";
    }
    else {
        return type;
    }
}

function setTargetHourMin (type, currentHour) {
    if (type == "today") {
        return currentHour;
    }
    else {
        return 0;
    }
}

function setTargetHourMax (type, currentHour) {
    if (type == "earlier") {
        return currentHour - 1;
    }
    else {
        return 23;
    }
}

function initializeForecastOutput(type) {
    if (type == "today") {
        return "<div id=earlier><span class=arrow>&#8593</span><br />Earlier</div>";
    }
    else {
        return "";
    }
}

function fillForecastOutput(targetHourMin, targetHourMax, type, day) {
    let outputBody = "";
    for (let i = targetHourMin; i <= targetHourMax; i++) {
        let conditionIcon = forecastData.forecastday[day].hour[i].condition.icon;
        let conditionText = forecastData.forecastday[day].hour[i].condition.text;
        let temp = Math.round(forecastData.forecastday[day].hour[i].temp_f);
        let feelsLike = Math.round(forecastData.forecastday[day].hour[i].feelslike_f);
        let precipChance = Math.max(forecastData.forecastday[day].hour[i].chance_of_rain, forecastData.forecastday[day].hour[i].chance_of_snow);
        outputBody += "<div class=m-hour><div class=m-hour-top-half><div class=flex-wrap><p>" + hours[i] + "</p><img class=m-icon src=" + conditionIcon + " /></div></div><div class=m-hour-top-half><div class=flex-wrap><p>" + conditionText + "</p></div></div><div class=m-hour-bottom><ul class=m-stats><li>" + temp + "&#176;</li><li>Feels like " + feelsLike + "&#176;</li><li>" + precipChance + "% prec</li></ul></div></div><div class=block-divider></div>";
    }
    outputBody += createButtons(type, day);
    return outputBody;
}

function createButtons(type, day) {
    if (type == "earlier") {
        return "";
    }
    if (day == 0) {
        let nextDay = day + 1;
        return "<div id=hourly-next class=arrow-button-full data-day=" + nextDay + " >tomorrow <span class=arrow>&#8594</span></div>";
    }
    else if (day == 2) {
        let prevDay = day - 1;
        return "<div id=hourly-previous class=arrow-button-full data-day=" + prevDay + " ><span class=arrow>&#8592</span> previous day</div>";
    }
    else {
        let nextDay = day + 1;
        let prevDay = day - 1;
        return "<div id=arrow-button-wrap><div id=hourly-previous class=arrow-button-previous-small data-day=" + prevDay + " ><span class=arrow>&#8592</span> Previous day</div><div id=hourly-next class=arrow-button-next-small data-day=" + nextDay + " >Next day <span class=arrow>&#8594</span></div></div>";
    }
}

function updatePage(type, forecastOutput) {
    if (type == "earlier") {
        document.getElementById("forecast-wrap").insertAdjacentHTML("afterbegin", forecastOutput);
    }
    else {
        document.getElementById("forecast-wrap").innerHTML = forecastOutput;
    }
}

function addListeners(day) {
    if (day == 0) {
        document.getElementById("earlier").addEventListener("click", function() {
            createHourBlocks("earlier");
            document.getElementById("earlier").style.display = "none";
        });
        document.getElementById("hourly-next").addEventListener("click", function (){
            createHourBlocks("next");
        });
    }
    else if (day == 2) {
        document.getElementById("hourly-previous").addEventListener("click", function (){
            createHourBlocks("previous");
        });
    }
    else {
        document.getElementById("hourly-next").addEventListener("click", function (){
            createHourBlocks("next");
        });
        document.getElementById("hourly-previous").addEventListener("click", function (){
            createHourBlocks("previous");
        });
    }
}

function adjustPageScroll() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
}