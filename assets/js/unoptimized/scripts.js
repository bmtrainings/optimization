var prevViewportWidth,
		slider,
		filters,
		sortingOptions,
		trips;

/**
 * Fire the start() method when document is ready
 */
if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
	start();
} else {
	document.addEventListener('DOMContentLoaded', start);
}

/**
 * On document load
 */
function start() {
	var sliderNode = document.querySelector('.slider');
	var sortingNode = document.querySelector('main .sort');
	var filtersNode = document.querySelector('main .filters');
	var tripsNode = document.querySelector('main .trips');
	
	slider = new Slider(sliderNode, 4000);
	sortingOptions = new SortingOptions(sortingNode);
	filters = new Filters(filtersNode);
	trips = new TripsList(tripsNode);
	
	trips.load();
	filters.buildSelected();
	
	// Add event listener for scroll
	window.addEventListener('scroll', handleScroll);
	
	// Add event listener for resize
	window.addEventListener('resize', handleResize);
	
	prevViewportWidth = getViewportWidth();
}

/**
 * Event handler for scroll event
 */
function handleScroll() {
	console.log('scroll position: ' + window.pageYOffset);
	filters.stickyApply();
}

/**
 * Event handler for resize event
 */
function handleResize() {
	console.log('viewport width: ' + getViewportWidth());
	filters.updateFiltersHeight();
}

/**
 * Helper for animated scroll to element
 */
function scrollToElement(element, duration) {
	var scrollPos = window.pageYOffset;
	var scrollDiff = element.offsetTop - scrollPos;
	var start;
	window.requestAnimationFrame(function step(timestamp) {
		if (!start) start = timestamp;
		var time = timestamp - start;
		var percent = Math.min(time / duration, 1);
		window.scrollTo(0, scrollPos + scrollDiff * percent);
		if (time < duration) window.requestAnimationFrame(step);
	});
}

/**
 * Returns viewport width
 */
function getViewportWidth() {
	return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}

/**
 * Returns viewport height
 */
function getViewportHeight() {
	return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}
