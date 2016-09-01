function Loader(options) {
	this.elements = [];
	this.animation = null;
	this.$panelContainer = null;
	
	this.options = {
		maxWidth: 100,
		minWidth: 20,
		panels: 4
	};
	
	/**
	 * Function to kick off the loader
	 */
	this.open = function() {
		// create local references to options (so we can reuse)
		this._minWidth = this.options.minWidth;
		
		for(var i = this.options.panels; i > 0; i--) {
			var panel = this._createPanel(i);
		}
		this._createContainer();
		this._slide(this.$panelContainer, 4);
		this._events();
	};
	
	/**
	 * Function to bind resizing of browser to loader, 
	 * and allow the divs to recalculate heights.
	 */
	this._events = function() {
		var self = this;
		$(window).on('resize', function(e) {
			var windowHeight = $('html').height();
			self.$panelContainer.height(windowHeight);
		});
	};
	
	/**
	 * Function to create the container element and attach all 
	 * panels.
	 */
	this._createContainer = function() {
		if(!this.$panelContainer) {
			this.$panelContainer = $('<div>').addClass('splash-screen-container');
			$('body').append(this.$panelContainer);
			var windowHeight = $('html').height();
			this.$panelContainer.width('100%').height(windowHeight);
			this.$panelContainer.append(this.elements);
		}
	};
	
	/**
	 * Function to create a panel.
	 * @param  {Number} zIndex The zIndex of the panel
	 * @return {Element} $ The jQuery Element
	 */
	this._createPanel = function(zIndex) {
		var classes = 'splash-screen';
		var width = this._getNextPanelWidth();
		var css = {'background': randomColor({luminosity: 'dark'}), 'zIndex': zIndex};
		var panel = $('<div>').addClass(classes).height('100%').width(width + '%').css(css);
		this.elements.push(panel[0]);
		return panel;
	};
	
	/**
	 * Function to calculate the next panels width
	 * @return {Number} width Width of the panel
	 */
	this._getNextPanelWidth = function() {
			var width = Math.random() * (this.options.maxWidth - this._minWidth) + this._minWidth;
			this._minWidth = width;
			return width;
	};
	
	/**
	 * Function to kick off the slide effect on the container element.
	 * @param  {Element} el jQuery element to animate
	 * @param  {Number} duration Length of duration
	 * @param  {Distance} distance Disance to slide the element
	 */
	this._slide = function(el, duration, distance) {
		var self = this;
		if(!distance) distance = this._getDistanceToRight(el);
		this.animation = TweenMax.fromTo(el, duration, {x: el.width() * -1}, {x: distance, ease: SlowMo.ease, onComplete: function() {
			self._slide(el, duration, distance);
		}});
	};
	
	/**
	 * Gets the distance till the element is off the screen on right side.
	 * @param  {Element} el Element in question
	 * @return {Number} distance distance it has to go
	 */
	this._getDistanceToRight = function(el) {
		var distance = ($(window).width() - (el.offset().left + el.width())) + el.width();
		return distance;
	};
	
	/**
	 * Cleanup method which turns off and destroys the loader module
	 */
	this.close = function() {
		if(this.animation) { 
			this.animation.kill();
			this.$panelContainer.remove();
			this.$panelContainer = null;
			this.elements = [];
			$(window).off('resize');
		}
	};
}