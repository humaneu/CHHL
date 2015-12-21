var MongoClient = require('mongodb').MongoClient;
var score = 0;
var currentCorrectAns = '';
var remainTime = 30;
var mysql = require('mysql');

var connectData = mysql.createConnection({ 
  host: "", 
  user: "", 
  password: "", 
  database: "" });

function getQuestion(req, db, callback) {
	var r = Math.floor(Math.random() * 2500);
	
	var cursor =db.collection('movie_quiz').find({kid:{"$in":[r+2,r+3,r+4,r+5]}},{'_id':0, 'title':1, 'backdrop':1});
	var titles = [];
	var backdrops = [];
	cursor.each(function(err, doc) {
		if (doc != null) {
			//console.log(doc);
			titles.push(doc.title);
			backdrops.push(doc.backdrop);
		} else {
			currentCorrectAns = titles[0];
			console.log(currentCorrectAns);
			titles.sort();
			titles.push(backdrops[0]);
			callback(titles);
		}
	});
}


function generateQuestion(req, res) {
	var url = ''; //connect to mongodb instance

	MongoClient.connect(url, function(err, db) {
		// If there is an error, log the error and render the error page 
		if(err != null) {
			console.log("Connection to mongodb failed.");
			db.close();
			res.render('error', {
				message: "Connection to mongodb failed.",
				error: err
			});
		}
		// If there is no error while connecting, proceed further
		else {
			console.log("Connected correctly to mongodb.");
			getQuestion(req, db, function(questions) {
				db.close();
				console.log(questions);
				console.log("remainTime:");
				console.log(remainTime);
				sess = req.session
				res.render('quiz_question.jade', {state : sess, score:score, questions:questions, remainTime:remainTime});
			});
		}
	});
}


function dealAnswer(req, res) {
	console.log('returned ans');
	console.log(req.query.title);
	console.log('returned remain time');
	console.log(req.query.remain);
	remainTime = req.query.remain;
	if (currentCorrectAns == req.query.title) {
		score = score + 10;
		remainTime = +remainTime + 5;
	}
	else{

	}
	console.log('current score:');
	console.log(score);
}


function showScores(req, res) {
	console.log('show scores now...');
	//insert this time score into table
	sess=req.session;
	if (sess) {
		if (sess.userid) {
			currentDate=new Date().toLocaleString();
			console.log(currentDate);
			connectData.query("INSERT into Scores(User_id, Username, Date, Score) values ('" + sess.userid + "', '" + sess.username + "', '" + currentDate + "', '" + score + "')");
			console.log("score added");
			connectData.query(
					"select Username, Date, Score" +
					" from Scores" +
					" order by Score DESC" +
					" limit 5",
					function(err, score_list){
						if (err) console.log(err);
						else {
							console.log("score_list");
							console.log(score_list);
							res.render('quiz_scoreRoll.jade', {state : sess, score:score, score_list:score_list});
						}
					});
		}
	}
}


exports.quiz_getAnswer = function(req, res){
	if (req.query.remain <= 0)
		showScores(req, res);
	else {
		dealAnswer(req, res);
		generateQuestion(req, res);
	}
};


exports.quiz_displayQuestion = function(req, res){
	
	generateQuestion(req, res);
};


exports.quiz_info = function(req, res){
	sess=req.session;
	if(sess)
	{if (sess.userid )
		{score = 0;
		 remainTime = 30;
		 res.render('quiz_info.jade',{state : sess});
		 console.log(sess.username);   
		}
	else
		res.render('sign_up.jade');
	}
	else
		res.render('sing_up.jade');
};