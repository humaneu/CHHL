var connectData = { 
  "hostname": "cis550project.celkf0ufkew2.us-east-1.rds.amazonaws.com", 
  "user": "CHHL", 
  "password": "chhlCIS550", 
  "database": "TMDB" };
var oracle =  require("mysql");

function query_db(res) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	connection.execute("SELECT * from users where rownum <2", 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	output_choose(res);
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

function output_choose(res) {
	res.render('choose_event.jade',
		   { title: "Choose! ",
		     }
	  );
}

exports.do_work = function(req, res){	
	sess=req.session;
	if(sess)
	{if (sess.userid)
		{  console.log(req.query.id);
		
			req.session.groupid=req.query.id;
		output_choose(res);
		
		}
	else
		res.render('login_sucess.jade',{ title:"Fail", user: "" , message:"No one is logged in" });
	}
	else
		res.render('login_sucess.jade',{ title:"Fail", user: "" , message:"No sess" });
	
	
};