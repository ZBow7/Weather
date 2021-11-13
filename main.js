let forecastData;

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
    createHour();
}

function createHour() {
    const hours = ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"];
    let today = new Date();
    let currentHour = today.getHours();
    let forecastOutput = "";

    if (currentHour > 0) {
        forecastOutput += "<div id=earlier><span class=arrow>&#8593</span><br />Earlier</div>";
    }
    for (let i = currentHour; i <= 23; i++) {
        let conditionIcon = forecastData.forecastday[0].hour[i].condition.icon;
        let conditionText = forecastData.forecastday[0].hour[i].condition.text;
        let temp = Math.round(forecastData.forecastday[0].hour[i].temp_f);
        let feelsLike = Math.round(forecastData.forecastday[0].hour[i].feelslike_f);
        let precipChance = Math.max(forecastData.forecastday[0].hour[i].chance_of_rain, forecastData.forecastday[0].hour[i].chance_of_snow);
        forecastOutput += "<div class=m-hour><div class=m-hour-top-half><div class=flex-wrap><p>" + hours[i] + "</p><img class=m-icon src=" + conditionIcon + " /></div></div><div class=m-hour-top-half><div class=flex-wrap><p>" + conditionText + "</p></div></div><div class=m-hour-bottom><ul class=m-stats><li>" + temp + "&#176;</li><li>Feels like " + feelsLike + "&#176;</li><li>" + precipChance + "% prec</li></ul></div></div><div class=block-divider></div>";
    }
    forecastOutput += "<div id=hourly-tom>Tomorrow <span class=arrow>&#8594</span></div>";
    document.getElementById("forecast-wrap").innerHTML = forecastOutput;
    document.getElementById("earlier").addEventListener("click", function() {
        showEarlier(forecastData, hours, currentHour);
    });
    document.getElementById("hourly-tom").addEventListener("click", function (){
        showTomorrow();
    });
}

function showEarlier(forecastData, hours, currentHour) {
    let earlierHoursCast = "";
    for (let i = 0; i < currentHour; i++) {
        let conditionIcon = forecastData.forecastday[0].hour[i].condition.icon;
        let conditionText = forecastData.forecastday[0].hour[i].condition.text;
        let temp = Math.round(forecastData.forecastday[0].hour[i].temp_f);
        let feelsLike = Math.round(forecastData.forecastday[0].hour[i].feelslike_f);
        let precipChance = Math.max(forecastData.forecastday[0].hour[i].chance_of_rain, forecastData.forecastday[0].hour[i].chance_of_snow);
        earlierHoursCast += "<div class=m-hour><div class=m-hour-top-half><div class=flex-wrap><p>" + hours[i] + "</p><img class=m-icon src=" + conditionIcon + " /></div></div><div class=m-hour-top-half><div class=flex-wrap><p>" + conditionText + "</p></div></div><div class=m-hour-bottom><ul class=m-stats><li>" + temp + "&#176;</li><li>Feels like " + feelsLike + "&#176;</li><li>" + precipChance + "% prec</li></ul></div></div><div class=block-divider></div>";
    }
    document.getElementById("forecast-wrap").insertAdjacentHTML("afterbegin", earlierHoursCast);
    document.getElementById("earlier").style.display = "none";
    
}

function showTomorrow() {

}