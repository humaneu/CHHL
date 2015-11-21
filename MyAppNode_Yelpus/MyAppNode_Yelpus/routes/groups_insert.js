var connectData = { 
  "hostname": "cis550project.celkf0ufkew2.us-east-1.rds.amazonaws.com", 
  "user": "CHHL", 
  "password": "chhlCIS550", 
  "database": "TMDB" };
var oracle =  require("mysql");

function query_db(res,name,friend,id) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	connection.execute(" INSERT into GROUPS( USER_ID ,GROUP_ID ,GROUP_NAME) values ( :u_id, :u_grid ,:u_name )", 
		  			   [ friend, id ,name   ], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	output_groups(res, id,name,friend, results);
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

function output_groups(res,id,name,friend,results) {
	res.render('groups_insert.jade',
			   { title: "Group Success ",
			     id:id}
		  );
}

exports.do_work = function(req, res){
	var arr = req.body.checks;
	var id=req.body.name+sess.userid;
	query_db(res,req.body.name,sess.userid,id);
	for(var i=0;i<arr.length;i++)
		{
				console.log(arr[i]);
				query_db(res,req.body.name,arr[i],id);
		}
	console.log(req.body.name);
	
};