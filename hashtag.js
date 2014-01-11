//Functionality for tracking an individual hashtag
var neo4j = require('node-neo4j');
var db = new neo4j('http://localhost:7474');
var async = require('async');
var Deferred = require("promised-io/promise").Deferred;
var twitter = require('./twitter.js');

var Hashtag = function () {
};

Hashtag.prototype.find_or_create = function(name) {

//	this.name = (name.slice(0,1) == '#') ? name.slice(0,-1) : name;
	this.tag = '#' + name;
	this.name = name;
	var deferred = new Deferred

	var neo4jquery = 'CREATE UNIQUE (h:Hashtag {name:"' + name + '", track: true});'
	db.cypherQuery(neo4jquery, function(err, result) {
		if (err) {console.log(err)};
		console.log('Creating hashtag #' + name);
		deferred.resolve(true);
	})

	this.velocity = function(hash) {
		//Make neo4J query
		var neo4jquery = 'MATCH (h:Hashtag)-[:INCLUDES]->(t:Tweet) WHERE h.name = "' + hash + '" RETURN t.created_at ORDER BY t.created_at DESC LIMIT 20';
		//Make a promise for when it's resolved;
		var deferred = new Deferred;


		var average = function (array) {
			var sum = 0;
			if (array.length === 1) {
				sum = 259200000;
			} else {
				sum = array[(array.length - 1)] - array[0];
			};
			return (array.length/sum * 60000);
		};

		db.cypherQuery(neo4jquery, function(err, result){
	      if(err) console.log(err);
		  var array = result.data.map(function(n){return (new Date(n).getTime())}).sort();
		  deferred.resolve(average(array));
	  	});
	  	return deferred.promise;
	};

	return deferred.promise;
};

Hashtag.prototype.track = function() {
	var stream = twitter.stream('statuses/filter', { track: ['#' + name], language: 'en' })
	console.log('Tracking hashtag: #' + name);

	stream.on('tweet', function (tweet) {
	  console.log('Got tweet!');

	  var clean = function (text) {
	    text = text || '';
	    return text.replace(/\'/g, "\\'").replace(/[^a-zA-Z0-9 #@.,:\/]/g,'');
	  };

	  var neo4jquery = "CREATE (t:Tweet {id:'" + tweet.id + "', created_at:'" + tweet.created_at + "', text:'" + clean(tweet.text) + "'}) " + 
	  "MERGE (a:Author {id:'" + tweet.user.id + "', name:'" + clean(tweet.user.name) + "', screen_name:'" + clean(tweet.user.screen_name) + "', description:'" + clean(tweet.user.description) + 
	    "', profile_image_url:'" + clean(tweet.user.profile_image_url) + "'}) CREATE (a)-[:TWEETED]->(t) ";
	   tweet.entities.hashtags.forEach(function(hashtag, index) {

	     neo4jquery += 'MERGE (h' + index.toString() + ':Hashtag {name:"' + clean(hashtag.text) + '"}) CREATE (h' + index.toString() + ')-[:INCLUDES]->(t)' + 
	      ' CREATE UNIQUE (a)-[r' + index + ':MENTIONS]->(h' + index.toString() + ') ' +
	      'SET r' + index + '.count=COALESCE(r' + index + '.count, 0) ' +
	      'SET r' + index + '.count=r' + index + '.count+1 '
	 
	   });
	   neo4jquery += 'WITH a AS author ' +
	    'MATCH (hash:Hashtag)<-[:MENTIONS]-(author) ' +  
	    'WITH COLLECT(hash) AS hashes ' +  
	    'FOREACH (i in RANGE(0, length(hashes)-1) | ' + 
	    'FOREACH (j in RANGE(0, length(hashes)-1) | ' +
	    'FOREACH (h1 in [hashes[i]] | ' +
	    'FOREACH (h2 in [hashes[j]] | ' +
	    'CREATE UNIQUE (h1)-[r:LINKED]->(h2) ' +
	    'SET r.count=COALESCE(r.count, 0)' +
	    'SET r.count=r.count+1 ' +
	    '))))'
	  neo4jquery += ';';

	  db.cypherQuery(neo4jquery, function(err, result){
	      if(err) console.log(err);
	      console.log(tweet.user.screen_name + ': ' + tweet.text);
	  });  

	});
	};
	
Hashtag.prototype.find = function(name) {
	var neo4jquery = "MATCH (h:Hashtag) WHERE h.name='" + name + "' RETURN h;"
	var deferred = new Deferred;
	db.cypherQuery(neo4jquery, function(err, result) {
		if (err) {console.log(err)};
		if (result.data.length > 0) {
				this.tag = '#' + name;
				this.name = name;
				deferred.resolve(true);
		} else {
			deferred.resolve(false);
		};
	}); 
	return deferred.promise;
};

Hashtag.prototype.map = function(name) {
var deferred = new Deferred;
var velocity = this.velocity;
var neo4jquery = "MATCH (h1:Hashtag)-[r:LINKED]->(h2:Hashtag) WHERE h1.name='" + name + "' RETURN h2,r ORDER BY r.count DESC LIMIT 20;" 
db.cypherQuery(neo4jquery, function(err, result){
 	if(err) console.log(err);
  	var data = result.data.map(function(d) {return d.data});
  	var map = [];
  	for (var i = 0; i<data.length; i+=2) {
  		map.push({hashtag: data[i], rel: data[i+1]});
  	};
  	async.each(map, 
  		function(item, callback)
  		{
  			var promise =  velocity(item.hashtag.name);
  			promise.then(function(v) {
  				item.hashtag.velocity = v;
  				callback();
  			});

  		}, function (err) {
  			if(err) console.log(err);
  			console.log(JSON.stringify(map));
  			deferred.resolve(map);
  		}
  	);

});

  return deferred.promise;

};

Hashtag.prototype.list = function(name) {
	var tweetquery = 'MATCH (h:Hashtag)-[]->(t:Tweet)<-[]-(a:Author) WHERE h.name="'+ name + '" RETURN t,a ORDER BY t.created_at DESC LIMIT 20;'
	var authorquery = 'MATCH (h:Hashtag)<-[r:MENTIONS]-(a:Author) WHERE h.name="'+ name + '" RETURN a,r ORDER BY r.count ASC LIMIT 20;'
	var deferred = new Deferred;
	async.parallel([
		function(callback) {
			db.cypherQuery(tweetquery, function(err, result) {
				if(err) {callback(err)};
				var tweets = [];
				var data = result.data.map(function(r) {return r.data});
				for (var i = 0; i<data.length; i+=2) {
  					tweets.push({tweet: data[i], author: data[i+1]});
  				};
				callback(null, tweets);
		})
		},
		function(callback) {
			db.cypherQuery(authorquery, function(err, result) {
				if(err) {callback(err)};
				var authors = [];
				var data = result.data.map(function(r) {return r.data});
				for (var i = 0; i<data.length; i+=2) {
  					authors.push({author: data[i], mentions: data[i+1].count});
  				};
				callback(null,authors);
			})
		}
		],
		function(err,results) {
			console.log(results);
			deferred.resolve({tweets: results[0], authors:results[1]});
		}
	);
	return deferred.promise;
};

module.exports = Hashtag;

var hashtag = new Hashtag;