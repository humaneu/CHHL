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
    	console.log(name);
	  	connection.execute("SELECT G.GROUP_ID as GROUP_ID,USERNAME,EMAIL_ID FROM USERS U INNER JOIN GROUPS G ON U.USER_ID=G.USER_ID where G.GROUP_ID='"+name+"'", 
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
	console.log("Length");
	console.log(results.length);
	res.render('groups_info.jade',
		   { title: "Group Members ",
		     results: results }
	  );
}

exports.do_work = function(req, res){
	query_db(res,req.query.id);
};