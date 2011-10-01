(function($) {
	ygs = {};
	ygs.tbconnect = $.Deferred();
	ygs.socket = io.connect(window.location.origin);
	// add YGS to the global scope
	window.YGS = ygs;
})(jQuery);