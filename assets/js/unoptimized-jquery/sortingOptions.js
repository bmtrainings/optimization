(function($){
	$.fn.SortingOptions = function() {
		var _this = this;
		var container = $(this);

		/**
		 * Returns selected sort option
		 */
		_this.getSelected = function() {
			return $(container.find('.active')[0]).attr('data-sort');
		}

		/**
		 * Event handler for click on sort options
		 */
		_this.sortTripsClick = function(e) {
			$(this).parent().children().each(function(i, node) {
				$(node).removeClass('active');
			});
			$(this).addClass('active');
			trips.loadTrips();
		}

		/**
		 * Event listeners
		 */
		var sortOptions = container.find('a[data-sort]');
		sortOptions.each(function(i, sortOption) {
			$(sortOption).on('click', _this.sortTripsClick);
		});

		return this;
	};
}(jQuery));