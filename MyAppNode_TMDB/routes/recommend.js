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

function db_test_rec(req, res  , results_pre ,  cuisines_list , location , place_type ,group_id , prefer_list , state) {
	var cuisines= prefer_list;
	var num= ( (10 - results_pre.length) / cuisines.length ) + 1 ;
	var results_new="";
	var results_obj=[]
	var done=0;
	console.log(" number for each cuisine "+ num);
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) { console.log(err);}
	    else 
	    {
	    	for ( var i=0; i< cuisines.length ; i++)
	    	{ 
	    		console.log( cuisines[i] + " " + Math.ceil(num) );
	    		connection.execute(" select * from ( select b.business_id as bus_id , b.name , c.CATEGORIES, b.full_address as address ,b.stars from business b , category c , category c1 where b.business_id = c.business_id and lower(b.full_address) LIKE :u_loc and b.stars > 3 and ( lower(c.categories) like :u_cuisine  ) and b.full_address LIKE :u_state and c1.categories = 'Restaurants' and c.business_id = c1. business_id order by b.stars desc ) where rownum <  :u_rownum", 
		  			   [ "%"+location.toLowerCase()+"%" , "%"+  cuisines[i].toLowerCase()+"%" , "%"+state.toUpperCase()+"%" , num],
		  			   function(err, results) {
				  	   if ( err ) {
				  	    	console.log(err);
				  	    	res.send(' message from db after query ' + JSON.stringify(err.message));
				  	   } else {
				  		   console.log( " after add " + JSON.stringify(results) );
				  		   results_new += JSON.stringify(results);
				  		   results_obj= results_obj.concat(results);
				  		   done++;
				  		   console.log( "done " + done);
				  		   console.log(i);
				  		   
				  		   if ( done == (cuisines.length ) ){
				  			   	console.log ("hereeeee");
				  			   	console.log(JSON.stringify(results_obj) );
				  			   	res.render('recommend.jade',{ title:" Recommendations" , results_obj : results_obj ,group_id: group_id, event_id : Math.random().toString(36).substr(2, 5) , results_pre : results_pre });
				  			   	connection.close(); 
				  		   }
				  	   }
	    		}); // end connection.execute
	    	}
	    }
	  }); // end oracle.connect
}

function getKeyByValue( arr, value ) {
    for( var prop in arr ) {
        if( arr.hasOwnProperty( prop ) ) {
             if( arr[ prop ] === value )
                 return prop;
        }
    }
}

function db_get_pref( req, res , cuisines_list , location , place_type ,group_id ,state){
	var results_new="";
	var results_obj=[]
	var done=0;
	var avgs=[];
	var pref_list_dict={};
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) { console.log(err);}
	    else
	    {
	    	for ( var i=0; i< cuisines_list.length ; i++)
    		{
	    		connection.execute("WITH reviewsInGroup AS ( SELECT user_id, review_id, business_id, star FROM groups NATURAL JOIN review WHERE group_id = :u_group_id ) SELECT categories,AVG(star) as AVG_ST FROM ( SELECT c1.categories, star FROM reviewsInGroup b INNER JOIN category c1 ON b.business_id = c1.business_id INNER JOIN category c2 ON b.business_id = c2.business_id WHERE c2.categories = 'Restaurants' AND lower(c1.categories) LIKE :u_cuisine) GROUP BY categories", 
		  			   [ group_id, "%"+  cuisines_list[i].toLowerCase()+"%"  ], 
		  			   function(err, results) {
	    			   if ( err ) { console.log(err);}
	    			   else {
			  	    	results_new += JSON.stringify(results);
			  	    	results_obj= results_obj.concat(results);
			  	    	done++;
			  	    	console.log( "done " + done + "  " + cuisines_list);
			  	    	if( results[0])
			  	    	{
			  	    		if (results[0].AVG_ST > 3)
			  	    			avgs.push(results[0].AVG_ST);
			  	    		pref_list_dict[ results[0].CATEGORIES]=results[0].AVG_ST;
			  	    	}
			  	    	console.log(i);
			  	    	if ( done == (cuisines_list.length ) )
		  	    		{
			  	    		console.log ("hereeeee at prefer ");
			  	    		console.log(JSON.stringify(results_obj) );
			  	    		avgs.sort().reverse();
			  	    		console.log(avgs);
			  	    		console.log(pref_list_dict);
			  	    		console.log(getKeyByValue(pref_list_dict,avgs[0]));
			  	    		prefer_list=[];
			  	    		for (var j=0; j< avgs.length ; j++)
			  	    			{
			  	    			prefer_list.push(getKeyByValue( pref_list_dict,avgs[j])); 
			  	    			}
			  	    		if (prefer_list.length <= 0)
			  	    			prefer_list=cuisines_list;
			  	    		console.log( " prefer list " + prefer_list );
			  	    		connection.close(); 
			  	    		console.log( "before call " +cuisines_list , location , place_type ,group_id , prefer_list );
			  	    		proceed_next_query( req, res , cuisines_list , location , place_type ,group_id , prefer_list , state);
		  	    		}
	    			   }
		  	}); // end connection.execute
	    }
	  }
	  }); // end oracle.connect
}


function proceed_next_query( req, res , cuisines_list , location , place_type ,group_id , prefer_list , state)
{
	
	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
	    	console.log(prefer_list[0]);
		  	connection.execute("select * from ( With member_review as ( Select R.business_id from review R natural join groups G where G.group_id= :u_group_id and R.star>=3.0) Select distinct(name), url, C.categories , stars , B.business_id as bus_id,  b.full_address as address from business B inner join member_review M on B.business_id=M.business_id inner join category C on B.business_id=C.business_id where LOWER(B.full_address) like :u_loc and LOWER(C.categories) like :u_cuisine and B.full_address like :u_state order by stars desc ) where rownum <=6",
		  		[ group_id , "%" + location + "%" , "%" +prefer_list[0].toLowerCase()+"%" , "%"+state.toUpperCase()+"%" ], 
		  	//		[],
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	console.log( " FINAL RES  " + JSON.stringify(results));
		  	    	connection.close(); // done with the connection
		  	    	 db_test_rec(req, res , results ,  cuisines_list , location , place_type ,group_id , prefer_list , state);
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect
}

exports.disp_signup = function(req, res){
	var jstr="{u'Monday': {u'close': u'21:00', u'open': u'10:00'}, u'Tuesday': {u'close': u'21:00', u'open': u'10:00'}, u'Friday': {u'close': u'21:00', u'open': u'10:00'}, u'Wednesday': {u'close': u'21:00', u'open': u'10:00'}, u'Thursday': {u'close': u'21:00', u'open': u'10:00'}, u'Sunday': {u'close': u'10:00', u'open': u'20:00'}, u'Saturday': {u'close': u'21:00', u'open': u'10:00'}}";
	var jstr1=jstr.replace(new RegExp("u'", 'g'),"'");
	jstr1=jstr1.replace(new RegExp("'", 'g'),'"');
	console.log(jstr1);
	var jobj =JSON.parse(jstr1);
	console.log(jobj["Monday"]["close"] );
	res.render('signup.jade',{ });
	};

exports.getprefer = function(req, res){
	var cuisines_list = req.body.checks;
	var location=req.body.loc.trim();
	var state= req.body.state.trim();
	console.log(" state "+ state);
	console.log(" loction value is " + location);
	console.log(req.body.rads);
	if ( req.body.rads === undefined)
		console.log(" rads in undefined");
	console.log(location);
	var group_id= req.session.groupid ;
	var place_type=req.body.rads;
    if ( req.body.checks === undefined )
	{  res.render('login_sucess.jade',{ title:"Fail", user: "" , message:"Please pick atleast one cuisine" });  }
	else
	{
		for(var i=0;i< cuisines_list.length;i++)
		{
				console.log("aa "+ cuisines_list[i]);
		}
		db_get_pref( req, res , cuisines_list , location , place_type ,group_id , state );
	}	
};
	
exports.dummy_save = function(req, res){
	console.log(Math.random().toString(36).substr(2, 5));
}

exports.test_rec = function(req, res){
	console.log("calling new query");
	db_test_rec(req, res);
};
