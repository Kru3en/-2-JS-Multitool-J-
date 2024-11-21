let gridWidth = 5
let gridHeight = 5
let level = 1
let gameContainer = document.getElementById('gameContainer')
let startButton = document.getElementById('startButton')
let restartButton = document.getElementById('restartButton')
let settingsButton = document.getElementById('settingsButton')
let saveSettingsButton = document.getElementById('saveSettings')
let gridWidthInput = document.getElementById('gridWidth')
let gridHeightInput = document.getElementById('gridHeight')
let wallCountInput = document.getElementById('wallCount')
let levelDisplay = document.getElementById('levelDisplay')
let settingsModal = document.getElementById('settingsModal')
let closeModal = document.getElementsByClassName('close')[0]
let gameOver = false
let playerPosition = { x: 0, y: 0 }
let finishPosition = { x: 0, y: 0 }
let walls = []
let wallCount = 1

function createGrid() {
	gameContainer.innerHTML = ''
	for (let y = 0; y < gridHeight; y++) {
		let row = document.createElement('div')
		row.classList.add('row')
		for (let x = 0; x < gridWidth; x++) {
			let cell = document.createElement('div')
			cell.classList.add('cell')
			cell.id = `cell-${x}-${y}`
			row.appendChild(cell)
		}
		gameContainer.appendChild(row)
	}
}

function placePlayer() {
	let cell = document.getElementById(
		`cell-${playerPosition.x}-${playerPosition.y}`
	)
	cell.classList.add('player')
	cell.textContent = '👴'
}

function placeFinish() {
	finishPosition = { x: gridWidth - 1, y: gridHeight - 1 }
	let cell = document.getElementById(
		`cell-${finishPosition.x}-${finishPosition.y}`
	)
	cell.classList.add('finish')
}

function generateWalls() {
	walls = []
	let totalWalls = wallCount

	let grid = []
	for (let y = 0; y < gridHeight; y++) {
		grid[y] = []
		for (let x = 0; x < gridWidth; x++) {
			grid[y][x] = 0
		}
	}

	let attempts = 0
	while (walls.length < totalWalls && attempts < 1000) {
		attempts++
		let wallX = Math.floor(Math.random() * gridWidth)
		let wallY = Math.floor(Math.random() * gridHeight)
		if (
			(wallX === playerPosition.x && wallY === playerPosition.y) ||
			(wallX === finishPosition.x && wallY === finishPosition.y)
		) {
			continue
		}
		if (grid[wallY][wallX] === 1) continue

		grid[wallY][wallX] = 1
		if (isPathAvailable(grid)) {
			walls.push({ x: wallX, y: wallY })
			let cell = document.getElementById(`cell-${wallX}-${wallY}`)
			cell.classList.add('wall')
		} else {
			grid[wallY][wallX] = 0
		}
	}
}

function isPathAvailable(grid) {
	let visited = []
	for (let y = 0; y < gridHeight; y++) {
		visited[y] = []
		for (let x = 0; x < gridWidth; x++) {
			visited[y][x] = false
		}
	}
	let queue = []
	queue.push({ x: playerPosition.x, y: playerPosition.y })
	visited[playerPosition.y][playerPosition.x] = true

	let directions = [
		{ x: 0, y: -1 }, // вверх
		{ x: 0, y: 1 }, // вниз
		{ x: -1, y: 0 }, // влево
		{ x: 1, y: 0 }, // вправо
	]

	while (queue.length > 0) {
		let current = queue.shift()
		if (current.x === finishPosition.x && current.y === finishPosition.y) {
			return true
		}

		for (let dir of directions) {
			let newX = current.x + dir.x
			let newY = current.y + dir.y
			if (
				newX >= 0 &&
				newX < gridWidth &&
				newY >= 0 &&
				newY < gridHeight &&
				!visited[newY][newX] &&
				grid[newY][newX] === 0
			) {
				visited[newY][newX] = true
				queue.push({ x: newX, y: newY })
			}
		}
	}
	return false
}

function startGame() {
	gameOver = false
	playerPosition = { x: 0, y: 0 }
	level = 1
	levelDisplay.textContent = `Уровень: ${level}`
	createGrid()
	placePlayer()
	placeFinish()
	generateWalls()
	document.addEventListener('keydown', handleKeyDown)
	restartButton.disabled = false
	startButton.disabled = true
}

function restartGame() {
	gameOver = false
	playerPosition = { x: 0, y: 0 }
	levelDisplay.textContent = `Уровень: ${level}`
	createGrid()
	placePlayer()
	placeFinish()
	generateWalls()
}

function handleKeyDown(event) {
	if (gameOver) return
	let newX = playerPosition.x
	let newY = playerPosition.y

	if (event.key === 'ArrowUp') newY--
	else if (event.key === 'ArrowDown') newY++
	else if (event.key === 'ArrowLeft') newX--
	else if (event.key === 'ArrowRight') newX++
	else return

	movePlayer(newX, newY)
}

function movePlayer(x, y) {
	if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) {
		endGame('Вы вышли за пределы поля! Игра окончена.')
		return
	}

	let nextCell = document.getElementById(`cell-${x}-${y}`)
	if (nextCell.classList.contains('wall')) {
		endGame('Вы врезались в стену! Игра окончена.')
		return
	}

	let currentCell = document.getElementById(
		`cell-${playerPosition.x}-${playerPosition.y}`
	)
	currentCell.classList.remove('player')
	currentCell.textContent = ''

	playerPosition = { x, y }
	placePlayer()

	if (
		playerPosition.x === finishPosition.x &&
		playerPosition.y === finishPosition.y
	) {
		levelUp()
	}
}

function levelUp() {
	alert('Уровень пройден! Переход на следующий уровень.')
	level++
	levelDisplay.textContent = `Уровень: ${level}`
	wallCount++
	restartGame()
}

function endGame(message) {
	alert(message)
	gameOver = true
	document.removeEventListener('keydown', handleKeyDown)
	startButton.disabled = false
}

function openSettings() {
	settingsModal.style.display = 'block'
}

function closeSettings() {
	settingsModal.style.display = 'none'
}

function saveSettings() {
	gridWidth = parseInt(gridWidthInput.value)
	gridHeight = parseInt(gridHeightInput.value)
	wallCount = parseInt(wallCountInput.value)
	if (isNaN(wallCount) || wallCount < 0) {
		wallCount = 0
	}
	closeSettings()
	restartGame()
}

startButton.addEventListener('click', startGame)
restartButton.addEventListener('click', restartGame)
settingsButton.addEventListener('click', openSettings)
closeModal.addEventListener('click', closeSettings)
saveSettingsButton.addEventListener('click', saveSettings)

window.onclick = function (event) {
	if (event.target == settingsModal) {
		settingsModal.style.display = 'none'
	}
}
