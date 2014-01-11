
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var neo4j = require('node-neo4j');
var Hashtag = require('./hashtag.js');

var app = express();



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

//Create Hashtag

app.post('/hashtag/:name', function(req, res) {
	var hashtag = new Hashtag;
	hashtag.find_or_create(req.params.name);
	res.send('Tracking Hashtag #' + req.params.name);
});

//Map Hashtag

app.get('/hashtag/:name', function(req, res) {
	var hashtag = new Hashtag;
	var name = req.params.name;
	hashtag.find_or_create(name).then(function(found) {
		if (found) { 
			hashtag.map(name).then(function(map) {
				res.end(JSON.stringify(map));
			});

		} else {
			res.end('Hashtag #' + name + ' not found.');
		};
	});

});

//Get authors and tweets for a given hashtag

app.get('/hashtag/:name/tweets', function(req, res) {
	var hashtag = new Hashtag;
	var name = req.params.name;
	hashtag.list(name).then(function(result) {
		res.end(JSON.stringify(result));
	});
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
