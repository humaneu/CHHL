var connectData = { 
  "hostname": "cis550project.celkf0ufkew2.us-east-1.rds.amazonaws.com", 
  "user": "CHHL", 
  "password": "chhlCIS550", 
  "database": "TMDB" };
var oracle =  require("mysql");

function query_db(res,eventid) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	connection.execute("SELECT DISTINCT " +
	  			"event.name AS event_name, " +
	  			"event.day AS time, " +
	  			"event.type AS type, " +
	  			"business.url as url, " +
	  			"groups.group_name, " +
	  			"business.name as place, " +
	  			"business.latitude as latitude, " +
	  			"business.longitude as longitude, " +
	  			"business.full_address as address " +
	  			"FROM event " +
	  			"INNER JOIN groups ON event.group_id=groups.group_id " +
	  			"INNER JOIN business ON event.bus_id=business.business_id " +
	  			"WHERE event.event_id='" + eventid + "'", 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	console.log( "tryuuii " + JSON.stringify(results));
	  	    	output_events(res, eventid, results);
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

function output_events(res,name,results) {
	res.render('eventpop.jade',
		   { title: "Event details ",
		     results: results }
	  );
}

exports.do_work = function(req, res){
	sess=req.session;
	if(sess)
	{if (sess.userid )
		{  console.log(req.query.eventid);  
		query_db(res,req.query.eventid);
		
	console.log(" eventpop");   }
	else
		res.render('login_sucess.jade',{ title:"Fail", user: "" , message:"No one is logged in" });
	}
	else
		res.render('login_sucess.jade',{ title:"Fail", user: "" , message:"No sess" });
	
};