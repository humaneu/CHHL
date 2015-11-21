var connectData = { 
  "hostname": "cis550project.celkf0ufkew2.us-east-1.rds.amazonaws.com", 
  "user": "CHHL", 
  "password": "chhlCIS550", 
  "database": "TMDB" };
var oracle =  require("mysql");

function query_db(res,email) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {

    	console.log(email);
    	var str="With user_friends as ( select friend_id from friends f inner join users u on u.user_id=f.user_id WHERE u.email_id like '"+email+"') select username,user_id,email_id from users inner join user_friends on users.user_id=user_friends.friend_id";
    	console.log(str);
	  	connection.execute("With user_friends as ( select friend_id from friends f inner join users u on u.user_id=f.user_id WHERE u.user_id like '"+email+"') select username,user_id,email_id from users inner join user_friends on users.user_id=user_friends.friend_id", 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	output_groups(res, results);
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

function output_groups(res,results) {
	console.log("Emails");
	console.log(results.length);
	res.render('friends.jade',
		   { title: "Your Friends ",
		     results: results }
	  );
}

exports.do_work = function(req, res){
	if(req.method=="GET")
		{
		console.log("get");
		}
	else
		{
		console.log("POST");
		}
	sess=req.session;
	if(sess)
	{if (sess.userid )
		{
		query_db(res,sess.userid);   }
	else
		res.render('login_sucess.jade',{ title:"Fail", user: "" , message:"No one is logged in" });
	}
	else
		res.render('login_sucess.jade',{ title:"Fail", user: "" , message:"No sess" });
	
};