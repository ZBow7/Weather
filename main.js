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
    clearInterval(worldWeatherInterval);
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
    setBackgroundImage();
}

function createDailyBlocks(numForecastDays, type) {
    //Default forecast type
    updatePanel(type);
    let forecastOutput = fillDailyForecast(numForecastDays, type);
    updatePage(type, forecastOutput);
    if (window.innerWidth > 1000) {
        for (let i = 0; i < numForecastDays; i++) {
            showMore("daily", i);
        }
    }
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

function fillDailyForecast(numForecastDays, type) {
    //Loops through our weather data and assembles the final output for the user
    let locationDetails = setLocationDetails();
    let forecastOutput = "";
    if (type !== "world") {
        forecastOutput = "<div class=location-daily>" + locationDetails + "</div>";
    }
    if (numForecastDays == 1) {
        let date = forecastData.forecast.forecastday[0].date;
        let conditionIcon = forecastData.current.condition.icon;
        let conditionText = forecastData.current.condition.text;
        let currentTemp = Math.round(forecastData.current.temp_f);
        let dailyHighTemp = Math.round(forecastData.forecast.forecastday[0].day.maxtemp_f);
        let dailyLowTemp = Math.round(forecastData.forecast.forecastday[0].day.mintemp_f);
        let currentFeelsLike = Math.round(forecastData.current.feelslike_f);
        let precipChance = Math.max(forecastData.forecast.forecastday[0].day.daily_chance_of_rain, forecastData.forecast.forecastday[0].day.daily_chance_of_snow);
        forecastOutput += "<div id=m-daily-0 class=m-daily><div class=date-daily>" + date + "</div><div class=condition-wrap-daily><div class=flex-wrap-daily><img class=condition-icon-daily src=" + conditionIcon + " /><div class=condition-description-daily>" + conditionText + "</div></div></div><div class=temp-wrap-daily><div class=current-temp-daily>Current temp : <span class=details-value>" + currentTemp + "&#176</span></div><div class=flex-wrap-daily><div class=temp-column-daily><div class='temp-title-daily temp-title-high'>High</div><div class=temp-value-daily><span class=details-value>" + dailyHighTemp + "&#176</span></div></div><div class=temp-column-daily><div class='temp-title-daily temp-title-low'>Low</div><div class=temp-value-daily><span class=details-value>" + dailyLowTemp + "&#176</span></div></div><div class=temp-column-daily><div class=temp-title-daily>Feels like</div><div class=temp-value-daily><span class=details-value>" + currentFeelsLike + "&#176;</span></div></div></div></div><div class=precip-chance-daily>Precipitation chance : <span class=details-value>" + precipChance + "%</span></div><div id=more-details-daily-0 class=more-details><a class=details-link onclick=showMore('daily',0)>More</a></div></div>";
    }
    else {
        for (let i = 0; i < 3; i++) {
            let date = forecastData.forecast.forecastday[i].date;
            let conditionIcon = forecastData.forecast.forecastday[i].day.condition.icon;
            let conditionText = forecastData.forecast.forecastday[i].day.condition.text;
            let dailyHighTemp = Math.round(forecastData.forecast.forecastday[i].day.maxtemp_f);
            let dailyLowTemp = Math.round(forecastData.forecast.forecastday[i].day.mintemp_f);
            let precipChance = Math.max(forecastData.forecast.forecastday[i].day.daily_chance_of_rain, forecastData.forecast.forecastday[i].day.daily_chance_of_snow);
            forecastOutput += "<div id=m-daily-" + i + " class=m-daily><div class=date-daily>" + date + "</div><div class=condition-wrap-daily><div class=flex-wrap-daily><img class=condition-icon-daily src=" + conditionIcon + " /><div class=condition-description-daily>" + conditionText + "</div></div></div><div class=temp-wrap-daily><div class=flex-wrap-daily><div class=temp-column-daily><div class='temp-title-daily temp-title-high'>High</div><div class=temp-value-daily><span class=details-value>" + dailyHighTemp + "&#176</span></div></div><div class=temp-column-daily><div class='temp-title-daily temp-title-low'>Low</div><div class=temp-value-daily><span class=details-value>" + dailyLowTemp + "&#176</span></div></div></div></div><div class=precip-chance-daily>Precipitation chance : <span class=details-value>" + precipChance + "%</span></div><div id=more-details-daily-" + i + " class=more-details><a class=details-link onclick=showMore('daily'," + i + ")>More</a></div></div>";
            if (i !== 2) {
                forecastOutput += "<div class=block-divider></div>";
            }
        }
    }
    return forecastOutput;
}

function createHourBlocks(type) {
    //Creates the hourly forecast type
    updatePanel("hourly");
    hideEarlierButton(type);
    let today = new Date();
    let currentLocalHour = forecastData.location.localtime;
    currentLocalHour = currentLocalHour.split(" ");
    currentLocalHour = parseInt(currentLocalHour[1]);
    let day = setDay(type);
    type = validateType(type, day);
    let targetHourMin = setTargetHourMin(type, currentLocalHour);
    let targetHourMax = setTargetHourMax(type, currentLocalHour);
    let forecastOutput = initializeForecastOutput(type, day);
    forecastOutput += fillHourlyForecast(targetHourMin, targetHourMax, type, day);
    updatePage(type, forecastOutput);
    addButtonListeners(type, day);
    adjustPageScroll();
}

function hideEarlierButton(type) {
    if (type == "earlier") {
        document.getElementById("earlier").style.display = "none";
        document.querySelector(".location-daily").style.display = "none";
        document.querySelector(".date-daily").style.display = "none";
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

function setTargetHourMin (type, currentLocalHour) {
    //Sets started hour for forecast output
    if (type == "today") {
        return currentLocalHour;
    }
    else {
        return 0;
    }
}

function setTargetHourMax (type, currentLocalHour) {
    //Sets end hour for forecast output
    if (type == "earlier") {
        return currentLocalHour - 1;
    }
    else {
        return 23;
    }
}

function initializeForecastOutput(type, day) {
    //Adds the earlier button if the forecast type is today and the already passed hours are not currently displayed
    let locationDetails = setLocationDetails();
    let targetDate = forecastData.forecast.forecastday[day].date;
    if (type == "today") {
        return "<div class=location-daily>" + locationDetails + "</div><div class=date-daily>" + targetDate + "</div><div id=earlier><span class=arrow>&#8593</span><br />Earlier</div>";
    }
    else {
        return "<div class=location-daily>" + locationDetails + "</div><div class=date-daily>" + targetDate + "</div>";
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
        outputBody += "<div id=m-hourly-" + i + " class=m-hour><div class=m-hour-top-half><div class=flex-wrap><p>" + hours[i] + "</p><img class=m-icon src=" + conditionIcon + " /></div></div><div class=m-hour-top-half><div class=flex-wrap><p>" + conditionText + "</p></div></div><div class=m-hour-bottom><ul class=m-stats><li><span class=details-value>" + temp + "&#176;</span></li><li>Feels like <span class=details-value>" + feelsLike + "&#176;</span></li><li><span class=details-value>" + precipChance + "</span>% prec</li></ul></div><div id=more-details-hourly-" + i + " class=more-details><a class=details-link data-day=" + day + " onclick=showMore('hourly'," + i + ")>More</a></div></div>";
        if (i !== targetHourMax) {
            outputBody += "<div class=block-divider></div>";
        }
    }
    if (type !== "world") {
        outputBody += createButtons(type, day);
    }
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

function showMore(type, timeValue) {
    let moreDetails = createDetails(type, timeValue);
    let detailsOutput = createDetailsOutput(type, moreDetails, timeValue);
    document.getElementById("more-details-" + type + "-" + timeValue).style.display = "none";
    document.getElementById("m-" + type + "-" + timeValue).insertAdjacentHTML("beforeend", detailsOutput);
}

function showLess(type, timeValue) {
    document.querySelector(".details-wrap-" + timeValue).remove();
    document.querySelector(".less-details-" + timeValue).remove();
    document.getElementById("more-details-" + type + "-" + timeValue).style.display = "block";
}

function createDetails(type, timeValue) {
    if (type == "daily") {
        let moreDetails = {
            humidity:forecastData.forecast.forecastday[timeValue].day.avghumidity,
            uvIndex:forecastData.forecast.forecastday[timeValue].day.uv,
            maxWind:Math.round(forecastData.forecast.forecastday[timeValue].day.maxwind_mph),
            precipAmount:forecastData.forecast.forecastday[timeValue].day.totalprecip_in,
            sunrise:forecastData.forecast.forecastday[timeValue].astro.sunrise,
            sunset:forecastData.forecast.forecastday[timeValue].astro.sunset
        }
        return moreDetails;
    }
    else {
        let targetDay = document.getElementById("more-details-hourly-" + timeValue).children[0].getAttribute("data-day");
        let moreDetails = {
            humidity:forecastData.forecast.forecastday[targetDay].hour[timeValue].humidity,
            uvIndex:forecastData.forecast.forecastday[targetDay].hour[timeValue].uv,
            maxWind:Math.round(forecastData.forecast.forecastday[targetDay].hour[timeValue].gust_mph),
            precipAmount:forecastData.forecast.forecastday[targetDay].hour[timeValue].precip_in
        }
        return moreDetails;
    }
}

function createDetailsOutput(type, moreDetails, timeValue) {
    if (type == "daily") {
        let detailsOutput = "<div class='details-wrap-" + timeValue + " details-wrap'><div class=detail>Humidity: <span class=details-value>" + moreDetails.humidity + "%</span></div><div class=detail>UV index: <span class=details-value>" + moreDetails.uvIndex + "</span></div><div class=detail>Wind gusts: <span class=details-value>" + moreDetails.maxWind + " mph</span></div><div class=detail>Precipitation: <span class=details-value>" + moreDetails.precipAmount + " in</span></div><div class=detail>Sunrise: <span class=details-value>" + moreDetails.sunrise + "</span></div><div class=detail>Sunset: <span class=details-value>" + moreDetails.sunset + "</span></div></div><div class=less-details-" + timeValue + "><a class=details-link onclick=showLess('" + type + "'," + timeValue + ")>Less</a></div>";
        return detailsOutput;
    }
    else {
        let detailsOutput = "<div class='details-wrap-" + timeValue + " details-wrap'><div class=detail>Humidity: <span class=details-value>" + moreDetails.humidity + "%</span></div><div class=detail>UV index: <span class=details-value>" + moreDetails.uvIndex + "</span></div><div class=detail>Wind gusts: <span class=details-value>" + moreDetails.maxWind + " mph</span></div><div class=detail>Precipitation: <span class=details-value>" + moreDetails.precipAmount + " in</span></div></div><div class=less-details-" + timeValue + "><a class=details-link onclick=showLess('" + type + "'," + timeValue + ")>Less</a></div>";
        return detailsOutput;
    }
}   

function adjustPageScroll() {
    //Scrolls to the top when the user selects next day so they are then starting at the top of the forecast
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function getNews() {
    fetch("news.php")
.then(response => response.json())
.then(data => {
    createNews(data);
    })
}

function createNews(data) {
    let newsOutput = "<div id=news-header>Top Weather News</div><div class=news-divider></div>";
    let duplicateCount = 0;
    for (let i = 0; i < 7; i++) {
        //Was getting duplicate entries right next to each other.  Easy way to solve this for now. 
        if (i > 0 && data.articles[i+duplicateCount].title == data.articles[i+duplicateCount-1].title) {
            duplicateCount++;
        }
        let title = data.articles[i+duplicateCount].title;
        let media = data.articles[i+duplicateCount].media;
        let link = data.articles[i+duplicateCount].link;
        newsOutput += "<a class=link-basic href=" + link + "><div class=news-block><div class=news-title>" + title + "</div><div class=news-media><img class=news-image src=" + media + " /></div></div></a><div class=news-divider></div>"
    }
    document.getElementById("news-wrap").innerHTML = newsOutput;
}

getNews();

function setBackgroundImage() {
    let isDark = setIsDark();
    let currentImage = selectBackgroundImage(isDark);
    document.getElementById('location-search').style.backgroundImage = "url(" + currentImage.url + ")";
    document.getElementById('location-search').style.backgroundPosition = currentImage.imagePos;
}

function setIsDark() {
    let today = new Date();
    let currentHour = today.getHours();
    let sunriseHour = parseInt(forecastData.forecast.forecastday[0].astro.sunrise);
    let sunsetHour = parseInt(forecastData.forecast.forecastday[0].astro.sunset);
    if (currentHour > sunriseHour) {
        currentHour -= 12;
        if (currentHour > sunsetHour) {
            return 1;
        }
    }
    else {
        return 1;
    }
    return 0;
}

function selectBackgroundImage(isDark) {
    let backgroundImages = {
        sunny: {
            url: 'https://images.pexels.com/photos/1775862/pexels-photo-1775862.jpeg?auto=compress&cs=tinysrgb',
            imagePos: 'center'
        },
        clearDay: {
            url: 'https://images.pexels.com/photos/1775862/pexels-photo-1775862.jpeg?auto=compress&cs=tinysrgb',
            imagePos: 'center'
        },
        partlyDay: {
            url: 'https://images.pexels.com/photos/53594/blue-clouds-day-fluffy-53594.jpeg?auto=compress&cs=tinysrgb',
            imagePos: 'top'
        },
        overcast: {
            url: 'https://images.pexels.com/photos/414634/pexels-photo-414634.jpeg?auto=compress&cs=tinysrgb',
            imagePos: 'center'
        },
        cloudy: {
            url: 'https://images.pexels.com/photos/414634/pexels-photo-414634.jpeg?auto=compress&cs=tinysrgb',
            imagePos: 'center'
        },
        rain: {
            url: 'https://images.pexels.com/photos/1529360/pexels-photo-1529360.jpeg?auto=compress&cs=tinysrgb',
            imagePos: 'center'
        },
        snow: {
            url: 'https://images.pexels.com/photos/3623207/pexels-photo-3623207.jpeg?auto=compress&cs=tinysrgb',
            imagePos: 'center'
        },
        mist: {
            url: 'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&dpr=2',
            imagePos: 'center'
        },
        clearNight: {
            url: 'https://images.pexels.com/photos/433155/pexels-photo-433155.jpeg?auto=compress&cs=tinysrgb',
            imagePos: 'top'
        },
        partlyNight: {
            url: 'https://images.pexels.com/photos/4737484/pexels-photo-4737484.jpeg?auto=compress&cs=tinysrgb',
            imagePos: 'center'
        }
    }
    let today = new Date();
    let currentHour = today.getHours();
    let currentCondition = forecastData.forecast.forecastday[0].hour[currentHour].condition.text;
    currentCondition = currentCondition.toLowerCase();
    if (isDark == 0) {
        let imageKeys = ['partlyDay', 'mist', 'sunny', 'clearDay', 'overcast', 'cloudy', 'rain', 'snow', 'mist'];
        let conditionKeys = ['partly', 'fog', 'sun', 'clear', 'overcast', 'cloud', 'rain', 'snow', 'mist'];
        for (let i = 0; i < conditionKeys.length; i++) {
            if (currentCondition.includes(conditionKeys[i])) {
                return backgroundImages[imageKeys[i]];
            }
        }
        return backgroundImages[imageKeys[0]];
    }
    else {     
        let imageKeys = ['partlyNight', 'fog', 'clearNight', 'overcast', 'cloudy', 'rain', 'snow', 'mist'];
        let conditionKeys = ['partly', 'mist', 'clear', 'overcast', 'cloud', 'rain', 'snow', 'mist'];
        for (let i = 0; i < conditionKeys.length; i++) {
            if (currentCondition.includes(conditionKeys[i])) {
                return backgroundImages[imageKeys[i]];
            }
        }
        return backgroundImages[imageKeys[0]];
    }
}

let locationCount = 0;

getWorldWeather();

const worldWeatherInterval = setInterval(getWorldWeather, 7500);

function getWorldWeather() {
    let searchLocations = ['New York', 'Los Angeles', 'London', 'Tokyo', 'Moscow', 'Cairo', 'Hong Kong'];
    if (locationCount > 6) {
        locationCount = 0;
    }
    fetch("main.php?userSearch=" + searchLocations[locationCount])
    .then(response => response.json())
    .then(data => {
        setWorldWeather(data);
    })
    locationCount++;
}

function setWorldWeather(data) {
    forecastData = data;
    let localTime = forecastData.location.localtime;
    let targetHourMin = localTime.split(" ");
    targetHourMin = parseInt(targetHourMin[1]);
    let targetHourMax = targetHourMin;
    let day = 0;
    let type = "world";
    let forecastOutput = "<div class=fade-wrap>";
    forecastOutput += initializeForecastOutput(type, day);
    forecastOutput += "<div class=world-weather-hour>Current hour</div>";
    forecastOutput += fillHourlyForecast(targetHourMin, targetHourMax, type, day);
    forecastOutput += "<div class=world-weather-day>Current day</div>";
    forecastOutput += fillDailyForecast(1, type);
    forecastOutput += "</div>";
    updatePage(type, forecastOutput);
    showMore("hourly", targetHourMin);
    showMore("daily", day);
}

function setLocationDetails() {
    let locationName = forecastData.location.name;
    let locationDetails;
    let locationCountry = forecastData.location.country;
    if (locationCountry == "USA" || locationCountry == "United States of America") {
        locationDetails = forecastData.location.region;
    }
    else {
        locationDetails = forecastData.location.country;
    }
    return locationName + ", " + locationDetails;
}