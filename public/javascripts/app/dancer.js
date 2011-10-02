var Feedback = Backbone.View.extend({
	initialize : function(options) {
		YGS.socket.on('results', $.proxy(this.onResults, this));
	},
	onResults : function(ballot) {
		/* no-op */
	}
});

(function() {
	var publisher;
	$.when(YGS.tbconnect).then(function(session, event) {
		publisher = session.publish('loading');
		var myStreamId = session.connection.connectionId;
		/*
		new Feedback({
			el : $("#score")[0],
			streamId : myStreamId
		}); */
	});
})();
