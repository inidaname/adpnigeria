const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('handlebars');
const mongoose = require('mongoose');
const compression = require('compression');
const subdomain = require('express-subdomain-handler');
const session = require('express-session');
const path = require('path');
const fetch = require('node-fetch');
const logger = require('morgan');
const methodoverride = require('method-override');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const favicon = require('serve-favicon');
const sassMiddleware = require('node-sass-middleware');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')
const expressSanitizer = require('express-sanitizer');
var db = require('./db');

// const bootstrap = require('bootstrap');

require('dotenv').config({path: "keys.env"});

var indexController = require('./controllers/indexController');
var aboutController = require('./controllers/aboutController');
var structureController = require('./controllers/structureController');
var contactController = require('./controllers/contactController');
var registerController = require('./controllers/registerController');
var payController = require('./controllers/payController');
var dashboardController = require('./controllers/dashboardController');
var donateController = require('./controllers/donateController');
var loginController = require('./controllers/loginController');
var statesController = require('./controllers/statesController');


const app = express();


app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
	next();
});

app.use(cookieSession({
  name: 'session',
  keys: [process.env.key1, process.env.key2],
  cookie: { domain: '.lvh.me', maxAge: 100000000000 }
}))
// app.use(session({
// 	secret: process.env.secretKey,
// 	resave: false,
// 	saveUninitialized: true,
// 	cookie: { secure: true }
// }))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('trust proxy', 1) // trust first proxy

app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressSanitizer());
app.use(cookieParser());

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));


app.use(subdomain({
	baseUrl: 'lvh.me',
	prefix: 'myprefix',
	logger: true
}));

app.use(express.static(__dirname + '/public'));
// app.use(methodoverride('_method'));
app.use('/', indexController);
app.use('/about', aboutController);
app.use('/structure', structureController);
app.use('/contact', contactController);
app.use('/register', registerController);
app.use('/pay', payController);
app.use('/myprefix', dashboardController);
app.use('/donate', donateController);
app.use('/login', loginController);
app.use('/states', statesController);
app.use('/state', statesController);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
	// set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get('env') === 'development' ? err : {};

   // render the error page
   res.status(err.status || 500);
   res.render('error');
});

module.exports = app;

// app.listen(5000, function () {
//   console.log(`Server Starts on port 5000`);
// });
