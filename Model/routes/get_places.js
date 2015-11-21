var connectData = { 
  "hostname": "cis550project.celkf0ufkew2.us-east-1.rds.amazonaws.com", 
  "user": "CHHL", 
  "password": "chhlCIS550", 
  "database": "TMDB" };
var oracle =  require("mysql");

function query_db1(res,name) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	  	connection.execute("select business_id from category where categories like '%Chinese%' AND rownum <= 10", 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	output_groups(res, name, results);
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

function output_groups(res,name,results) {
	res.render('get_places.jade',
		   { title: "Show Groups ",
		     results: results }
	  );
}

exports.get_places = function(req, res){
	var arr = req.body.checks;
	for(var i=0;i<arr.length;i++)
		{
				console.log("aa "+ arr[i]);
		}
	query_db1(res,arr);
};