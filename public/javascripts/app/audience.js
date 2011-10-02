var VoteStream = Backbone.View.extend({
	
	events : {
		"click .vote" : "onVote"
	},
	
	onVote : function(event) {
		var target = $(event.target);
		if (target && target.length) {
			YGS.socket.emit('vote', {
				side : target.data('party'),
				streamId : target.data('streamId')
			});
		}
	}
});

var ResultsBox = Backbone.View.extend({
	initialize : function(event) {
		YGS.socket.on('results', $.proxy(this.onResults, this));
	},
	
	onResults : function(ballot) {
		// ballot is a map of all the candidates
		var total = ballot.red + ballot.blue;
		var blueScore = 100 * ballot.blue / total;
		var redScore = 100 * ballot.red / total;
		
		$("#scoreBlue").html(blueScore.toFixed(0));
		$("#scoreRed").html(redScore.toFixed(0));
		$("#count").html(ballot.blue + ballot.red);
	}
});

(function() {
	
	$(".votestream").each(function(index, element) {
		new VoteStream({el:element});
	});
	
	new ResultsBox($("#results"));
	
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