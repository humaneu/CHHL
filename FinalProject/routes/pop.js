var mysql = require('mysql');

var connectData = mysql.createConnection({ 
  host: "", 
  user: "", 
  password: "", 
  database: "" });


function query_single_movie(req, res , id) {
	var results = [];
	connectData.query(
			"select M.title as title, M.poster as poster, L.rating as rating, M.runtime as runtime, T.trailer as trailer, O.overview as overview" +
			" from Movie M left join Likes L on M.Mid=L.Mid" +
			" left join Overview O on M.Mid=O.id" +
			" left join Trailer T on M.Mid=T.id" +
			" where M.Mid = " + id, 
			 function(err, singleAttrs) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	if (singleAttrs[0].trailer) {
	    		singleAttrs[0].trailer = singleAttrs[0].trailer.replace("watch?v=","embed/");
	    	}
	    	console.log(singleAttrs[0]);
	    	results.push(singleAttrs[0]);
	    }
	});  
	
	connectData.query(
			"select distinct ML.englishname as language" +
			" from Movie_Language ML" +
			" where ML.Mid = " + id, 
			 function(err, languages) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var langs = {language:[]};
	    	for ( var inx=0; inx<languages.length; inx++) {
	    		langs.language.push(languages[inx].language);
	    	}
	    	console.log(langs);
	    	results.push(langs);
	    }
	});  
	
	connectData.query(
			"select distinct MG.genre as genre" +
			" from Movie_genres MG" +
			" where MG.Mid = " + id, 
			 function(err, genres) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var gens = {genre:[]};
	    	for ( var inx=0; inx<genres.length; inx++) {
	    		gens.genre.push(genres[inx].genre);
	    	}
	    	console.log(gens);
	    	results.push(gens);
	    }
	}); 
	
	connectData.query(
			"select distinct KI.keywords as keyword" +
			" from Keyword_ID_Search KI" +
			" where KI.Mid = " + id, 
			 function(err, keywords) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var keys = {keyword:[]};
	    	for ( var inx=0; inx<keywords.length; inx++) {
	    		keys.keyword.push(keywords[inx].keyword);
	    	}
	    	console.log(keys);
	    	results.push(keys);
	    }
	}); 
	
	connectData.query(
			"select P.name as name" +
			" from Crew C inner join Person P on C.personId=P.personId" +
			" where C.job='Director' and C.movieId = " + id, 
			 function(err, directors) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var dirs = {director_name:[]};
	    	for ( var inx=0; inx<directors.length; inx++) {
	    		dirs.director_name.push(directors[inx].name);
	    	}
	    	console.log(dirs);
	    	results.push(dirs);
	    }
	}); 
	
	connectData.query(
			"select P.name as name" +
			" from Cast C inner join Person P on C.Pid=P.personId" +
			" where C.order <= 1 and C.Mid = " + id, 
			 function(err, actors) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	var acts = {actor_name:[]};
	    	for ( var inx=0; inx<actors.length; inx++) {
	    		acts.actor_name.push(actors[inx].name);
	    	}
	    	console.log(acts);
	    	results.push(acts);
	    	
	    	//return results at the end for callback
	    	output_single_movie(res, req, results);
	    }
	});
	
}

function query_single_crew(req, res , id) {
	connectData.query(
			"select temp.name as name, temp.profile as profile, temp.birth as birth, temp.death as death, temp.biography as biography, M.Mid as movieid, M.title as title, M.poster as poster" +
			" from Movie M right join" +
			" (select P.name as name, P.profile as profile, P.dayofbirth as birth, P.dayofdeath as death, P.biography as biography, C.movieId as mid" +
			" from Person P inner join Crew C on P.personId=C.personId" +
			" where P.personId = " + id + " group by C.movieId) temp on temp.mid = M.Mid",	
			 function(err, results) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	console.log("single_crew results");
	    	console.log(results);
	    	output_single_crew(res, req, results);
	    }

	}); 
}

function query_single_cast(req, res , id) {
	connectData.query(
			"select temp.name as name, temp.profile as profile, temp.birth as birth, temp.death as death, temp.biography as biography, M.Mid as movieid, M.title as title, M.poster as poster" +
			" from Movie M right join" +
			" (select P.name as name, P.profile as profile, P.dayofbirth as birth, P.dayofdeath as death, P.biography as biography, C.Mid as mid" +
			" from Person P inner join Cast C on P.personId=C.Pid" +
			" where P.personId = " + id + " group by C.Mid) temp on temp.mid = M.Mid",	
			 function(err, results) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	console.log("single_cast results");
	    	console.log(results);
	    	output_single_cast(res, req, results);
	    }

	});  
}

function output_single_movie(res, req, results) {
	sess = req.session;
	console.log("Output Movie INFOS:");
	console.log(results);
	res.render('pop_movie.jade',
		   { results: results, state: sess }
	  );
}

function output_single_crew(res, req, results) {
	sess = req.session;
	res.render('pop_crew.jade',
		   { results: results, state: sess }
	  );
}

function output_single_cast(res, req, results) {
	sess = req.session;
	res.render('pop_cast.jade',
		   { results: results, state: sess }
	  );
}

exports.pop_movie = function(req, res){
		query_single_movie(req, res, req.query.id);
		console.log("pop movie");
		console.log(req.query.id);
		
		//record pop movie history when user logged in
		sess=req.session;
		if (sess) {
			if (sess.userid) {
				console.log(sess.username);
				connectData.query("INSERT into History(Movie_id, User_id) values ('" + req.query.id + "', '" + sess.userid + "')");
				console.log("history added");
			}
		}
};

exports.pop_crew = function(req, res){
		query_single_crew(req, res, req.query.id);
		console.log("pop crew");
		console.log(req.query.id);
};

exports.pop_cast = function(req, res){
		query_single_cast(req, res, req.query.id);
		console.log("pop cast");
		console.log(req.query.id);
};