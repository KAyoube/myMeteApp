const weatherIcons = {
  Rain: "wi wi-day-rain",
  Clouds: "wi wi-day-cloudy",
  Clear: "wi wi-day-sunny",
  Snow: "wi wi-day-snow",
  Mist: "wi wi-day-fog",
  Drizzle: "wi wi-day-sleet",
};
const ville = document.getElementById("ville");
const timeLocal = document.getElementById("timeLocal");
const timeByZone = document.getElementById("timeByZone");
const temperature = document.getElementById("temperature");
const descriptions = document.getElementById("descriptions");
const icon = document.querySelector("i.wi");
const blocpage = document.getElementById("blocpage");
const humidity = document.getElementById("humidity");
const coord = document.getElementById("coord");
const pression = document.getElementById("pression");

const myConvertH = (strD, withIp) => {
  let date = new Date(strD);
  const hour = date.getHours() <= 9 ? "0" + date.getHours() : date.getHours();
  const min =
    date.getMinutes() <= 9 ? "0" + date.getMinutes() : date.getMinutes();
  const sec =
    date.getSeconds() <= 9 ? "0" + date.getSeconds() : date.getSeconds();

  const horaire = hour + "h" + min + "m" + sec + "s";

  withIp ? (timeByZone.textContent = horaire) : (timeLocal.textContent = horaire);
};

const getTimeByZone = (lat, long) => {
  setInterval(() => {
    fetch(
      `http://api.timezonedb.com/v2.1/get-time-zone?key=NETFNVYNIQGM&format=json&by=position&lat=${lat}&lng=${long}`
    )
      .then((result) => result.json())
      .then((json) => myConvertH(json.formatted));
  }, 1000);
};

const weatherInfo = (data) => {
  ville.textContent = data.name;
  temperature.textContent = Math.round(data.main.temp);
  descriptions.textContent = data.weather[0].description;
  icon.className = weatherIcons[data.weather[0].main];
  blocpage.className = data.weather[0].main.toLowerCase();
  humidity.textContent = `l'humidité acutelle est de ${data.main.humidity}%`;
  coord.textContent = `Vos coordonnées: latitude:${data.coord.latitude}, longitude:${data.coord.longitude}`;
  pression.textContent = `le vent est a une vitesse de ${data.wind.speed}m/s et il y a une pression actuelle de ${data.main.pressure}hPa`;
};

const weatherData = (ville, withIp) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=fd0473cb1f0e58f3f02b2e341c459e78&lang=fr&units=metric`
  )
    .then((result) => result.json())
    .then((json) => {
      weatherInfo(json);
      !withIp && getTimeByZone(json.coord.lat, json.coord.lon);
    });
};

const affichageHeure = (ip) => {
  setInterval(() => {
    fetch(`http://worldtimeapi.org/api/ip/${ip}`)
      .then((result) => result.json())
      .then((json) => myConvertH(json.datetime, withIp = true));
  }, 1000);
};

const getCityByIp = (ip) => {
  fetch(
    `https://geo.ipify.org/api/v2/country,city?apiKey=at_xoG8JFk0Tfpf1hlgzIvXLGep5S4Tn&ipAddress=${ip}`
  )
    .then((result) => result.json())
    .then((json) => weatherData(json.location.city, (withIp = true)));
};

const main = (withIp = true) => {
  if (withIp) {
    fetch(`https://api.ipify.org?format=json`)
      .then((result) => result.json())
      .then((json) => {
        getCityByIp(json.ip);
        affichageHeure(json.ip);
      });
  } else {
    weatherData(document.getElementById("ville").textContent);
  }
};

ville.addEventListener("click", () => {
  ville.contentEditable = true;
});

ville.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    ville.contentEditable = false;
    main((withIp = false));
  }
});

main();
