var connectData = { 
  "hostname": "cis550project.celkf0ufkew2.us-east-1.rds.amazonaws.com", 
  "user": "CHHL", 
  "password": "chhlCIS550", 
  "database": "TMDB" };
var oracle =  require("mysql");

function query_db(res,id,name) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {

	  	connection.execute("SELECT G.GROUP_ID,G.GROUP_NAME " +
	  			"from GROUPS G  where G.USER_ID= '"+ id + "'", 
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
	res.render('groups.jade',
		   { title: "Your Groups ",
		     results: results }
	  );
}

exports.do_work = function(req, res){
	sess=req.session;
	if(sess)
	{if (sess.userid )
		{query_db(res,sess.userid , sess.username);
	console.log(sess.userid);
	console.log(sess.username);   }
	else
		res.render('login_sucess.jade',{ title:"Fail", user: "" , message:"No one is logged in" });
	}
	else
		res.render('login_sucess.jade',{ title:"Fail", user: "" , message:"No sess" });
	
};