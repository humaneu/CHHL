var mysql = require('mysql');

var connectData = mysql.createConnection({ 
  host: "", 
  user: "", 
  password: "", 
  database: "" });

function newest_four(req, res, sess) {
	var list = [];
	var new1 = {id:205775, title:"In the Heart of the Sea", poster:"http://image.tmdb.org/t/p/original/zVmWh0Zfg4UhbvdGI8LQrn1lQZJ.jpg"};
	var new2 = {id:309245, title:"Mistress America", poster:"http://image.tmdb.org/t/p/original/aLoPGV8c0G3AXB1ux0JhUYA1YRX.jpg"};
	var new3 = {id:250124, title:"The Diary of a Teenage Girl", poster:"http://image.tmdb.org/t/p/original/pjKYDczdrg1juolVlY69D1M4xWb.jpg"};
	var new4 = {id:309299, title:"Experimenter", poster:"http://image.tmdb.org/t/p/original/eF6AH6A5vUeHKQ2SNiQv9bIP5MN.jpg"};
	var new5 = {id:167073, title:"Brooklyn", poster:"http://image.tmdb.org/t/p/original/pJ5FjCO9X0jhxtQlUGtV0R0P4Bh.jpg"};
	
	list.push(new1);
	list.push(new2);
	list.push(new3);
	list.push(new4);
	list.push(new5);
	console.log(list);
	res.render('homepage.jade', {state : sess, recommend : list});
}

function recom_four(req, res, sess, histories) {
	connectData.query(			
			"select M.Mid as id, M.title as title, M.poster as poster" +
			" from Movie M inner join Movie_genres MG on MG.Mid = M.Mid" +
			" where MG.genre = (select MG1.genre from Movie_genres MG1 inner join History H" +
			      				" on H.Movie_id = MG1.Mid where User_id = '" + sess.userid + 
			      				"' group by MG1.genre" +
			      				" order by count(*) desc" + 
			      				" limit 1)" +
			" order by rand()" +
			" limit 5",
			
			function(err, list) {
				if (err) console.log(err);
				else {
					res.render('homepage.jade', {state : sess, recommend : list});
				}
			});
	
}

exports.do_work = function(req, res){
	sess=req.session;
	
	if (sess) {
		if (sess.userid) {
			connectData.query(
					"select Movie_id from History where User_id = '" + sess.userid + "'",
					function(err, histories) {
						if (err) console.log(err);
						else {
							if (histories.length > 0) recom_four(req, res, sess, histories);
							else newest_four(req, res, sess);
						}
					});
		}
		else {
			newest_four(req, res, sess);
		}
	}
	else {
		newest_four(req, res, sess);
	}
};

exports.display = function(req, res) {
	res.render('aboutus.jade', {state : sess});
}