'use strict';

class SliderCarousel {
	constructor({
		main,
		wrap,
		next, // стрелочки
		prev,
		infinity = false, // при последнем слайде возвр. к 1-му
		position = 0,
		slidesToShow = 3, // количество слайдов по умолчанию
		responsive = [] // адаптация по ширине
	}) {
		if (!main || !wrap) {
			console.warn(`slider-carousel: необходимо 2 свойства, "main" и "wrap"!`);
		}
		this.main = document.querySelector(main);
		this.wrap = document.querySelector(wrap);
		this.slides = document.querySelector(wrap).children; // получаем детей, элементы слайда
		this.next = document.querySelector(next);
		this.prev = document.querySelector(prev);
		this.slidesToShow = slidesToShow;
		this.options = {
			position, // позиция слайдера
			infinity,
			widthSlide: Math.floor(100 / this.slidesToShow), // автоматич. вычисле-е ширины для слайда
			maxPosition: this.slides.length - this.slidesToShow, // max оставшееся количество слайдов
		};
		this.responsive = responsive;
	}


	init() {
		this.addGloClass();
		this.addStyle();

		if (this.prev && this.next) { // если передали стрелки
			this.controlSlider();
		} else {
			this.addArrow();
			this.controlSlider();
		}

		if (this.responsive) { // если он передан в массив
			this.responseInit();
		}
	}

	addGloClass() {
		this.main.classList.add('glo-slider'); // добавляем классы
		this.wrap.classList.add('glo-slider__wrap');
		for (const item of this.slides) {
			item.classList.add('glo-slider__item');
		}
	}

	// создаём элемент со стилями
	addStyle() {
		let style = document.getElementById('sliderCarousel-style');

		if (!style) { // если style нет
			style = document.createElement('style');
			style.setAttribute('id', 'sliderCarousel-style');
		}

		style.textContent = `
			.glo-slider { 
				overflow: hidden !important;
			}
			.glo-slider__wrap {
				display: flex !important;
				transition: transform 0.5s !important;
				will-change: transform !important;
			}
			.glo-slider__item {
				display: flex !important;
				align-items: center;
				justify-content: center;
				flex: 0 0 ${this.options.widthSlide}% !important; 
				margin: auto 0 !important; 
			}
			.glo-slider__prev,
			.glo-slider__next {
				margin: 0 10px;
				border: 20px solid transparent;
				background: transparent;
				cursor: pointer !important;
			}
			.glo-slider__next {
				border-left-color: #19b5fe;
			}
			.glo-slider__prev {
				border-right-color: #19b5fe;
			}
			.glo-slider__prev:focus,
			.glo-slider__next:focus, 
			.glo-slider__prev:hover,
			.glo-slider__next:hover {
				outline: transparent !important;
				background: transparent !important;
			}
		`;

		// добавляем элемент в head
		document.head.appendChild(style);
	}

	controlSlider() { // если стрелки передал пользователь
		this.prev.addEventListener('click', this.prevSlider.bind(this));
		this.next.addEventListener('click', this.nextSlider.bind(this));
	}

	prevSlider() {
		if (this.options.infinity || this.options.position > 0) { // чтобы не перемещались пустые элем.
			--this.options.position;
			if (this.options.position < 0) {
				this.options.position = this.options.maxPosition; // при нажатии влево прокруч. до 4 послед. слайдов
			}
			this.wrap.style.transform = `translateX(-${this.options.position * this.options.widthSlide}%)`; // сдвиг на ширину 1 слайда 
		}

	}

	nextSlider() {
		if (this.options.infinity || this.options.position < this.options.maxPosition) { // если меньше крутим вправо, иначе останавливается
			++this.options.position;
			if (this.options.position > this.options.maxPosition) {
				this.options.position = 0;
			}
			this.wrap.style.transform = `translateX(-${this.options.position * this.options.widthSlide}%)`; // т.к. position м.б. отрицательным
		}
	}


	addArrow() { // добавляем стрелки
		this.prev = document.createElement('button');
		this.next = document.createElement('button');

		this.prev.className = 'glo-slider__prev'; // добавляю класс
		this.next.className = 'glo-slider__next';

		this.main.appendChild(this.prev); // добавляем на страницу
		this.main.appendChild(this.next);
	}

	responseInit() {
		const slidesToShowDefault = this.slidesToShow; // сохр. в переменной ко-во слайдов, оно будет по-умолчанию
		const allResponse = this.responsive.map(item => item.breakpoint); // созд. новый массив со значениями breakpoint
		const maxResponse = Math.max(...allResponse); // получем max число из всех breakpoint

		const checkResponse = () => {
			const widthWindow = document.documentElement.clientWidth; // получ. ширину экрана без скролла
			if (widthWindow < maxResponse) { // если ширина экрана м. breakpoint
				for (let i = 0; i < allResponse.length; i++) { // allResponse.length - коли-во эл. массива
					if (widthWindow < allResponse[i]) { // если шир. экрана < следующего breakpoint 
						this.slidesToShow = this.responsive[i].slideToShow; // коли-во слайдов на стр.
						this.options.widthSlide = Math.floor(100 / this.slidesToShow); // меняется ширина слайда
						this.addStyle(); // меняем стили
					}
				}
			} else { // если шир. экарана = или > breakpoint
				this.slidesToShow = slidesToShowDefault; // по умолчанию, 4
				this.options.widthSlide = Math.floor(100 / this.slidesToShow); // меняется ширина слайда
				this.addStyle(); // меняем стили
			}

		};

		checkResponse();

		window.addEventListener('resize', checkResponse); // вешаем событие
	}

}