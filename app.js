
/**
 * Module dependencies.
 */

var config = require('./config.js');
config.setup();

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var neo4j = require('node-neo4j');
var Hashtag = require('./hashtag.js');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('./users.js');


var twitter = require('./twitter.js');


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
app.use(express.cookieParser(''));
app.use(express.bodyParser());
app.use(express.session({ secret: '07b897228c0d2b0ee7c7d63cf2080d4c' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "http://localhost:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function () {
      
      return done(null, profile);
    });
  }
));

app.get('/', routes.index);


app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){
    // The request will be redirected to Twitter for authentication, so this
    // function will not be called.
  });


app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
  	var tokens = req.query;
    var name = req.user.username;
    var info = req.user;
    User.find_or_create(name, tokens, info);
    res.cookie('user_info', name);
  	twitter.initialize(tokens);
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//Create Hashtag

app.post('/tags/:name', function(req, res) {
	var hashtag = new Hashtag;
	hashtag.find_or_create(req.params.name);
});

app.get('/tags', function(req, res) {
  var hashtag = new Hashtag;
  hashtag.index().then(function (list) {
    res.end(JSON.stringify(list));
  });
});

//Track all twitter hashtags

app.get('/trackall', function(req, res) {
  var hashtag = new Hashtag;
  hashtag.trackall().then(function (list) {
    res.end(JSON.stringify(list));
  });
});

//Map Hashtag

app.get('/tags/:name', function(req, res) {
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