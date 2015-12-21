var mysql = require('mysql');

var connectData = mysql.createConnection({ 
  host: "cis550project.celkf0ufkew2.us-east-1.rds.amazonaws.com", 
  user: "CHHL", 
  password: "chhlCIS550", 
  database: "TMDB" });


function query_db(res, userid , name) {
	//connect to database
	connectData.connect(function(err){
		if(!err) {
			console.log("Database is connected...Man Hu\n\n");		
		} else {
			console.log("Database connection failed..\n\n");
			db.end();
			res.render('error', {
				message: "Connection to server failed.",
				error:err
			});
		}
	});
	
	connectData.query(
			"SELECT M.title, M.poster From Movie M Where M.Mid = 2",			
//			"SELECT E.EVENT_ID,E.NAME from EVENT E where E.EVENT_ID = 1",  
			   function(err, results) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	connectData.end(); // done with the connection
	    	console.log("Database connection closed. Man Hu");
	    	console.log(results[0].title);
	    	console.log(results[0].poster);
	    	output_upcome(res, name, results);

	    }

	});  // end database connection
}

function output_upcome(res,name,results) {
	res.render('events.jade',
		   { title: "Hi  "+name+ "! Here are your favrioute movies " ,
		     results: results }
	  );
}

exports.do_work = function(req, res){
	sess=req.session;
	if(sess)
	{if (sess.userid )
		{query_db(res,sess.userid , sess.username);
		console.log(sess.username);   
		}
	else
		res.render('login_sucess.jade',{ title:"Fail", user: "" , message:"No one is logged in" });
	}
	else
		res.render('login_sucess.jade',{ title:"Fail", user: "" , message:"No sess" });
	
};