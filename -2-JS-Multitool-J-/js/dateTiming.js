let timer
let isRunning = false
let workTime = 25 * 60
let breakTime = 5 * 60
let timeLeft = workTime
let isWorkSession = true
let cycleCount = 1
let autoStart = false

// Элементы DOM
const minutesElement = document.getElementById('minutes')
const secondsElement = document.getElementById('seconds')
const statusText = document.getElementById('status-text')
const cycleNumber = document.getElementById('cycle-number')
const startButton = document.getElementById('start')
const pauseButton = document.getElementById('pause')
const resetButton = document.getElementById('reset')
const skipButton = document.getElementById('skip')
const settingsButton = document.getElementById('settings-button')
const settingsModal = document.getElementById('settings-modal')
const saveSettingsButton = document.getElementById('save-settings')
const closeSettingsButton = document.getElementById('close-settings')
const workHoursInput = document.getElementById('work-hours')
const workMinutesInput = document.getElementById('work-minutes')
const workSecondsInput = document.getElementById('work-seconds')
const breakHoursInput = document.getElementById('break-hours')
const breakMinutesInput = document.getElementById('break-minutes')
const breakSecondsInput = document.getElementById('break-seconds')
const autoStartToggle = document.getElementById('auto-start-toggle')
const alarmModal = document.getElementById('alarm-modal')
const alarmConfirmButton = document.getElementById('alarm-confirm')

// Звуковые эффекты
const buttonClickSound = new Audio('./sounds/button-click.mp3')
const alarmSound = new Audio('./sounds/alarm.mp3')

// Функция воспроизведения звука
function playSound(sound, duration = null) {
	sound.currentTime = 0
	sound.play()

	if (duration) {
		setTimeout(() => {
			sound.pause()
			sound.currentTime = 0
		}, duration)
	}
}

// Функция обновления отображения таймера
function updateDisplay() {
	const minutes = Math.floor(timeLeft / 60)
	const seconds = timeLeft % 60

	minutesElement.textContent = String(minutes).padStart(2, '0')
	secondsElement.textContent = String(seconds).padStart(2, '0')
}

// Функция для отображения будильника
function showAlarm() {
	alarmModal.classList.add('active')
	playSound(alarmSound)
}

// Функция для скрытия будильника
function hideAlarm() {
	alarmModal.classList.remove('active')
	alarmSound.pause()
	alarmSound.currentTime = 0
}

// Функция обновления статуса
function updateStatus() {
	statusText.textContent = isWorkSession ? 'Рабочее время' : 'Время отдыха'

	if (!isWorkSession && timeLeft === breakTime) {
		cycleCount++
		cycleNumber.textContent = `#${cycleCount}`
	}
}

// Функция для старта таймера
function startTimer() {
	if (isRunning) return

	isRunning = true
	playSound(buttonClickSound)
	timer = setInterval(() => {
		if (timeLeft > 0) {
			timeLeft--
			updateDisplay()
		} else {
			clearInterval(timer)
			isRunning = false

			// Показываем будильник
			if (timeLeft === 0 && isWorkSession) {
				showAlarm()
			} else {
				playSound(alarmSound, 5000)
			}

			isWorkSession = !isWorkSession
			timeLeft = isWorkSession ? workTime : breakTime
			updateStatus()
			updateDisplay()

			if (autoStart) {
				startTimer()
			}
		}
	}, 1000)
}

// Функция для паузы таймера
function pauseTimer() {
	clearInterval(timer)
	isRunning = false
	playSound(buttonClickSound)
}

// Функция для сброса таймера
function resetTimer() {
	clearInterval(timer)
	isRunning = false
	cycleCount = 1
	cycleNumber.textContent = `#${cycleCount}`
	isWorkSession = true
	timeLeft = workTime
	updateDisplay()
	updateStatus()
	playSound(buttonClickSound) // Звук при клике на "Reset"
}

// Функция для пропуска текущей сессии
function skipTimer() {
	clearInterval(timer)
	isWorkSession = !isWorkSession
	timeLeft = isWorkSession ? workTime : breakTime
	updateStatus()
	updateDisplay()
	isRunning = false
	playSound(buttonClickSound) // Звук при клике на "Skip"
}

// Функция для открытия настроек
function openSettings() {
	settingsModal.classList.add('active')
	playSound(buttonClickSound) // Звук при клике на "Настройки"
}

// Функция для закрытия настроек
function closeSettings() {
	settingsModal.classList.remove('active')
	playSound(buttonClickSound) // Звук при клике на "Закрыть"
}

// Функция для сохранения настроек
function saveSettings() {
	// Чтение времени работы
	const workHours = parseInt(workHoursInput.value, 10) || 0
	const workMinutes = parseInt(workMinutesInput.value, 10) || 0
	const workSeconds = parseInt(workSecondsInput.value, 10) || 0
	workTime = workHours * 3600 + workMinutes * 60 + workSeconds

	// Чтение времени отдыха
	const breakHours = parseInt(breakHoursInput.value, 10) || 0
	const breakMinutes = parseInt(breakMinutesInput.value, 10) || 0
	const breakSeconds = parseInt(breakSecondsInput.value, 10) || 0
	breakTime = breakHours * 3600 + breakMinutes * 60 + breakSeconds

	// Устанавливаем начальное время в зависимости от текущей сессии
	timeLeft = isWorkSession ? workTime : breakTime

	// Обновление автостарта
	autoStart = autoStartToggle.checked

	updateDisplay()
	closeSettings()
	playSound(buttonClickSound) // Звук при клике на "Сохранить"
}

// События для кнопок
startButton.addEventListener('click', startTimer)
pauseButton.addEventListener('click', pauseTimer)
resetButton.addEventListener('click', resetTimer)
skipButton.addEventListener('click', skipTimer)
settingsButton.addEventListener('click', openSettings)
closeSettingsButton.addEventListener('click', closeSettings)
saveSettingsButton.addEventListener('click', saveSettings)
alarmConfirmButton.addEventListener('click', hideAlarm) // Закрытие модального окна будильника

// Инициализация начального состояния
updateDisplay()
updateStatus()
