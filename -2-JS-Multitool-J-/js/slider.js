document.addEventListener('DOMContentLoaded', () => {
	const sliderVisibleContainer = document.querySelector(
		'.sliderVisibleContainer'
	)
	const sliderList = document.querySelector('.sliderList')
	const slides = document.querySelectorAll('.imgItem')
	const prevButton = document.querySelector('.prev')
	const nextButton = document.querySelector('.next')

	let currentIndex = 0
	const countSlidesActive = 4
	const slideStyle = getComputedStyle(slides[0])
	const sliderListStyle = getComputedStyle(sliderList)
	const slideWidth = parseFloat(slideStyle.minWidth)
	const slideGap = parseFloat(sliderListStyle.columnGap)
	const slideSwipeWidth = slideWidth + slideGap
	sliderVisibleContainer.style.width = `${
		slideSwipeWidth * countSlidesActive
	}px`
	const updateButtons = () => {
		prevButton.disabled = currentIndex === 0
		nextButton.disabled = currentIndex >= slides.length - countSlidesActive
	}
	console.log(slideSwipeWidth)

	const slideTo = index => {
		sliderList.style.transform = `translateX(-${index * slideSwipeWidth}px)`
		currentIndex = index
		updateButtons()
	}

	prevButton.addEventListener('click', () => {
		if (currentIndex > 0) slideTo(currentIndex - 1)
	})

	nextButton.addEventListener('click', () => {
		if (currentIndex < slides.length - 3) slideTo(currentIndex + 1)
	})

	updateButtons()
})
