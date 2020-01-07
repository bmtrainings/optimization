function SortingOptions(container) {
	if (!container) return;
	this.container = container;
	this.container.addEventListener('click', this.sortTripsClick);
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
	if (e.target.tagName !== 'A' && e.target.parentNode.tagName !== 'A') return;
	var clickedOption = e.target.tagName === 'A' ? e.target : e.target.parentNode;
	Array.prototype.forEach.call(clickedOption.parentNode.children, function(node) {
		node.classList.remove('active');
	});
	clickedOption.classList.add('active');
	trips.load();
}
