var connectData = { 
  "hostname": "cis550project.celkf0ufkew2.us-east-1.rds.amazonaws.com", 
  "user": "CHHL", 
  "password": "chhlCIS550", 
  "database": "TMDB" };
var oracle =  require("mysql");

function query_db(res,latitude,longitude) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	console.log(latitude);
    	console.log(longitude);
	  	connection.execute("SELECT latitude,longitude from BUSINESS where latitude ='"+latitude+"' and longitude = '"+longitude+"'", 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	output_actors(res,latitude,longitude);
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

function output_actors(res,latitude,longitude) {
	console.log(latitude);
	console.log(longitude);
	console.log("Yay");
	res.render('maps.jade',
		   { title: "Location Map",
		     latitude:latitude,
		     longitude:longitude
		     }
	  );
}

exports.do_work = function(req, res){
	console.log(req.query.latitude);
	console.log(req.query.longitude);
	query_db(res,req.query.latitude,req.query.longitude);
};
