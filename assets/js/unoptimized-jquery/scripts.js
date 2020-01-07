var prevViewportWidth,
		slider,
		filters,
		sortingOptions,
		trips;

/**
 * Fire the start() method when document is ready
 */
$(function() {
	start();
});

/**
 * On document load
 */
function start() {
	var sliderNode = $('.slider .slides');
	var sortingNode = $('main .sort');
	var filtersNode = $('main .filters');
	var tripsNode = $('main .trips');
	
	slider = sliderNode.bxSlider({
		auto: true,
		autoHover: true,
		pause: 4000,
		controls: false,
	});
	sortingOptions = sortingNode.SortingOptions();
	filters = filtersNode.Filters();
	trips = tripsNode.TripsList();
	
	trips.loadTrips();
	filters.buildSelected();
	
	// Add event listener for scroll
	$(window).on('scroll', handleScroll);
	
	// Add event listener for resize
	$(window).on('resize', handleResize);
	
	prevViewportWidth = $(window).width();
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
	console.log('viewport width: ' + $(window).width());
	filters.updateFiltersHeight();
}
