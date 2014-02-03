var neo4j = require('node-neo4j');
var db = new neo4j('http://localhost:7474');
var async = require('async');
var Deferred = require("promised-io/promise").Deferred;

var User = function () {
};



User.prototype.find_or_create = function(name) {

	this.name = name;
	var deferred = new Deferred;

	var neo4jquery = 'CREATE UNIQUE (h:Hashtag {name:"' + name + '""});'
	db.cypherQuery(neo4jquery, function(err, result) {
		if (err) {console.log(err)};
		console.log('Found User:' + name);
		deferred.resolve(true);
	});

	return deferred.promise();
};