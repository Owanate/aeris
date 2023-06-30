// Get apiKey
const apiKey ="bb54be0147ot8a4cca9066da1f16f233";

// Set Current Date
let date = new Date();
let today = document.querySelector('#date')
let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"];
if (date.getHours() < 12 || date.getHours() == 0){
    today.innerText =`${days[date.getDay()]}, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}am`
}else{
    today.innerText =`${days[date.getDay()]}, ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}pm`
}   

// Display Weather details
function displayWeather(data) {
    document.querySelector('#city').innerText = `${data.city}, ${data.country}`;
    document.querySelector('#humidity').innerText = `${data.temperature.humidity}%`;
    document.querySelector('#wind').innerText = `${data.wind.speed} km/h`;
    document.querySelector('#temp').innerText = `${data.temperature.current.toFixed()}°C`;
    document.querySelector('.weather__icon').src = data.condition.icon_url;
    document.querySelector('#pressure').innerText = `${data.temperature.pressure} mb`
}

// Weather of current position
navigator.geolocation.getCurrentPosition(currentPosition);
async function currentPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    const url = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    displayWeather(data);
    getForecast(lat, lon);
}

// Search Form
let searchBtn = document.querySelectorAll('.search-btn');
for (let btn of searchBtn){
    let city = document.querySelectorAll('.input')
    for (let input of city){
        btn.addEventListener('click',(event) => {
        event.preventDefault();
        fetch (`https://api.shecodes.io/weather/v1/current?query=${input.value}&key=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            document.body.style.backgroundImage = `url('https://source.unsplash.com/1500x600/?${data.city}")`
        });
        })
    }
}

// Weather Forecast
async function getForecast(lat, lon) {
    let url = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${apiKey}`
    const response = await fetch(url)
    const data = await response.json();
    document.querySelector('.description__icon').src = data.daily[0].condition.icon_url;
    document.querySelector('#desc').innerText = `${data.daily[0].condition.description.charAt(0).toUpperCase()}${data.daily[0].condition.description.slice(1)} tomorrow`;
    for (let i = 0; i < 4; i++) {
        let tomorrow = new Date();
        tomorrow.setDate(new Date().getDate() + i);
        let forecast = 
            `<div class="weather-forecast">
                <p class="weather-forecast__day">${days[tomorrow.getDay()]}</p>
                <img src="${data.daily[i].condition.icon_url}" alt="" class="weather-forecast__icon">
                <p class="weather-forecast__temp">
                    <span class="max">${data.daily[i].temperature.maximum.toFixed()}°</span>
                    <span class="min">${data.daily[i].temperature.minimum.toFixed()}°</span>
                </p>
            </div>`;
        document.querySelector('.forecast').insertAdjacentHTML('beforeend', forecast);
    }
}