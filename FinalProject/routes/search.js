var mysql = require('mysql');

var connectData = mysql.createConnection({ 
  host: "", 
  user: "", 
  password: "", 
  database: "" });


function query_db_movie(req, res , movie_title) {
	connectData.query(
			"select distinct M.Mid as id, M.title as title, M.poster as poster from Movie M where title like '%" + movie_title + "%'", 
			 function(err, results) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	console.log("Database connection closed.");
	    	output_upcome_movie(req, res, results);
	    }

	});  // end database connection
}

function query_db_crew(req, res , crew_name) {
	connectData.query(
			"select distinct P.personId as id, P.name as name, P.profile as profile from Person P inner join Crew C on P.personId=C.personId where P.name like '%" + crew_name + "%'", 
			 function(err, results) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	console.log("Database connection closed.");
	    	output_upcome_crew(req, res, results);

	    }

	});  // end database connection
}

function query_db_cast(req, res , cast_name) {
	connectData.query(
			"select distinct P.personId as id, P.name as name, P.profile as profile from Person P inner join Cast C on P.personId=C.Pid where P.name like '%" + cast_name + "%'", 
			 function(err, results) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	console.log("Database connection closed.");
	    	output_upcome_cast(req, res, results);
	    }

	});  // end database connection
}

function query_db_combo(req, res, movie_keyword, movie_genre, movie_rating, movie_language) {
	console.log(movie_keyword, movie_genre, movie_rating, movie_language);
	connectData.query(
			"select distinct M.Mid as id, M.title as title, M.poster as poster from Keyword_ID_Search K" +
			" inner join Movie M on M.Mid=K.Mid" +
			" inner join Movie_Language ML on ML.Mid=M.Mid" +
			" inner join Likes L on L.Mid=M.Mid" +
			" inner join Movie_genres MG on MG.Mid=M.Mid" +
			" where K.keywords like '%" + movie_keyword + "%' and L.rating>" + movie_rating + " and ML.englishname like '%" + movie_language + "%' and MG.genre like '%" + movie_genre + "%'", 
			 function(err, results) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	console.log(req.query.movie_keyword, req.query.movie_genre, req.query.movie_rating, req.query.movie_language);
	    	console.log("Database connection closed.");
	    	output_upcome_movie(req, res, results);

	    }

	}); 
}


function output_upcome_movie(req, res, results) {
	sess = req.session;
	console.log("search movie out");
	console.log(results);
	if (results.length != 0) {
		res.render('search_movie.jade',
				{ results: results, state: sess }
		);
	} else {
		res.render('search_movie.jade',
				{ title: "Sorry, no result found",  results: results, state: sess });
	}
}

function output_upcome_crew(req, res, results) {
	sess = req.session;
	console.log("search crew out");
	if (results.length != 0) {
		res.render('search_crew.jade',
				{ results: results, state: sess }
		);
	} else {
		res.render('search_crew.jade',
				{ title: "Sorry, no result found",  results: results, state: sess });
	}
}

function output_upcome_cast(req, res, results) {
	sess = req.session;
	console.log("search cast out");
	if (results.length != 0) {
		res.render('search_cast.jade',
				{ results: results, state: sess }
		);
	} else {
		res.render('search_cast.jade',
				{ title: "Sorry, no result found",  results: results, state: sess});
	}
}

exports.search_movie = function(req, res){
		console.log(req.query.movie_title);
		query_db_movie(req, res, req.query.movie_title);
};

exports.search_crew = function(req, res){
		query_db_crew(req, res, req.query.crew_name);
};

exports.search_cast = function(req, res){
		query_db_cast(req, res, req.query.cast_name);
	
};

exports.search_combo = function(req, res){
		console.log(req.query.movie_keyword, req.query.movie_genre, req.query.movie_rating, req.query.movie_language);
		query_db_combo(req, res, req.query.movie_keyword, req.query.movie_genre, req.query.movie_rating, req.query.movie_language);
};

exports.movie_page = function(req, res){
	sess = req.session;
	res.render('movie_page.jade', {state : sess});
}

exports.cast_page = function(req, res){
	sess = req.session;
	res.render('cast_page.jade', {state : sess});
}

exports.crew_page = function(req, res){
	sess = req.session;
	res.render('crew_page.jade', {state : sess});
}