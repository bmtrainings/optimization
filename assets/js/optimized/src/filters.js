function Filters(container) {
	if (!container) return;
	this.container = container;
	this.container.addEventListener('click', this.sortTripsClick);
	
	this.form = this.container.querySelector('form');
	
	// Add event listener for click on filters apply button
	var filtersApplyButton = this.container.querySelector('.apply .btn');
	filtersApplyButton.addEventListener('click', this.applyClick.bind(this));
	
	// Add event listener for click on clear filters link
	var filtersClearLink = this.container.querySelector('.apply .clear');
	filtersClearLink.addEventListener('click', this.clearClick.bind(this));
	
	// Add event listener for click on selected filters
	var selectedFilters = this.container.querySelector('.selected-filters ul');
	selectedFilters.addEventListener('click', this.selectedFiltersClick.bind(this));
	
	// Add event listener for click on filters toggle button (mobile view)
	var filtersToggleButton = this.container.querySelector('.toggle .btn');
	filtersToggleButton.addEventListener('click', this.toggle.bind(this));
}

/**
 * Creates selected filters box
 */
Filters.prototype.buildSelected = function() {
	console.time('buildSelected');
	
	var _this = this;
	var selectedFilters = this.getSelected();
	var selectedFiltersContainer = this.container.querySelector('.selected-filters');
	var selectedFiltersContainerList = selectedFiltersContainer.querySelector('ul');
	var selectedFiltersFragment = document.createDocumentFragment();
	selectedFilters.forEach(function(filter) {
		selectedFiltersFragment.appendChild(_this.createSelectedItem(filter));
	});
	selectedFiltersContainerList.innerText = '';
	selectedFiltersContainerList.appendChild(selectedFiltersFragment);
	selectedFiltersContainer.style.display = (selectedFilters.length > 0) ? 'block' : 'none';
	
	console.timeEnd('buildSelected');
}

/**
 * Builds a single selected filter element
 */
Filters.prototype.createSelectedItem = function(filter) {
	var filterItem = document.createElement('li');
	filterItem.innerText = filter.toLowerCase();
	var link = document.createElement('a');
	link.setAttribute('href', 'javascript:;');
	var line1 = document.createElement('span');
	var line2 = document.createElement('span');
	link.appendChild(line1);
	link.appendChild(line2);
	filterItem.appendChild(link);
	// Return the node
	return filterItem;
}

/**
 * Returns array of selected filters
 */
Filters.prototype.getSelected = function() {
	var selectedFilters = [];
	var checked = this.container.querySelectorAll('input[type=checkbox]:checked');
	Array.prototype.forEach.call(checked, function(checkbox) {
		selectedFilters.push(checkbox.value.toUpperCase());
	});
	return selectedFilters;
}

/**
 * Event handler for click on selected filter
 */
Filters.prototype.selectedFiltersClick = function(e) {
	// Remove selected filter if clicked on a link inside (X icon)
	if (e.target.tagName !== 'A' && e.target.parentNode.tagName !== 'A') return;
	var clickedFilter = e.target.tagName === 'A' ? e.target.parentNode : e.target.parentNode.parentNode;
	this.form.querySelector('input[value="' + clickedFilter.innerText.trim() + '"]').checked = false;
	clickedFilter.remove();
	// If no filters are selected, hide the container
	var selectedFilters = this.getSelected();
	if (selectedFilters.length === 0) {
		this.container.querySelector('.selected-filters').style.display = 'none';
	}
	trips.load();
}

/**
 * Event handler for click on filters apply button
 */
Filters.prototype.applyClick = function(e) {
	e.preventDefault();
	this.buildSelected();
	trips.load();
	scrollToElement(document.querySelector('main'), 400);
}

/**
 * Event handler for click on clear filters link
 */
Filters.prototype.clearClick = function(e) {
	e.preventDefault();
	var checked = this.container.querySelectorAll('input[type="checkbox"]:checked');
	Array.prototype.forEach.call(checked, function(checkbox) {
		checkbox.checked = false;
	});
	this.buildSelected();
	trips.load();
	scrollToElement(document.querySelector('main'), 400);
}

/**
 * Make filters apply button stick to the viewport's bottom when scrolling
 */
Filters.prototype.stickyApply = function() {
	var applyContainer = this.form.querySelector('.apply');
	var formPositionTop = this.form.offsetTop;
	var formHeight = this.form.scrollHeight;
	var scrollPosition = window.pageYOffset;
	var viewportHeight = getViewportHeight();
	var applyHeight = applyContainer.scrollHeight;
	var offset = 100;
	if (
		// user scrolled past form's top edge + offset:
		(scrollPosition + viewportHeight > formPositionTop + applyHeight + offset)
		&&
		// user didn't scroll past form's bottom edge:
		(scrollPosition + viewportHeight < formPositionTop + formHeight)
	) {
		applyContainer.classList.add('sticky');
	} else {
		applyContainer.classList.remove('sticky');
	}
}

/**
 * Update filters form height when resizing window
 */
Filters.prototype.updateFiltersHeight = function() {
	var viewportWidth = getViewportWidth();
	var desktop = 1024;
	var tablet = 768;
	
	// Desktop to tablet
	if (viewportWidth < desktop && prevViewportWidth >= desktop) {
		this.form.style.height = 0;
		this.form.classList.remove('expanded');
		this.container.querySelector('.toggle .btn').innerText = 'Show filters';
	
	// Tablet to mobile
	} else if (viewportWidth < tablet && prevViewportWidth >= tablet) {
		if (parseInt(this.form.style.height) > 0) {
			this.form.style.height = '';
			setTimeout(function() {
				this.form.style.height = this.form.scrollHeight + 'px';
			}.bind(this), 250);
		}
	
	// Mobile to tablet
	} else if (viewportWidth >= tablet && prevViewportWidth < tablet) {
		if (parseInt(this.form.style.height) > 0) {
			this.form.style.height = '';
			setTimeout(function() {
				this.form.style.height = this.form.scrollHeight + 'px';
			}.bind(this), 250);
		}
	
	// Tablet to desktop
	} else if (viewportWidth >= desktop && prevViewportWidth < desktop) {
		this.form.style.height = '';
	}
	
	// Save current viewport width for future use as a reference
	prevViewportWidth = viewportWidth;
}

/**
 * Toggles filters (mobile view)
 */
Filters.prototype.toggle = function() {
	var filtersToggleButton = this.container.querySelector('.toggle .btn');
	if (this.form.classList.contains('expanded')) {
		this.form.style.height = '0';
		this.form.classList.remove('expanded');
		filtersToggleButton.innerText = 'Show filters';
	} else {
		this.form.style.height = this.form.scrollHeight + 'px';
		this.form.classList.add('expanded');
		filtersToggleButton.innerText = 'Hide filters';
	}
}
