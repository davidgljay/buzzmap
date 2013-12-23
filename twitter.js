//Functionality for integrating with the twitter API

var Twit = require('twit');
var config = require('./config.js');

var neo4j = require('node-neo4j');

config.setup();

var T = new Twit({
    consumer_key:         process.env.TWITTER_CONSUMER_KEY
  , consumer_secret:      process.env.TWITTER_CONSUMER_SECRET
  , access_token:         process.env.TWITTER_ACCESS_TOKEN
  , access_token_secret:  process.env.TWITTER_ACCESS_SECRET
})

var db = new neo4j('http://localhost:7474');


var stream = T.stream('statuses/filter', { track: ['#icestorm'], language: 'en' })

stream.on('tweet', function (tweet) {

  var clean = function (text) {
    text = text || '';
    return text.replace(/\'/g, "\\'").replace(/[^a-zA-Z0-9 #@.,:\/]/g,'');;
  };

  var neo4jquery = "CREATE (t:Tweet {id:'" + tweet.id + "', created_at:'" + tweet.created_at + "', text:'" + clean(tweet.text) + "'}) " + 
  "MERGE (a:Author {id:'" + tweet.user.id + "', name:'" + clean(tweet.user.name) + "', screen_name:'" + clean(tweet.user.screen_name) + "', description:'" + clean(tweet.user.description) + 
    "', profile_image_url:'" + clean(tweet.user.profile_image_url) + "'}) CREATE (a)-[:TWEETED]->(t)";
   tweet.entities.hashtags.forEach(function(hashtag, index) {
     neo4jquery += 'MERGE (h' + index.toString() + ':Hashtag {name:"' + clean(hashtag.text) + '"}) CREATE (h' + index.toString() + ')-[:INCLUDES]->(t) CREATE (a)-[:MENTIONS]->(h' + index.toString() + ') CREATE (h' + index.toString() + ')-[:PARTICIPANT]->(a)'
   });
  neo4jquery += ';';

  console.log(neo4jquery);
  db.cypherQuery(neo4jquery, function(err, result){
      if(err) throw err;

      console.log(result.data); // delivers an array of query results
      console.log(result.columns); // delivers an array of names of objects getting returned
  });  

});




//
//  stream a sample of public statuses
//
// var stream = T.stream('statuses/sample')

// stream.on('connect', function (request, response) {
//   console.log();
// })

// stream.on('tweet', function (tweet) {
//  console.log(tweet.text)
// })

// stream.on('disconnect', function (disconnectMessage) {
//   console.log('disconnected');
// })




//
// filter the public stream by english tweets containing `#apple`
//


//
//  tweet 'hello world!'
//
//T.post('statuses/update', { status: 'hello world!' }, function(err, reply) {
  //  ...
//})

//
//  search twitter for all tweets containing the word 'banana' since Nov. 11, 2011
//
// T.get('search/tweets', { q: 'banana', count: 10 }, function(err, reply) {
//    console.log(reply.statuses.length);
// })

//
//  get the list of user id's that follow @tolga_tezel
//
//T.get('followers/ids', { screen_name: 'tolga_tezel' },  function (err, reply) {
  //  ...
///})

//
//  retweet a tweet with id '343360866131001345'
//
//T.post('statuses/retweet/:id', { id: '343360866131001345' }, function (err, reply) {
  //  ...
//})

//
//  destroy a tweet with id '343360866131001345'
//
//T.post('statuses/destroy/:id', { id: '343360866131001345' }, function (err, reply) {
  //  ...
//})

//
// get `funny` twitter users
//
//T.get('users/suggestions/:slug', { slug: 'funny' }, function (err, reply) {
  //  ...
//})


//
//  filter the twitter public stream by the word 'mango'.
//
// var stream = T.stream('statuses/filter', { track: 'mango' })

// stream.on('tweet', function (tweet) {
//   console.log(tweet)
// })

//
// filter the public stream by the latitude/longitude bounded box of San Francisco
//
//var sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ]

//var stream = T.stream('statuses/filter', { locations: sanFrancisco })

//stream.on('tweet', function (tweet) {
 // console.log(tweet)
//})

//
// filter the public stream by english tweets containing `#apple`
//
