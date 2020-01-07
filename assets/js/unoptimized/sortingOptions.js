function SortingOptions(container) {
	if (!container) return;
	this.container = container;
	
	var sortOptions = this.container.querySelectorAll('a[data-sort]');
	Array.prototype.forEach.call(sortOptions, function(sortOption) {
		sortOption.addEventListener('click', this.sortTripsClick.bind(sortOption));
	}.bind(this));
}

/**
 * Returns selected sort option
 */
SortingOptions.prototype.getSelected = function() {
	return this.container.querySelector('.active').getAttribute('data-sort');
}

/**
 * Event handler for click on sort options
 */
SortingOptions.prototype.sortTripsClick = function(e) {
	Array.prototype.forEach.call(this.parentNode.children, function(node) {
		node.classList.remove('active');
	});
	this.classList.add('active');
	trips.load();
}
