// Функция для получения погоды по геолокации
function getWeatherByLocation(lat, lon) {
	let locationKey = `${lat},${lon}_${units}`;
	if (isCacheValid(locationKey)) {
			updateWeatherInfo(weatherCache[locationKey].data);
	} else {
			fetchWeatherData(`lat=${lat}&lon=${lon}`, locationKey);
	}
	lastQuery = {
			type: 'coordinates',
			lat: lat,
			lon: lon
	};
}

// Функция для получения погоды по названию города
function getWeatherByCity(city) {
	let locationKey = `${city.toLowerCase()}_${units}`;
	if (isCacheValid(locationKey)) {
			updateWeatherInfo(weatherCache[locationKey].data);
	} else {
			fetchWeatherData(`q=${city}`, locationKey);
	}
	lastQuery = {
			type: 'city',
			city: city
	};
}

// Функция для запроса данных из API
function fetchWeatherData(query, locationKey) {
	fetch(`https://api.openweathermap.org/data/2.5/forecast?${query}&units=${units}&lang=ru&appid=${apiKey}`)
			.then(response => {
					if (!response.ok) {
							if (response.status === 429) {
									throw new Error('Превышен лимит запросов к API. Пожалуйста, попробуйте позже.');
							} else if (response.status === 404) {
									throw new Error('Город не найден!');
							} else {
									throw new Error('Ошибка при получении данных о погоде.');
							}
					}
					return response.json();
			})
			.then(data => {
					if (data.cod === "404" && data.message === "city not found") {
							alert('Город не найден!');
							return;
					}
					if (data.cod !== "200") {
							alert('Ошибка при получении данных о погоде.');
							return;
					}
					weatherCache[locationKey] = {
							data: data,
							timestamp: new Date().getTime()
					};
					updateWeatherInfo(data);
			})
			.catch(error => {
					console.error(error.message);
					alert(error.message);
			});
}

window.getWeatherByLocation = getWeatherByLocation;
window.getWeatherByCity = getWeatherByCity;
