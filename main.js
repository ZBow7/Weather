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
    //Triggered when the user hits search
    let userSearch = document.getElementById("location-input").value;
    fetch("main.php?userSearch=" + userSearch)
    .then(response => response.json())
    .then(data => {
        createData(data);
    })
}

function createData(fullData) {
    //Assignment of api data
    forecastData = fullData;
    createDailyBlocks(1, "daily");
}

function createDailyBlocks(numForecastDays, type) {
    //Default forecast type
    updatePanel(type);
    let forecastOutput = fillDailyForecast(numForecastDays);
    updatePage(type, forecastOutput);
}

function updatePanel(type) {
    //This is the panel with which the user can select a forecast type - hourly, today, 3 day
    document.querySelector(".forecast-panel").style.display = "block";
    if (type == "daily") {
        document.getElementById("daily-panel-link").className = "panel-link-highlighted";
        document.getElementById("hourly-panel-link").className = "panel-link-normal";
        document.getElementById("three-day-panel-link").className = "panel-link-normal";
    }
    else if (type == "hourly") {
        document.getElementById("daily-panel-link").className = "panel-link-normal";
        document.getElementById("hourly-panel-link").className = "panel-link-highlighted";
        document.getElementById("three-day-panel-link").className = "panel-link-normal";
    }
    else {
        document.getElementById("daily-panel-link").className = "panel-link-normal";
        document.getElementById("hourly-panel-link").className = "panel-link-normal";
        document.getElementById("three-day-panel-link").className = "panel-link-highlighted";
    }
}

function fillDailyForecast(numForecastDays) {
    //Loops through our weather data and assembles the final output for the user
    let forecastOutput = "";
    let locationName = forecastData.location.name;
    let locationRegion = forecastData.location.region;
    if (numForecastDays == 1) {
        let date = forecastData.forecast.forecastday[0].date;
        let conditionIcon = forecastData.current.condition.icon;
        let conditionText = forecastData.current.condition.text;
        let currentTemp = Math.round(forecastData.current.temp_f);
        let dailyHighTemp = Math.round(forecastData.forecast.forecastday[0].day.maxtemp_f);
        let dailyLowTemp = Math.round(forecastData.forecast.forecastday[0].day.mintemp_f);
        let currentFeelsLike = Math.round(forecastData.current.feelslike_f);
        let precipChance = Math.max(forecastData.forecast.forecastday[0].day.daily_chance_of_rain, forecastData.forecast.forecastday[0].day.daily_chance_of_snow);
        forecastOutput = "<div class=m-daily><div class=location-daily>" + locationName + ", " + locationRegion + "</div><div class=date-daily>" + date + "</div><div class=condition-wrap-daily><div class=flex-wrap-daily><img class=condition-icon-daily src=" + conditionIcon + " /><div class=condition-description-daily>" + conditionText + "</div></div></div><div class=temp-wrap-daily><div class=current-temp-daily>Current temp : " + currentTemp + "&#176</div><div class=flex-wrap-daily><div class=temp-column-daily><div class=temp-title-daily>High</div><div class=temp-value-daily>" + dailyHighTemp + "&#176</div></div><div class=temp-column-daily><div class=temp-title-daily>Low</div><div class=temp-value-daily>" + dailyLowTemp + "&#176</div></div><div class=temp-column-daily><div class=temp-title-daily>Feels like</div><div class=temp-value-daily>" + currentFeelsLike + "&#176</div></div></div></div><div class=precip-chance-daily>Precipitation chance : " + precipChance + "%</div></div>";
    }
    else {
        for (let i = 0; i < 3; i++) {
            let date = forecastData.forecast.forecastday[i].date;
            let conditionIcon = forecastData.forecast.forecastday[i].day.condition.icon;
            let conditionText = forecastData.forecast.forecastday[i].day.condition.text;
            let dailyHighTemp = Math.round(forecastData.forecast.forecastday[i].day.maxtemp_f);
            let dailyLowTemp = Math.round(forecastData.forecast.forecastday[i].day.mintemp_f);
            let precipChance = Math.max(forecastData.forecast.forecastday[i].day.daily_chance_of_rain, forecastData.forecast.forecastday[i].day.daily_chance_of_snow);
            forecastOutput += "<div class=m-daily><div class=location-daily>" + locationName + ", " + locationRegion + "</div><div class=date-daily>" + date + "</div><div class=condition-wrap-daily><div class=flex-wrap-daily><img class=condition-icon-daily src=" + conditionIcon + " /><div class=condition-description-daily>" + conditionText + "</div></div></div><div class=temp-wrap-daily><div class=flex-wrap-daily><div class=temp-column-daily><div class=temp-title-daily>High</div><div class=temp-value-daily>" + dailyHighTemp + "&#176</div></div><div class=temp-column-daily><div class=temp-title-daily>Low</div><div class=temp-value-daily>" + dailyLowTemp + "&#176</div></div></div></div><div class=precip-chance-daily>Precipitation chance : " + precipChance + "%</div></div>";
        }
    }
    return forecastOutput;
}

function createHourBlocks(type) {
    //Creates the hourly forecast type
    updatePanel("hourly");
    hideEarlierButton(type);
    let today = new Date();
    let currentHour = today.getHours();
    let day = setDay(type);
    type = validateType(type, day);
    let targetHourMin = setTargetHourMin(type, currentHour);
    let targetHourMax = setTargetHourMax(type, currentHour);
    let forecastOutput = initializeForecastOutput(type);
    forecastOutput += fillHourlyForecast(targetHourMin, targetHourMax, type, day);
    updatePage(type, forecastOutput);
    addButtonListeners(type, day);
    adjustPageScroll();
}

function hideEarlierButton(type) {
    if (type == "earlier") {
        document.getElementById("earlier").style.display = "none";
    }
}

function setDay(type) {
    //Assign day based on selected forecast type
    if (type == "today" || type == "earlier") {
        return 0;
    }
    else if (type == "next") {
        let day = parseInt(document.querySelector("#hourly-next").dataset.day);
        return day;
    }
    else {
        let day = parseInt(document.querySelector("#hourly-previous").dataset.day);
        return day;
    }
}

function validateType(type, day) {
    if (type == "previous" && day == 0) {
        return "today";
    }
    else {
        return type;
    }
}

function setTargetHourMin (type, currentHour) {
    //Sets started hour for forecast output
    if (type == "today") {
        return currentHour;
    }
    else {
        return 0;
    }
}

function setTargetHourMax (type, currentHour) {
    //Sets end hour for forecast output
    if (type == "earlier") {
        return currentHour - 1;
    }
    else {
        return 23;
    }
}

function initializeForecastOutput(type) {
    //Adds the earlier button if the forecast type is today and the already passed hours are not currently displayed
    if (type == "today") {
        return "<div id=earlier><span class=arrow>&#8593</span><br />Earlier</div>";
    }
    else {
        return "";
    }
}

function fillHourlyForecast(targetHourMin, targetHourMax, type, day) {
    //Loops through our weather data and assembles the final output for the user
    let outputBody = "";
    for (let i = targetHourMin; i <= targetHourMax; i++) {
        let conditionIcon = forecastData.forecast.forecastday[day].hour[i].condition.icon;
        let conditionText = forecastData.forecast.forecastday[day].hour[i].condition.text;
        let temp = Math.round(forecastData.forecast.forecastday[day].hour[i].temp_f);
        let feelsLike = Math.round(forecastData.forecast.forecastday[day].hour[i].feelslike_f);
        let precipChance = Math.max(forecastData.forecast.forecastday[day].hour[i].chance_of_rain, forecastData.forecast.forecastday[day].hour[i].chance_of_snow);
        outputBody += "<div class=m-hour><div class=m-hour-top-half><div class=flex-wrap><p>" + hours[i] + "</p><img class=m-icon src=" + conditionIcon + " /></div></div><div class=m-hour-top-half><div class=flex-wrap><p>" + conditionText + "</p></div></div><div class=m-hour-bottom><ul class=m-stats><li>" + temp + "&#176;</li><li>Feels like " + feelsLike + "&#176;</li><li>" + precipChance + "% prec</li></ul></div></div><div class=block-divider></div>";
    }
    outputBody += createButtons(type, day);
    return outputBody;
}

function createButtons(type, day) {
    //Adds appropriate buttons to final forecast output
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

function addButtonListeners(type, day) {
    if (type == "earlier") {
        return;
    }
    if (day == 0) {
        document.getElementById("earlier").addEventListener("click", function (){
            createHourBlocks("earlier");
        }, {once: true});
    }
    if (day < 2) {
        document.getElementById("hourly-next").addEventListener("click", function (){
            createHourBlocks("next");
        }, {once: true});
    }
    if (day > 0) {
        document.getElementById("hourly-previous").addEventListener("click", function (){
            createHourBlocks("previous");
        }, {once: true});
    }
}

function adjustPageScroll() {
    //Scrolls to the top when the user selects next day so they are then starting at the top of the forecast
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}