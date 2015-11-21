/**
 * Final Project for CIS 550 --- Yelpus
 * 
 * zives
 */

/**
 * Module dependencies.
 */
var express = require('express')
  , session = require('express-session')
  , routes = require('./routes')
  , events = require('./routes/events')
  , eventpop = require('./routes/eventpop')
  , choose_event = require('./routes/choose_event')
  , save_event = require('./routes/save_event')
  , groups = require('./routes/groups') 
  , groups_info= require('./routes/groups_info') 
  , groups_insert= require('./routes/groups_insert')
  , choose_groups = require('./routes/choose_groups')
  , get_places= require('./routes/get_places') 
  , maps= require('./routes/maps')
  , friends= require('./routes/friends') 
  , login = require('./routes/login')
  , recommend = require('./routes/recommend')
  , event_history = require('./routes/event_history')
  , current_location = require('./routes/current_location')
  , http = require('http')
  , path = require('path')
  , stylus =  require("stylus")
  , nib =     require("nib")
;

// Initialize express
var app = express();
init_app(app);

app.get('/',login.display);
app.post('/authenticate', login.auth);
app.get('/testsession', login.test_sess);
app.get('/signup', login.disp_signup);
app.post('/signup', login.signup);
app.get('/events', events.do_work);
app.get('/eventpop', eventpop.do_work);
app.get('/choose_event', choose_event.do_work);
app.post('/choose_event', choose_event.do_work);
app.get('/groups_info', groups_info.do_work);
app.get('/groups', groups.do_work);
app.get('/choose_groups', choose_groups.do_work);
app.get( '/friends', friends.do_work);
app.get('/maps',maps.do_work);
app.post('/groups_insert' , groups_insert.do_work);
app.post('/get_places' , recommend.getprefer);
app.get('/save_event',save_event.do_work);
app.get('/insert_events',save_event.save_events);
app.post('/event_history',event_history.do_work);
app.get('/logout', login.logout);
app.get('/current_location', current_location.do_work);

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
	app.use(session({secret: 'yeplus' , 
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