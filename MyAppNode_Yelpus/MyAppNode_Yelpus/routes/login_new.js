var connectData = { 
  "hostname": "cis550project.celkf0ufkew2.us-east-1.rds.amazonaws.com", 
  "user": "CHHL", 
  "password": "chhlCIS550", 
  "database": "TMDB" };
var oracle =  require("mysql");

var sess;
function query_db( user, pass , req, res) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
	  	connection.execute("SELECT * from users where EMAIL_ID = :user_emailid", 
	  			   [ user.trim()], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	db_auth( user, pass, results, req, res);
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

function db_add_user(req, res) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
	    	var  bcrypt = require('bcrypt');
	    	var pass_hash = bcrypt.hashSync(req.body.pass.trim(), 10);
	    	//console.log(bcrypt.compareSync("my password", hash));
	    	
	    	console.log("hash at signup " + pass_hash);
	    	var user_id=Math.random().toString(36).substr(2, 7) ;
		  	connection.execute(" INSERT into users( EMAIL_ID , PASSWORD , USERNAME , USER_ID ) values ( :u_email, :u_pass ,:u_username , :u_userid )", 
		  			   [ req.body.useremail.trim() , pass_hash ,req.body.username.trim(), user_id ], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    	res.send(' message from db after add user ' + JSON.stringify(err.message));
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	console.log(" after add " + results );
		  	    	console.log(JSON.stringify(results));
		  	    	req.session.userid= user_id ;
					  req.session.username= req.body.username.trim();
					  res.redirect("/events");
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
	}


function db_auth(user,pass,results , req, res  ) {
	console.log(results.length);
	//console.log( results[0].PASSWORD.trim()+ " " + results[0].USERNAME.trim() );
	if( results.length >= 1)
	{
	if( user == results[0].EMAIL_ID.trim() )
		{
		var  bcrypt = require('bcrypt');
		var pass1 = bcrypt.hashSync(pass.trim(), 10);
		//console.log(bcrypt.compareSync("my password", hash));
	   console.log();
		console.log("hash pwd " + pass1);
		console.log("hash stored pwd " +results[0].PASSWORD.trim() );
		  if( bcrypt.compareSync(pass , results[0].PASSWORD.trim() ) )
			  {
			  
			  req.session.userid=results[0].USER_ID.trim();
			  req.session.username=results[0].USERNAME.trim();
		  	   res.redirect("/events");
			  }
		  else
			  {
			  res.render('login_sucess.jade',{ title:"Fail", user: "" , message:"Password did not match" });
			  }
		}
	else
		{
		res.render('login_sucess.jade',{ title:"Fail", user: "" , message:"Username not found" });
		}
	
	}
	else
		{
		res.render('login_sucess.jade',{ title:"Fail", user: "" , message:"Username not found" });
		
		}
}

function display_form(res) {
	res.render('login.jade', { title: "YelpUs" }  );
}

// This is what's called by the main app 
exports.display = function(req, res){
	display_form(res);
};



exports.auth = function(req, res){
	console.log(req.body.user);
	console.log(req.body.pass);
	var isAuth= query_db(req.body.user, req.body.pass , req, res );
	console.log("hereeeeeee");
	
};

exports.logout = function (req,res){
	
	     var sess= req.session;
	     if (sess)
	    	 console.log(" sess is ok");
	     sess.destroy();
		  res.redirect("/");

}

exports.disp_signup = function(req, res){
	var  bcrypt = require('bcrypt');
	var hash = bcrypt.hashSync("my password", 10);
	console.log(bcrypt.compareSync("my password", hash));
	console.log(bcrypt.compareSync("not my password", hash));
	console.log("hash " +hash);
	//console.log(jobj["Monday"]["close"] );
	res.render('signup.jade',{ });
	};

exports.signup = function(req, res){
	
		db_add_user(req, res);
		};
	
	
exports.test_sess = function(req, res){
	sess=req.session;
	if(sess)
	{if (sess.userid )
		res.render('login_sucess.jade',{ title:"Success", user: sess.userid , message: sess.userid+" user is logged in "+ sess.username });
	else
		res.render('login_sucess.jade',{ title:"Fail", user: "" , message:"No one is logged in" });
	}
	else
		res.render('login_sucess.jade',{ title:"Fail", user: "" , message:"No sess" });
				
};