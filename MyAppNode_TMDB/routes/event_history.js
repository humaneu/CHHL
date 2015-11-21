var connectData = { 
  "hostname": "cis550project.celkf0ufkew2.us-east-1.rds.amazonaws.com", 
  "user": "CHHL", 
  "password": "chhlCIS550", 
  "database": "TMDB" };
var oracle =  require("mysql");

function query_db(res,name) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	connection.execute("SELECT DISTINCT G.GROUP_ID as GROUP_ID,EVENT_ID,NAME FROM GROUPS G INNER JOIN EVENT E ON G.GROUP_ID=E.GROUP_ID where G.GROUP_ID='"+name+"'", 
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
	console.log(results.length);
	res.render('event_history.jade',
		   { title: "Event History ",
		     results: results }
	  );
}

exports.do_work = function(req, res){
	query_db(res,req.query.group_id);
};