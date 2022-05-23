const weatherIcons = {
    "Rain":"wi wi-day-rain",
    "Clouds":"wi wi-day-cloudy",
    "Clear" : "wi wi-day-sunny",
    "Snow" : "wi wi-day-snow",
    "Mist" : "wi wi-day-fog",
    "Drizzle" :"wi wi-day-sleet"
}

const myConvertH= (strD) => {
  return new Date(strD).getHours()+"h" + new Date(strD).getMinutes() +"m" + new Date(strD).getSeconds()+"s";
}
const myConvertM= (strD) => {
  return new Date(strD).getHours()+"h" + new Date(strD).getMinutes() +"m";
}

const main = async(withIp = true) => {
    let ville;

    if(withIp){
        const ip =  await fetch(`https://api.ipify.org?format=json`)
        .then((result) => result.json())
        .then((json) =>  json.ip);

     ville = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_xoG8JFk0Tfpf1hlgzIvXLGep5S4Tn&ipAddress=${ip}`)
        .then((result) => result.json())
        .then((json) => json.location.city);

    }else{
        ville = document.getElementById('ville').textContent;
    }
         
    const meteo = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=fd0473cb1f0e58f3f02b2e341c459e78&lang=fr&units=metric`)
        .then((result) => result.json())
        .then((json) => json);

        


        setTimeout(weatherInfo(meteo),1000)
}

const weatherInfo = async (data)=>{
    const name = data.name
    const temperature = Math.round(data.main.temp)
    const conditions = data.weather[0].main
    const descriptions = data.weather[0].description
    const latitude = data.coord.lat;
    const longitude = data.coord.lon;
    const vent = data.wind.speed
    const humid = data.main.humidity
    const press = data.main.pressure
    
    const heureL = await fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=NETFNVYNIQGM&format=json&by=position&lat=${latitude}&lng=${longitude}`)
        .then(result => result.json())
        .then (json => myConvertM(json.formatted));

    document.getElementById('ville').textContent = name;
    document.getElementById('temperature').textContent = temperature;
    document.getElementById('descriptions').textContent = descriptions;
    document.querySelector('i.wi').className = weatherIcons[conditions]
    document.querySelector('#blocpage').className = conditions.toLowerCase();
    document.getElementById('humidity').textContent= `l'humidité acutelle est de ${humid}%`
    document.getElementById('coord').textContent= `Vos coordonnées: latitude:${latitude}, longitude:${longitude}`
    document.querySelector('#pression').textContent = `le vent est a une vitesse de ${vent}m/s et il y a une pression actuelle de ${press}hPa `
    document.getElementById('time').textContent = `il est actuellement ${heureL} à ${name} `

};

const affichageHeure = async function(){
    const ip =  await fetch(`https://api.ipify.org?format=json`)
        .then((result) => result.json())
        .then((json) =>  json.ip);

        const horaire = await fetch(`http://worldtimeapi.org/api/ip/${ip}`)
        .then((result) => result.json())
        .then((json) =>myConvertH(json.datetime))
        const heure= document.getElementById('horaire')
        heure.textContent = horaire;

        
 
    setTimeout(affichageHeure, 1000);
}

const ville = document.querySelector('#ville')

ville.addEventListener('click',()=>{
    ville.contentEditable = true;
})

ville.addEventListener('keydown',(e)=>{
    if(e.keyCode === 13){
        e.preventDefault();
        ville.contentEditable = false
        main(false);
    }
})


main()
affichageHeure()

