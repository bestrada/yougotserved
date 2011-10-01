var VoteStream = Backbone.View.extend({
	
	events : {
		"click .vote" : "onVote"
	},
	
	onVote : function(event) {
		var streamId = $(event.target).data('streamId');
		if (streamId) {
			YGS.socket.emit('vote', {candidate:streamId});
		}
	}
});

(function() {
	
	$(".votestream").each(function(index, element) {
		new VoteStream({el:element});
	});
	
	$.when(YGS.tbconnect).then(function(session, event) {
		var i;
		var streams = event.streams;
		for (i=0; i < streams.length && i < 2; i++) {
			var stream = streams[i];
			var elem = $("#stream" + (1 + i));
			session.subscribe(stream, elem.find('.stream')[0].id);
			elem.find('.vote').data('streamId', stream.streamId);
			elem.removeClass('hidden');
		}
	});
})();