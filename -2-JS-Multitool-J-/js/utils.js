const weatherEmojis = {
	200: '⛈️',
	201: '⛈️',
	202: '⛈️',
	210: '🌩️',
	211: '🌩️',
	212: '🌩️',
	221: '🌩️',
	230: '⛈️',
	231: '⛈️',
	232: '⛈️',
	300: '🌦️',
	301: '🌦️',
	302: '🌦️',
	310: '🌦️',
	311: '🌦️',
	312: '🌧️',
	313: '🌧️',
	314: '🌧️',
	321: '🌧️',
	500: '🌦️',
	501: '🌧️',
	502: '🌧️',
	503: '🌧️',
	504: '🌧️',
	511: '🌨️',
	520: '🌦️',
	521: '🌧️',
	522: '🌧️',
	531: '🌧️',
	600: '❄️',
	601: '❄️',
	602: '❄️',
	611: '🌨️',
	612: '🌨️',
	613: '🌨️',
	615: '🌨️',
	616: '🌨️',
	620: '🌨️',
	621: '🌨️',
	622: '🌨️',
	701: '🌫️',
	711: '🌫️',
	721: '🌫️',
	731: '🌪️',
	741: '🌫️',
	751: '🌪️',
	761: '🌪️',
	762: '🌋',
	771: '💨',
	781: '🌪️',
	800: '☀️',
	801: '🌤️',
	802: '⛅',
	803: '🌥️',
	804: '☁️',
}

// Функция для получения смайлика по коду погодного условия
function getWeatherEmoji(weatherId) {
	return weatherEmojis[weatherId] || '🌈'
}

// Функция форматирования даты
function formatDate(dateString) {
	let date = new Date(dateString)
	return date.toLocaleDateString('ru-RU', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	})
}

// Проверка валидности кэша
function isCacheValid(locationKey) {
	const tenMinutes = 10 * 60 * 1000
	if (weatherCache[locationKey]) {
		let currentTime = new Date().getTime()
		return currentTime - weatherCache[locationKey].timestamp < tenMinutes
	}
	return false
}

function getLocalDateString() {
	let today = new Date()
	let year = today.getFullYear()
	let month = ('0' + (today.getMonth() + 1)).slice(-2)
	let day = ('0' + today.getDate()).slice(-2)
	return `${year}-${month}-${day}`
}

window.getLocalDateString = getLocalDateString

// Глобальные переменные
window.apiKey = 'd1a8388cb7695f7895daa88da8f74c04'
window.units = 'metric'
window.weatherCache = {}
window.lastQuery = null

// Экспорт функций в глобальную область
window.getWeatherEmoji = getWeatherEmoji
window.formatDate = formatDate
window.isCacheValid = isCacheValid
