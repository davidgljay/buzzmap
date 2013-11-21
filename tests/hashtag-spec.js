var hashtag = require('../hashtag.js');


describe('Hashtags', function () {

	it ('should create a new object', function() {
		purple = new hashtag.Hashtag('purple');
		expect(purple.name).toBe('purple');
	});	

});