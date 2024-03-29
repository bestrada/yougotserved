/**
 * Module dependencies.
 */
var express = require('express');
var opentok = require('opentok');


var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

// Configuration
app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development',
function() {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production',
function() {
    app.use(express.errorHandler());
});

// create opentok session
var otkey = '5318111';
var ot = new opentok.OpenTokSDK(otkey,'0318fa04074ce9c76bbb13b8d1e367a386be7d2a');
var globalSession = false;

ot.createSession('bestrada.dyndns.org', {}, function(session) {
	globalSession = session;
});

// Routes
app.get('/',
function(req, res) {
    res.render('index', {
        title: 'You Got Served',
		key:otkey,
		token:false
    });
});

app.get('/dancer', 
function(req, res) {
	var pubtoken = ot.generateToken({sessionId:globalSession.sessionId});
	res.render('dancer', {
		key:otkey,
		token:pubtoken,
		sessionId:globalSession.sessionId
	});
});

app.get('/audience', 
function(req, res) {
	var subtoken = ot.generateToken({sessionId:globalSession.sessionId, role:"subscriber" });
	res.render('audience', {
		key:otkey,
		token:subtoken,
		sessionId:globalSession.sessionId
	});
});

var ballot = {
	"red":0,
	"blue":0,
	"streams" : {
		"foo":"bar"
	}
};
io.sockets.on('connection', function(socket) {
	socket.on('vote', function(data) {
		//increment the vote count for that side
		ballot[data.side] = 1 + ballot[data.side];
		ballot.streams[data.streamId] = ballot[data.side];
		// emit results to connected clients
		io.sockets.emit('results', ballot);
	});
});

app.listen(80);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
