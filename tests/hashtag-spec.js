var hashtag = require ('../hashtag.js');
var purple, tweet1, tweet2, tweet3;

describe('Hashtags', function () {

	beforeEach(function () {
		hashtag.create('purple');
		tweet1 = {
			text: 'This is a #purple tweet',
			author: '@purpleLover',
			date: new Date,
		};
		tweet2 = {
			text: 'This is a #purple people eater',
			author: '@purpleguy',
			date: (new Date- 50000000),
		};
		tweet3 = {
			text: 'This is a #purple dinosaur',
			author: '@purpleLover',
			date: (new Date - 100000000),
		};
	});

	it ('should create a new object with a name', function() {
		expect(hashtag.tag).toBe('#purple');
		expect(hashtag.name).toBe('purple');
	});	

	it ('should push new tweets to the tweets array', function() {
		hashtag.addTweet(tweet1);
		expect(hashtag.tweets[0].text).toBe('This is a #purple tweet');
	});

	it ('should calculate the velocity of the hashtag', function () {
		hashtag.addTweet(tweet2);
		hashtag.addTweet(tweet3);
		expect(hashtag.velocity(10)).toBe(0.00004);
	});



});

