/**
 * Final Project: a movie database driven website
 */

/**
 * Module dependencies.
 */
var express = require('express')
  , session = require('express-session')
  , http = require('http')
  , path = require('path')
  , stylus =  require("stylus")
  , nib =     require("nib")
  , homepage = require('./routes/homepage')
  , search = require('./routes/search')
  , pop = require('./routes/pop')
  , quiz = require('./routes/quiz')
  , login = require('./routes/login')
  , bing = require('./routes/bing')
;

// Initialize express
var app = express();
init_app(app);

app.get('/', homepage.do_work);
app.get('/homepage',homepage.display);
app.post('/authenticate', login.auth);
app.get('/signup', login.disp_signup);
app.post('/signup', login.signup);
app.get('/signin', login.disp_signin);

app.post('/bing', bing.search);

app.get('/movie_page', search.movie_page);
app.get('/cast_page', search.cast_page);
app.get('/crew_page', search.crew_page);

app.get('/search_movie', search.search_movie);
app.get('/search_crew', search.search_crew);
app.get('/search_cast', search.search_cast);
app.get('/search_combo', search.search_combo);

app.get('/pop_movie', pop.pop_movie);
app.get('/pop_crew', pop.pop_crew);
app.get('/pop_cast', pop.pop_cast);

app.get('/quiz_info', quiz.quiz_info);
app.get('/quiz_displayQuestion', quiz.quiz_displayQuestion);
app.get('/quiz_getAnswer', quiz.quiz_getAnswer);

app.get('/logout', login.logout);

// Listen on the port we specify
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// This function compiles the stylus CSS files, etc.
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

// This is app initialization code
function init_app() {
	// all environments
	app.set('port', process.env.PORT || 8080);
	
	// Use Jade to do views
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	

	app.use(express.favicon());
	app.use(express.cookieParser());
	app.use(session({secret: 'mini TMDB' , //'yeplus'
	    saveUninitialized: true,
	    resave: true}));
	
	// Set the express logger: log to the console in dev mode
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	
	// Use Stylus, which compiles .styl --> CSS
	app.use(stylus.middleware(
	  { src: __dirname + '/public'
	  , compile: compile
	  }
	));
	app.use(express.static(path.join(__dirname, 'public')));

	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}

}