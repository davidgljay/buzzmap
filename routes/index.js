
/*
 * GET home page.
 */

exports.index = function(req, res){
  if (req.cookies) {
  	console.log('Remembered cookies:' + JSON.stringify(req.cookies));
  }
  res.render('index', { title: 'BuzzMap' });
};


