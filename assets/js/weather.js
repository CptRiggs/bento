// ┬ ┬┌─┐┌─┐┌┬┐┬ ┬┌─┐┬─┐
// │││├┤ ├─┤ │ ├─┤├┤ ├┬┘
// └┴┘└─┘┴ ┴ ┴ ┴ ┴└─┘┴└─
// Functions to setup Weather widget.

const iconElement = document.querySelector('.weatherIcon');
const tempElement = document.querySelector('.weatherValue p');
const descElement = document.querySelector('.weatherDescription p');

const weather = {};
weather.temperature = {
	unit: 'celsius',
};

var tempUnit = CONFIG.weatherUnit;

const KELVIN = 273.15;
const key = `${CONFIG.weatherKey}`;
setPosition();

function setPosition(position) {
	if (!CONFIG.trackLocation || !navigator.geolocation) {
		if (CONFIG.trackLocation) {
			console.error('Geolocation not available');
		}
		getWeather(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
		return;
	}
	navigator.geolocation.getCurrentPosition(
		pos => {
			getWeather(pos.coords.latitude.toFixed(3), pos.coords.longitude.toFixed(3));
		},
		err => {
			console.error(err);
			getWeather(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
		}
	);
}

function getWeather(latitude, longitude) {
	let api = `https://wttr.in/${latitude},${longitude}?format=j2`
	let weatherCode = {"113":"01","116":"02","119":"03","122":"04","143":"50","176":"09","179":"13","182":"13","185":"13","200":"11","227":"13","230":"13","248":"50","260":"50","263":"09","266":"09","281":"09","284":"09","293":"09","296":"10","299":"10","302":"10","305":"10","308":"10","311":"09","314":"10","317":"13","320":"13","323":"13","326":"13","329":"13","332":"13","335":"13","338":"13","350":"13","353":"09","356":"10","359":"10","362":"13","365":"13","368":"13","371":"13","374":"13","377":"13","386":"11","389":"11","392":"11","395":"11"}
	fetch(api)
		.then(function(response) {
			let data = response.json();
			return data;
		})
		.then(function(data) {
			let celsius = Math.floor(data.current_condition[0].temp_C)
			weather.temperature.value = tempUnit == 'C' ? celsius : (celsius * 9) / 5 + 32;
			weather.description = data.current_condition[0].weatherDesc[0].value;
      let localObsDateTime = data.current_condition[0].localObsDateTime.toString().split(' ');
			weather.iconId = weatherCode[data.current_condition[0].weatherCode] + (localObsDateTime[localObsDateTime.length - 1] == 'AM' ? 'd' : 'n');
		})
		.then(function() {
			displayWeather();
		});
}

function displayWeather() {
	iconElement.innerHTML = `<img src="assets/icons/${CONFIG.weatherIcons}/${weather.iconId}.png"/>`;
	tempElement.innerHTML = `${weather.temperature.value.toFixed(0)}°<span class="darkfg">${tempUnit}</span>`;
	descElement.innerHTML = weather.description;
}
