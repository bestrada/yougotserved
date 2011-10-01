/**
 * Module dependencies.
 */
var express = require('express');
var opentok = require('opentok');

var app = module.exports = express.createServer();

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
var ot = new opentok.OpenTokSDK('5318111','0318fa04074ce9c76bbb13b8d1e367a386be7d2a');
var globalSession = false;

ot.createSession('bestrada.dyndns.org', {}, function(session) {
	globalSession = session;
});

// Routes
app.get('/',
function(req, res) {
    res.render('index', {
        title: 'You Got Served',
		key:'5318111'
    });
});

app.get('/dancer', 
function(req, res) {
	var ottoken = ot.generateToken({sessionId:globalSession.sessionId});
	res.render('dancer', {
		key:'5318111',
		token:ottoken,
		sessionId:globalSession.sessionId
	});
});

app.get('/audience', 
function(req, res) {
	
});


app.listen(8080);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
