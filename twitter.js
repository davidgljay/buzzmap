//Functionality for integrating with the twitter API

var Twit = require('twit');


// module.exports.initialize = function(tokens) {
// 	var twit = new Twit({
//     consumer_key:         process.env.TWITTER_CONSUMER_KEY
//   , consumer_secret:      process.env.TWITTER_CONSUMER_SECRET
//   , access_token:         tokens.oauth_token
//   , access_token_secret:  tokens.oauth_verifier
// })
// 	module.exports.twitter = twit;
// };

 var twit = new Twit({
    consumer_key:         process.env.TWITTER_CONSUMER_KEY
  , consumer_secret:      process.env.TWITTER_CONSUMER_SECRET
  , access_token:         process.env.TWITTER_ACCESS_TOKEN
  , access_token_secret:  process.env.TWITTER_ACCESS_SECRET
});
 module.exports.twitter = twit;
