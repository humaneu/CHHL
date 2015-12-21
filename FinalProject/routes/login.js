var mysql = require('mysql'); 
var sess;

var connectData = mysql.createConnection({ 
  host: '', 
  user: '', 
  password: '', 
  database: '' 
});

function query_db( user, pass , req, res) {
	connectData.query("SELECT * FROM users WHERE EMAIL_ID = '" + user + "'", 
			   function(err, results) {
	    if ( err ) {
	    	console.log(err);
	    } else { //  user is email
	    	db_auth( user, pass, results, req, res);
	    }
	}); // end connection.execute
 
}

function db_add_user(req, res, username, useremail, pass, pass1) {
		
	var user_id=Math.random().toString(36).substr(2, 7) ;
	
  	connectData.query("INSERT into users( EMAIL_ID , PASSWORD , USERNAME , USER_ID ) values ('" + useremail + "','" + pass + "','" + username + "','" + user_id + "')", 
  			   function(err, results) {
  	    if ( err ) {
  	    	console.log(err);
  	    	res.send(' message from db after add user ' + JSON.stringify(err.message));
  	    } else {
  	    	console.log(" after add " + results );
  	    	console.log(JSON.stringify(results));
  	    	req.session.userid= user_id ;
			  req.session.username= req.body.username.trim();
			  res.redirect("/");
  	    }
  	}); // end connection.execute
  	
}

function db_auth(user, pass, results, req, res) {
	console.log(results.length);
	if( results.length >= 1)
	{
	if( user == results[0].EMAIL_ID.trim() )
		{
		  if( pass == results[0].PASSWORD.trim() )
			  {
			  req.session.userid=results[0].USER_ID.trim();
			  req.session.username=results[0].USERNAME.trim();
			  res.redirect("/");
			  }
		  else
			  {
			  res.render('sign_in.jade');
			  }
		}
	else
		{
		res.render('sign_up.jade');
		}
	
	}
	else
		{
		res.render('sign_up.jade');
		}
}

function display_form(res) {
	res.render('login.jade', { title: "Moovi" }  );
}

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
	     if (sess) {
	    	 console.log(" sess is ok");}
	     sess.destroy();
		 res.redirect("/");

};

exports.disp_signup = function(req, res){
	res.render('sign_up.jade',{ });
};
	
exports.disp_signin = function(req, res){
	res.render('sign_in.jade',{ });
};

exports.signup = function(req, res){
		db_add_user(req, res, req.body.username, req.body.useremail, req.body.pass, req.body.pass1);
		};
	
	
exports.test_sess = function(req, res){
	sess=req.session;
	if(sess)
	{if (sess.userid )
		res.render('homepage.jade');
	else
		res.render('sign_in.jade');
	}
	else
		res.render('sign_up.jade');
};