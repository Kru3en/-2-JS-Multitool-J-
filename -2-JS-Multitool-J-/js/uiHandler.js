// Функция для обновления информации о погоде
function updateWeatherInfo(data) {
	document.querySelector(
		'.location'
	).textContent = `${data.city.name}, ${data.city.country}`
	displayCurrentWeather(data)
	displayTodayForecast(data)
	displayForecast(data)
}

// Функция для отображения текущей погоды
function displayCurrentWeather(data) {
	let currentData = data.list[0]
	let temperature = currentData.main.temp
	let weatherId = currentData.weather[0].id
	let description = currentData.weather[0].description
	let emoji = getWeatherEmoji(weatherId)

	let tempDisplay =
		units === 'metric'
			? `${temperature.toFixed(1)} °C`
			: `${temperature.toFixed(1)} °F`

	document.querySelector('.currentWeather .temperature').textContent =
		tempDisplay
	document.querySelector('.currentWeather .description').textContent =
		description
	document.querySelector('.currentWeather .emoji').textContent = emoji
}

// Отображения прогноза на сегодня по часам
function displayTodayForecast(data) {
	const todayForecastContainer = document.querySelector('.todayForecast')
	todayForecastContainer.innerHTML = '' 

	let today = getLocalDateString()

	let todayData = data.list.filter(item => item.dt_txt.split(' ')[0] === today)
	console.log(data.list)
	console.log(new Date().toISOString().split('T')[0])
	if (todayData.length === 0) {
		todayForecastContainer.innerHTML = '<p>Нет данных прогноза на сегодня.</p>'
		return
	}

	let hourlyForecast = document.createElement('div')
	hourlyForecast.classList.add('hourlyForecast')

	todayData.forEach(item => {
		let time = item.dt_txt.split(' ')[1].substring(0, 5)
		let temperature = item.main.temp
		let weatherId = item.weather[0].id
		let description = item.weather[0].description
		let emoji = getWeatherEmoji(weatherId)

		let tempDisplay =
			units === 'metric'
				? `${temperature.toFixed(1)} °C`
				: `${temperature.toFixed(1)} °F`

		let timeSlot = document.createElement('div')
		timeSlot.classList.add('timeSlot')
		timeSlot.innerHTML = `
					<p>${time}</p>
					<p class="emoji">${emoji}</p>
					<p>${tempDisplay}</p>
					<p>${description}</p>
			`
		hourlyForecast.appendChild(timeSlot)
	})

	todayForecastContainer.appendChild(hourlyForecast)
}

// Функция для отображения прогноза на следующие дни
function displayForecast(data) {
	const forecastContainer = document.querySelector('.forecast')
	forecastContainer.innerHTML = ''

	let dailyData = {}
	data.list.forEach(item => {
		let date = item.dt_txt.split(' ')[0]
		let today = new Date().toISOString().split('T')[0]
		if (date !== today) {
			if (!dailyData[date]) {
				dailyData[date] = []
			}
			dailyData[date].push(item)
		}
	})

	Object.keys(dailyData)
		.slice(0, 5)
		.forEach(date => {
			let dayData = dailyData[date]
			let tempSum = 0
			dayData.forEach(item => {
				tempSum += item.main.temp
			})
			let tempAvg = tempSum / dayData.length

			let tempDisplay =
				units === 'metric'
					? `${tempAvg.toFixed(1)} °C`
					: `${tempAvg.toFixed(1)} °F`

			let weatherId = dayData[0].weather[0].id
			let description = dayData[0].weather[0].description
			let emoji = getWeatherEmoji(weatherId)

			let forecastItem = document.createElement('div')
			forecastItem.classList.add('forecastItem')
			forecastItem.innerHTML = `
					<h3>${formatDate(date)}</h3>
					<p class="emoji">${emoji}</p>
					<p>${tempDisplay}</p>
					<p>${description}</p>
			`
			forecastContainer.appendChild(forecastItem)
		})
}

// Экспорт функции в глобальную область
window.updateWeatherInfo = updateWeatherInfo

// Переключение единиц измерения
function toggleUnits() {
	if (units === 'metric') {
		units = 'imperial'
		document.getElementById('toggleUnits').textContent = 'Переключить на °C'
	} else {
		units = 'metric'
		document.getElementById('toggleUnits').textContent = 'Переключить на °F'
	}
	weatherCache = {}
	if (lastQuery) {
		if (lastQuery.type === 'city') {
			getWeatherByCity(lastQuery.city)
		} else if (lastQuery.type === 'coordinates') {
			getWeatherByLocation(lastQuery.lat, lastQuery.lon)
		}
	} else {
		alert(
			'Не удалось определить предыдущее местоположение. Пожалуйста, введите город вручную.'
		)
	}
}

// Обработчики событий
document.getElementById('toggleUnits').addEventListener('click', toggleUnits)

document.getElementById('searchButton').addEventListener('click', () => {
	let cityInput = document.getElementById('cityInput')
	let city = cityInput.value.trim()
	if (city) {
		getWeatherByCity(city)
		cityInput.value = ''
	}
})

window.addEventListener('load', () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			position => {
				getWeatherByLocation(
					position.coords.latitude,
					position.coords.longitude
				)
			},
			error => {
				console.error('Ошибка при получении местоположения:', error)
				alert(
					'Не удалось получить ваше местоположение. Пожалуйста, введите город вручную.'
				)
			}
		)
	} else {
		alert(
			'Геолокация не поддерживается вашим браузером. Пожалуйста, введите город вручную.'
		)
	}
})
