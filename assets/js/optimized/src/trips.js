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
	
	// Create DocumentFragment - a document-like object out of DOM where we will be adding trip nodes before appending them to the document
	var tripsFragment = document.createDocumentFragment();
	
	// Create trip item for each trip in JSON and append to previously created DocumentFragment
	tripsList.forEach(function(trip) {
		if (selectedFilters.length === 0 || selectedFilters.indexOf(trip.country.toUpperCase()) != -1) {
			tripsFragment.appendChild(this.createItem(trip));
		}
	}.bind(this));
	if (tripsFragment.childElementCount > 0) {
		// Finally, append the DocumentFragment to the trips container (single DOM operation!)
		this.container.appendChild(tripsFragment);
	} else {
		// or, if no trips are matching selected filters, display "not found" information
		this.container.innerHTML = '<li class="alert">We\'re sorry! No trips are matching selected criteria. Please broaden your filters.</li>';
	}
	
	// Remove the class which is displaying a loader
	this.container.classList.remove('loading');
	
	console.timeEnd('buildTrips');
};

/**
 * Builds a single trip element
 */
TripsList.prototype.createItem = function(trip) {
	// Create and arrange nodes
	var tripItem = document.createElement('li');
	var link = document.createElement('a');
	var imageContainer = document.createElement('div');
	var image = document.createElement('img');
	link.appendChild(imageContainer).appendChild(image);
	var dataContainer = document.createElement('div');
	var title = document.createElement('h2');
	dataContainer.appendChild(title);
	var country = document.createElement('div');
	dataContainer.appendChild(country);
	var date = document.createElement('div');
	dataContainer.appendChild(date);
	link.appendChild(dataContainer);
	var buttonContainer = document.createElement('div');
	var button = document.createElement('span');
	link.appendChild(buttonContainer).appendChild(button);
	tripItem.appendChild(link);
	
	// Set nodes attributes
	// - trip item
	tripItem.setAttribute('data-startdate', trip.startdate);
	tripItem.setAttribute('data-popularity', trip.popularity);
	// - link
	link.setAttribute('href', trip.link);
	// - image
	imageContainer.setAttribute('class', 'image');
	image.setAttribute('data-src', "img/optimized/" + trip.images.small);
	image.setAttribute('class', 'lazyload');
	image.setAttribute('alt', '');
	// - title, country and date
	dataContainer.setAttribute('class', 'data');
	title.innerText = trip.title;
	country.setAttribute('class', 'country');
	country.innerText = trip.country;
	date.setAttribute('class', 'date');
	date.innerText = trip.date;
	// - button
	buttonContainer.setAttribute('class', 'button');
	button.setAttribute('class', 'btn btn-small');
	button.innerText = 'Details';
	
	// Return the node
	return tripItem;
}
