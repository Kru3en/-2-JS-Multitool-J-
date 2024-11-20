const calculatorDisplay = document.querySelector('.calculatorDisplay')
const calculatorButtons = document.querySelectorAll('.calculatorButton')

let currentInput = ''

calculatorButtons.forEach(button => {
	button.addEventListener('click', event => {
		handleButtonClick(event.target.textContent)
	})
})

document.addEventListener('keydown', event => {
	handleKeyPress(event)
})

function handleButtonClick(value) {
	switch (value) {
		case 'C':
			currentInput = ''
			calculatorDisplay.value = currentInput
			break
		case '<':
			currentInput = currentInput.slice(0, -1)
			calculatorDisplay.value = currentInput
			break
		case '=':
			try {
				let result = eval(currentInput)
				result = roundResult(result)
				calculatorDisplay.value = result
				currentInput = result.toString()
			} catch (e) {
				calculatorDisplay.value = 'Error'
				currentInput = ''
			}
			break
		case '.':
			if (currentInput === '' || lastCharIsOperator(currentInput)) {
				currentInput += '0.'
				calculatorDisplay.value = currentInput
			} else {
				let lastNumber = getLastNumber(currentInput)
				if (!lastNumber.includes('.')) {
					currentInput += '.'
					calculatorDisplay.value = currentInput
				}
			}
			break
		default:
			if (isOperator(value)) {
				if (currentInput === '') {
					if (value === '-') {
						currentInput += value
						calculatorDisplay.value = currentInput
					} else {
						break
					}
				} else if (lastCharIsOperator(currentInput)) {
					currentInput = currentInput.slice(0, -1) + value
					calculatorDisplay.value = currentInput
				} else {
					currentInput += value
					calculatorDisplay.value = currentInput
				}
			} else if (value >= '0' && value <= '9') {
				currentInput += value
				calculatorDisplay.value = currentInput
			} else if (value === '(' || value === ')') {
				currentInput += value
				calculatorDisplay.value = currentInput
			}
			break
	}
}

function handleKeyPress(event) {
	let key = event.key
	switch (key) {
		case '0':
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
			handleButtonClick(key)
			event.preventDefault()
			break
		case '+':
		case '-':
		case '*':
		case '/':
			handleButtonClick(key)
			event.preventDefault()
			break
		case 'Enter':
		case '=':
			handleButtonClick('=')
			event.preventDefault()
			break
		case 'Backspace':
			handleButtonClick('<')
			event.preventDefault()
			break
		case 'Escape':
			handleButtonClick('C')
			event.preventDefault()
			break
		case '.':
			handleButtonClick('.')
			event.preventDefault()
			break
		case '(':
		case ')':
			handleButtonClick(key)
			event.preventDefault()
			break
		default:
			event.preventDefault()
			break
	}
}

function isOperator(char) {
	return ['+', '-', '*', '/'].includes(char)
}

function lastCharIsOperator(input) {
	return isOperator(input[input.length - 1])
}

function getLastNumber(input) {
	let tokens = input.split(/[\+\-\*\/\(\)]/)
	return tokens[tokens.length - 1]
}

function roundResult(result) {
	return parseFloat(result.toFixed(10))
}
