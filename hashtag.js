//Functionality for tracking an individual hashtag

var Hashtag = function () {
};

Hashtag.prototype.create = function(name) {
	this.tweets = [];
	this.authors = [];

//	this.name = (name.slice(0,1) == '#') ? name.slice(0,-1) : name;
	this.tag = '#' + name;
	this.name = name;

	this.addTweet = function(tweet) {
		this.tweets.push(tweet);
	};

	this.velocity = function(size) {
		if (size > this.tweets.length) {
			size = this.tweets.length;
		};
		var sample = this.tweets.slice(0,size);
		return size/(sample[0].date - sample[size -1].date) * 1000; 
	};


//	this.ve
};

module.exports = new Hashtag;