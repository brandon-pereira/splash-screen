$(function() {
	// Initialize the loader
	var loader = new Loader();
	var min = 2000;
	var max = 10000;
	var duration = Math.floor(Math.random()*(max-min+1)+min);
	setTimeout(function() {
		// After timer destroy loader and do all the things
		loader.destroy();
		$('body').addClass('loaded');
		$('h1').text('Loaded!');
	}, duration);
});