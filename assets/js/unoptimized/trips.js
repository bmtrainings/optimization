function TripsList(container) {
	if (!container) return;
	this.container = container;
	this.jsonData;
}

/**
 * Loads trips from JSON file
 */
TripsList.prototype.load = function() {
	var jsonUrl = this.container.getAttribute('data-json-src');
	this.loadJSON(jsonUrl);
};

/**
 * Helper for loading JSON file
 */
TripsList.prototype.loadJSON = function(url) {
	var _this = this;
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.onload = function() {
		if (this.status >= 200 && this.status < 400) {
			try {
				_this.jsonData = JSON.parse(this.response);
				_this.build.apply(_this);
			} catch(e) {
				_this.jsonData = 'Failed to load JSON file: syntax error';
				_this.build.apply(_this);
			}
		} else {
			_this.jsonData = 'Failed to load JSON file: server error';
			_this.build.apply(_this);
		}
	};
	request.onerror = function() {
		_this.jsonData = 'Failed to load JSON file: request failed';
		_this.build.apply(_this);
	};
	request.send();
}

/**
 * Handles trips from JSON file and builds the trips list, or displays error on failure
 */
TripsList.prototype.build = function() {
	console.time('buildTrips');
	
	var sort = sortingOptions.getSelected();
	var selectedFilters = filters.getSelected();
	
	// Find trips container and prepare it
	this.container.innerHTML = '';
	this.container.classList.add('loading');
	
	// If the json is a string, it's an error, so display it and quit
	if (typeof this.jsonData === 'string') {
		this.container.classList.remove('loading');
		this.container.innerHTML = '<li class="alert">' + this.jsonData + '</li>';
		return;
	}
	
	// Sort array
	var tripsList = this.jsonData.trips;
	tripsList.sort(function(a, b) {
		switch (sort) {
			case 'startdate':
				return a[sort] - b[sort]; break;
			default:
				return -(a[sort] - b[sort]); break;
		}
	});
	
	// Insert trip item for each trip in JSON to the container
	tripsList.forEach(function(trip) {
		if (selectedFilters.length === 0 || selectedFilters.indexOf(trip.country.toUpperCase()) != -1) {
			// 1) InnerHTML:
			this.container.innerHTML += '<li data-startdate="' + trip.startdate + '" data-popularity="' + trip.popularity + '"><a href="' + trip.link +'"><div class="image"><img src="img/unoptimized/' + trip.images.medium + '" alt=""></div><div class="data"><h2>' + trip.title + '</h2><div class="country">' + trip.country + '</div><div class="date">' + trip.date + '</div></div><div class="button"><span class="btn btn-small">Details</span></div></a></li>';
		}
	}.bind(this));
	if (this.container.innerHTML === '') {
		// or, if no trips are matching selected filters (container is still empty), display "not found" information
		this.container.innerHTML = '<li class="alert">We\'re sorry! No trips are matching selected criteria. Please broaden your filters.</li>';
	}
	
	// Remove the class which is displaying a loader
	this.container.classList.remove('loading');
	
	console.timeEnd('buildTrips');
};

