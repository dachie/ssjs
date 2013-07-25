var express = require('express');
var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');
var partials = require('express-partials');
var MongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');
var settings = require('./settings');

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(partials());
  app.use(express.favicon());
  //app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(flash());
  app.use(express.session({
    secret: settings.cookieSecret,
    store: new MongoStore({
      db: settings.db
    })
  }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);
});

app.configure('development', function() {
  app.use(express.errorHandler());
});
  

app.get('/', routes.index);
app.get('/recycle', routes.recycle);
app.get('/reg',routes.reg);
app.post('/reg',routes.doReg);
app.post('/create',routes.create);
app.get('/login',routes.login);
app.post('/login',routes.doLogin);
app.get('/logout',routes.logout);
app.get('/user',routes.user);
app.post('/user',routes.doUser);
app.get('/dachie',routes.dachie);
app.get('/cache',routes.cache);
app.get('*',routes.notfound);


http.createServer(app).listen("30000",function(){
	console.log("nodejs start");
});