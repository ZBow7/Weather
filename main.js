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
    createHourBlocks("initial");
}

function createHourBlocks(type) {
    let today = new Date();
    let currentHour = today.getHours();
    let targetHourMin = setTargetHourMin(type, currentHour);
    let targetHourMax = setTargetHourMax(type, currentHour);
    let forecastOutput = initializeForecastOutput(type, currentHour);
    forecastOutput += fillForecastOutput(targetHourMin, targetHourMax, type);
    updatePage(type, forecastOutput);
    addListeners(type);
}

function setTargetHourMin (type, currentHour) {
    if (type == "earlier") {
        return 0;
    }
    else {
        return currentHour;
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

function initializeForecastOutput(type, currentHour) {
    if (type == "initial" || type == "tomorrow") {
        if (currentHour > 0) {
            return "<div id=earlier><span class=arrow>&#8593</span><br />Earlier</div>";
        }
    }
    else if (type == "earlier") {
        return "";
    }
}

function fillForecastOutput(targetHourMin, targetHourMax, type) {
    let outputBody = "";
    for (let i = targetHourMin; i <= targetHourMax; i++) {
        let conditionIcon = forecastData.forecastday[0].hour[i].condition.icon;
        let conditionText = forecastData.forecastday[0].hour[i].condition.text;
        let temp = Math.round(forecastData.forecastday[0].hour[i].temp_f);
        let feelsLike = Math.round(forecastData.forecastday[0].hour[i].feelslike_f);
        let precipChance = Math.max(forecastData.forecastday[0].hour[i].chance_of_rain, forecastData.forecastday[0].hour[i].chance_of_snow);
        outputBody += "<div class=m-hour><div class=m-hour-top-half><div class=flex-wrap><p>" + hours[i] + "</p><img class=m-icon src=" + conditionIcon + " /></div></div><div class=m-hour-top-half><div class=flex-wrap><p>" + conditionText + "</p></div></div><div class=m-hour-bottom><ul class=m-stats><li>" + temp + "&#176;</li><li>Feels like " + feelsLike + "&#176;</li><li>" + precipChance + "% prec</li></ul></div></div><div class=block-divider></div>";
    }
    if (type == "initial") {
        outputBody += "<div id=hourly-tom>Tomorrow <span class=arrow>&#8594</span></div>";
    }
    return outputBody;
}

function updatePage(type, forecastOutput) {
    if (type == "initial" || type == "tomorrow") {
        document.getElementById("forecast-wrap").innerHTML = forecastOutput;
    }
    else {
        document.getElementById("forecast-wrap").insertAdjacentHTML("afterbegin", forecastOutput);
    }
}

function addListeners(type) {
    if (type == "initial" || type == "tomorrow") {
        document.getElementById("earlier").addEventListener("click", function() {
            createHourBlocks("earlier");
            document.getElementById("earlier").style.display = "none";
        });
    }
    if (type == "initial" || type == "earlier") {
        document.getElementById("hourly-tom").addEventListener("click", function (){
            showTomorrow();
        }, {once: true});
    }
}

function showTomorrow() {

}