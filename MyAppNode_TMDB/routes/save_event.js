var connectData = { 
  "hostname": "cis550project.celkf0ufkew2.us-east-1.rds.amazonaws.com", 
  "user": "CHHL", 
  "password": "chhlCIS550", 
  "database": "TMDB" };
var oracle =  require("mysql");

function output_groups(res) {
	res.render('save_event.jade',{ title: "Complete event details",} );
}

function send_mail(groupid , name , date , time)
{
	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	connection.execute("SELECT USERNAME,EMAIL_ID FROM USERS U INNER JOIN GROUPS G ON U.USER_ID=G.USER_ID where G.GROUP_ID='"+groupid+"'", 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	output_mail( results , name, date , time);
		  	    }
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
}

function output_mail(results , name , date , time)
{
	var nodemailer = require('nodemailer');
	var transporter = nodemailer.createTransport();
	// setup e-mail data with unicode symbols
	console.log( "mail res length "+ results.length);
	for ( var j=0;j < results.length ;j ++)
	{
		console.log( "email sent to " +results[j].EMAIL_ID );
		var mailOptions = {
		    from: 'Yelp Us  <yelpus@seas.upenn.edu>', // sender address
		    to:  results[j].EMAIL_ID, // list of receivers
		    subject: 'Hello! You have a new event on YelpUs! ', // Subject line
		    text: 'New Event : ' + name , // plaintext body
		    html: '<b>New Event </b> <p> ' + name+ ' </p> <p> Date: '+ date +' Time: '+  time + '</p>' // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        console.log(error);
		    }else{
		        console.log('Message sent: ' + info.response);
		    }
		});
	}
}

function query_db(req,res, groupid ,eid ,bid ,uid ) {
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var str=req.query.month+'-'+req.query.day+'-'+req.query.year;
	    	var time=req.query.hour+':'+req.query.min+' '+req.query.m;
		  	connection.execute("INSERT into EVENT(EVENT_ID ,GROUP_ID ,BUS_ID, HOST_ID, DAY, TIME, TYPE, NAME) values (:u_id, :u_gid, :u_bid, :u_hid, :u_day, :u_time, :u_type, :u_name )", 
			  			   [ eid,groupid,bid,uid,str,time,req.query.type,req.query.name ], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	send_mail( groupid , req.query.name , str , time );
		  	    	res.redirect('/eventpop?eventid='+eid);
		  	    }
		  	}); // end connection.execute
	      }
	  }); // end oracle.connect
}
 
exports.do_work = function(req, res){
	session=req.session;
	if(session)
	{
		if(session.userid){
			session.gid=req.query.group_id;
			session.eid=req.query.eventid;
			session.busid=req.query.bus_id;
			output_groups(res);
		}
		else
			res.render('login_sucess.jade',{ title:"Fail", user: "" , message:"No one is logged in" });
	}
	else
		res.render('login_sucess.jade',{ title:"Fail", user: "" , message:"No sess" });	
};

exports.save_events = function(req, res){
	session=req.session;
	if(session)
	{
		if(session.userid){
			var groupid= session.gid;
			console.log("Test here"+groupid);
			var eid=session.eid;
	      	var bid=session.busid;
	      	var uid=session.userid;
	      	query_db( req,res, groupid ,eid ,bid ,uid );
		}
		else
			res.render('login_sucess.jade',{ title:"Fail", user: "" , message:"No one is logged in" });
	}
	else
		res.render('login_sucess.jade',{ title:"Fail", user: "" , message:"No sess" });
}