var neo4j = require('node-neo4j');
var db = new neo4j('http://localhost:7474');
var async = require('async');
var Deferred = require("promised-io/promise").Deferred;

var User = function () {
};



User.prototype.find_or_create = function(name, tokens) {

	this.name = name;
	var deferred = new Deferred;

	var neo4jquery = 'MERGE (u:User {name:"' + name + '", tokens:"'+ JSON.stringify(tokens) + '"}) RETURN u;'
	db.cypherQuery(neo4jquery, function(err, result) {
		if (err) {console.log(err)};
		deferred.resolve(true);
	});

	return deferred.promise;
};

User.prototype.find = function(name) {

	this.name = name;
	var deferred = new Deferred;


	var neo4jquery = 'MATCH (u:User) WHERE u.name = "' + name + '" RETURN u;'
	db.cypherQuery(neo4jquery, function(err, result) {
		if (err) {console.log(err)};
		deferred.resolve(true);
	});

	return deferred.promise;

}

module.exports = User;