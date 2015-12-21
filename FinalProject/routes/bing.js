var acctKey = '';
var rootUri = '';
var auth    = new Buffer([ acctKey, acctKey ].join(':')).toString('base64');
var request = require('request').defaults({
  headers : {
    'Authorization' : 'Basic ' + auth
  }
});


exports.search = function(req, res){
	  var service_op  = 'Web';
	  console.log(service_op);
	  var query = req.body.query;
	  console.log(query);
	  console.log(rootUri + '/' + service_op);
	  request.get({
	    url : rootUri + '/' + service_op,
	    qs  : {
	      $format : 'json',
	      Query   : "'" + query + "'",
	    }
	  }, function(err, response, body) {
	    if (err)
	      console.log('error_1');
	    else if (response.statusCode !== 200) {
	    	console.log('error_2');
	    	console.log(response.statusCode);
	    }
	      
	    else {
	    	var results = JSON.parse(response.body);
	    	console.log('back bing search results');
	    	sess=req.session;
	    	res.render('bing_result.jade', {state:sess, keyword:query, results:results.d.results});
	    }
	  });
};