(function($){
	$.fn.TripsList = function() {
		var _this = this;
		var container = $(this);
		var jsonData;

		/**
		 * Loads trips from JSON file
		 */
		_this.loadTrips = function() {
			var jsonUrl = container.attr('data-json-src');
			_this.loadJSON(jsonUrl);
		};

		/**
		 * Helper for loading JSON file
		 */
		_this.loadJSON = function(url) {
			var request = $.getJSON(url, function(data) {
				try {
					jsonData = data;
					_this.build();
				} catch(e) {
					jsonData = 'Failed to load JSON file: syntax error';
					_this.build();
				}
			}).fail(function() {
				jsonData = 'Failed to load JSON file: request failed';
				_this.build();
			});
		}

		/**
		 * Handles trips from JSON file and builds the trips list, or displays error on failure
		 */
		_this.build = function() {
			console.time('buildTrips');

			var sort = sortingOptions.getSelected();
			var selectedFilters = filters.getSelected();

			// Find trips container and prepare it
			container.html('');
			container.addClass('loading');

			// If the json is a string, it's an error, so display it and quit
			if (typeof this.jsonData === 'string') {
				removeClass('loading');
				html('<li class="alert">' + this.jsonData + '</li>');
				return;
			}

			// Sort array
			var tripsList = jsonData.trips;
			tripsList.sort(function(a, b) {
				switch (sort) {
					case 'startdate':
						return a[sort] - b[sort]; break;
					default:
						return -(a[sort] - b[sort]); break;
				}
			});

			// Insert trip item for each trip in JSON to the container
			$(tripsList).each(function(i, trip) {
				if (selectedFilters.length === 0 || selectedFilters.indexOf(trip.country.toUpperCase()) != -1) {
					// 1) InnerHTML:
					container.append('<li data-startdate="' + trip.startdate + '" data-popularity="' + trip.popularity + '"><a href="' + trip.link +'"><div class="image"><img src="img/unoptimized/' + trip.images.medium + '" alt=""></div><div class="data"><h2>' + trip.title + '</h2><div class="country">' + trip.country + '</div><div class="date">' + trip.date + '</div></div><div class="button"><span class="btn btn-small">Details</span></div></a></li>');
				}
			});
			if (container.html() === '') {
				// or, if no trips are matching selected filters (container is still empty), display "not found" information
				this.container.html('<li class="alert">We\'re sorry! No trips are matching selected criteria. Please broaden your filters.</li>');
			}

			// Remove the class which is displaying a loader
			container.removeClass('loading');

			console.timeEnd('buildTrips');
		}

		return this;
	};
}(jQuery));
