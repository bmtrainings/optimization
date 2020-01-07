(function($){
	$.fn.Filters = function() {
		var _this = this;
		var container = $(this);

		/**
		 * Creates selected filters box
		 */
		_this.buildSelected = function() {
			console.time('buildSelected');
			
			var selectedFilters = _this.getSelected();
			var selectedFiltersContainer = container.find('.selected-filters')[0];
			var selectedFiltersContainerList = $(selectedFiltersContainer).find('ul')[0];
			$(selectedFiltersContainerList).html('');
			$(selectedFilters).each(function(i, filter) {
				var filterItem = document.createElement('li');
				$(selectedFiltersContainerList).append(filterItem);
				$(filterItem).html(filter.toLowerCase() + '<a href="javascript:;"><span></span><span></span></a>');
				$(filterItem).on('click', _this.selectedFiltersClick);
			});
			if (selectedFilters.length > 0) $(selectedFiltersContainer).show(); else $(selectedFiltersContainer).hide();
			//selectedFiltersContainer.style.display = (selectedFilters.length > 0) ? 'block' : 'none';
			
			console.timeEnd('buildSelected');
		}

		/**
		 * Returns array of selected filters
		 */
		_this.getSelected = function() {
			var selectedFilters = [];
			var checked = container.find('input[type=checkbox]:checked');
			$(checked).each(function(i, checkbox) {
				selectedFilters.push(checkbox.value.toUpperCase());
			});
			return selectedFilters;
		}

		/**
		 * Event handler for click on selected filter
		 */
		_this.selectedFiltersClick = function(e) {
			// Remove selected filter if clicked on a link inside (X icon)
			if (e.target.tagName !== 'A' && e.target.parentNode.tagName !== 'A') return;
			var clickedFilter = e.target.tagName === 'A' ? e.target.parentNode : e.target.parentNode.parentNode;
			container.find('form input[value="' + clickedFilter.innerText.trim() + '"]')[0].checked = false;
			clickedFilter.remove();
			// If no filters are selected, hide the container
			var selectedFilters = _this.getSelected();
			if (selectedFilters.length === 0) {
				$(container.find('.selected-filters')[0]).hide();
			}
			trips.loadTrips();
		}

		/**
		 * Event handler for click on filters apply button
		 */
		_this.applyClick = function(e) {
			e.preventDefault();
			_this.buildSelected();
			trips.loadTrips();
			$('html, body').animate({ scrollTop: $('main').offset().top }, 400);
		}

		/**
		 * Event handler for click on clear filters link
		 */
		_this.clearClick = function(e) {
			e.preventDefault();
			var checked = container.find('input[type="checkbox"]:checked');
			$(checked).each(function(i, checkbox) {
				checkbox.checked = false;
			});
			_this.buildSelected();
			trips.loadTrips();
			$('html, body').animate({ scrollTop: $('main').offset().top }, 400);
		}

		/**
		 * Make filters apply button stick to the viewport's bottom when scrolling
		 */
		_this.stickyApply = function() {
			var filtersForm = container.find('form')[0];
			var applyContainer = $(filtersForm).find('.apply')[0];
			var formPositionTop = $(filtersForm).offset().top;
			var formHeight = filtersForm.scrollHeight;
			var scrollPosition = $(window).scrollTop();
			var viewportHeight = $(window).height();
			var applyHeight = applyContainer.scrollHeight;
			var offset = 100;
			if (
				// user scrolled past form's top edge + offset:
				(scrollPosition + viewportHeight > formPositionTop + applyHeight + offset)
				&&
				// user didn't scroll past form's bottom edge:
				(scrollPosition + viewportHeight < formPositionTop + formHeight)
			) {
				$(applyContainer).addClass('sticky');
			} else {
				$(applyContainer).removeClass('sticky');
			}
		}

		/**
		 * Update filters form height when resizing window
		 */
		_this.updateFiltersHeight = function() {
			var filtersForm = container.find('form')[0];
			var viewportWidth = $(window).width();
			var desktop = 1024;
			var tablet = 768;
			
			// Desktop to tablet
			if (viewportWidth < desktop && prevViewportWidth >= desktop) {
				$(filtersForm).css('height', 0);
				$(filtersForm).removeClass('expanded');
				$(container.find('.toggle .btn')[0]).text('Show filters');
			
			// Tablet to mobile
			} else if (viewportWidth < tablet && prevViewportWidth >= tablet) {
				if (parseInt($(filtersForm).css('height')) > 0) {
					$(filtersForm).css('height', 0);
					setTimeout(function() {
						$(filtersForm).css('height', filtersForm.scrollHeight + 'px');
					}, 250);
				}
			
			// Mobile to tablet
			} else if (viewportWidth >= tablet && prevViewportWidth < tablet) {
				if (parseInt($(filtersForm).css('height')) > 0) {
					$(filtersForm).css('height', '');
					setTimeout(function() {
						$(filtersForm).css('height', filtersForm.scrollHeight + 'px');
					}, 250);
				}
			
			// Tablet to desktop
			} else if (viewportWidth >= desktop && prevViewportWidth < desktop) {
				$(filtersForm).css('height', '');
			}
			
			// Save current viewport width for future use as a reference
			prevViewportWidth = viewportWidth;
		}

		/**
		 * Toggles filters (mobile view)
		 */
		_this.toggle = function() {
			var filtersForm = container.find('form')[0];
			var filtersToggleButton = container.find('.toggle .btn')[0];
			if ($(filtersForm).hasClass('expanded')) {
				$(filtersForm).css('height', 0);
				$(filtersForm).removeClass('expanded');
				$(filtersToggleButton).text('Show filters');
			} else {
				$(filtersForm).css('height', filtersForm.scrollHeight + 'px');
				$(filtersForm).addClass('expanded');
				$(filtersToggleButton).text('Hide filters');
			}
		}

		/**
		 * Event listeners
		 */
		container.on('click', _this.sortTripsClick);
		
		// Add event listener for click on filters apply button
		var filtersApplyButton = container.find('.apply .btn')[0];
		$(filtersApplyButton).on('click', _this.applyClick);
		
		// Add event listener for click on clear filters link
		var filtersClearLink = container.find('.apply .clear')[0];
		$(filtersClearLink).on('click', _this.clearClick);
		
		// Add event listener for click on filters toggle button (mobile view)
		var filtersToggleButton = container.find('.toggle .btn')[0];
		$(filtersToggleButton).on('click', _this.toggle);

		return this;
	};
}(jQuery));