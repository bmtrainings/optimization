function Slider(node, pausetime) {
	if (!node) return;
	// Set properties
	this.sliderContainer = node;
	this.slider = this.sliderContainer.querySelector('.slides');
	this.slideCount = this.slider.children.length;
	this.currentSlide = 1;
	this.pausetime = pausetime || 5000;
	this.running;
	this.mouseover;
	this.slider.style.width = ((this.slideCount + 1) * 100) + 'vw';

	// Create navigation
	this.createNav();
	this.sliderNav = this.sliderContainer.querySelector('.nav');

	// Clone first element to allow seamless looping
	var firstClone = this.slider.children[0].cloneNode(true);
	this.slider.appendChild(firstClone);

	// Handle events:
	// - pause on mouseover
	this.sliderContainer.addEventListener('mouseenter', function() {
		this.mouseover = true;
		this.pause();
	}.bind(this));
	this.sliderContainer.addEventListener('mouseleave', function() {
		this.mouseover = false;
		this.run();
	}.bind(this));
	// - navigation
	this.sliderNav.addEventListener('click', function(e) {
		this.gotoSlide(parseInt(e.target.closest('li').innerText));
	}.bind(this));
	// - touch events
	this.sliderTouch = new Hammer(this.slider);
	this.sliderTouch.on('swipeleft', function(e) {
		if (this.currentSlide < this.slideCount) {
			this.gotoSlide(this.currentSlide + 1);
		}
	}.bind(this));
	this.sliderTouch.on('swiperight', function(e) {
		if (this.currentSlide > 1) {
			this.gotoSlide(this.currentSlide - 1);
		}
	}.bind(this));
	
	// Start slider
	this.run();
}

/**
 * Creates navigation
 */
Slider.prototype.createNav = function() {
	var navContainer = document.createElement('ul');
	navContainer.classList.add('nav');
	Array.prototype.forEach.call(this.slider.children, function(slide, i) {
		var navItem = document.createElement('li');
		var navLink = document.createElement('a');
		navLink.setAttribute('href', 'javascript:;');
		navLink.innerText = i + 1;
		if (i === 0) navItem.classList.add('active');
		navItem.appendChild(navLink);
		navContainer.appendChild(navItem);
	});
	this.sliderContainer.appendChild(navContainer);
};

/**
 * Starts slider
 */
Slider.prototype.run = function() {
	this.running = setInterval(function() {
		this.gotoSlide(this.currentSlide + 1);
	}.bind(this), this.pausetime);
};

/**
 * Pauses slider
 */
Slider.prototype.pause = function() {
	clearInterval(this.running);
};

/**
 * Goes to the slide number n
 */
Slider.prototype.gotoSlide = function(n) {
	// Move to the next slide
	this.slider.style.marginLeft = (-n * 100 + 100) + 'vw';
	
	// Set active nav element
	var activeNav = this.sliderNav.querySelector('li.active');
	if (activeNav) activeNav.classList.remove('active');
	var currentNav = this.sliderNav.querySelector('li:nth-child(' + n + ')');
	if (!currentNav) currentNav = this.sliderNav.querySelector('li:first-child');
	currentNav.classList.add('active');
	
	// Loop when reached cloned first slide
	if (n > this.slideCount) {
		clearInterval(this.running);
		setTimeout(function() {
			this.currentSlide = 1;
			this.slider.classList.add('notrans');
			this.slider.style.marginLeft = '0vw';
			if (!this.mouseover) this.run();
			setTimeout(function() {
				this.slider.classList.remove('notrans');
			}.bind(this), 100);
		}.bind(this), 500);
	} else {
		this.currentSlide = n;
	}
};
