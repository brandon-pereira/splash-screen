$(function() {
	// Initialize the loader
	var loader = new Loader();
	
	var randomNumber = function(min, max) {
		return Math.floor(Math.random()*(max-min+1)+min);
	};
	
	var open = function() {
		loader.open();	
		$('body').removeClass('loaded');
		$('h1').text('Loading...');
	};
	
	var close = function() {
		loader.close();
		$('body').addClass('loaded');
		$('h1').text('Loaded!');
	};
	
	$('body').on('click', function() {
		if($('body').hasClass('loaded')) {
			open();
		} else {
			close();
		}
	});
	
	open();
});