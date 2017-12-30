var express = require('express');
var path = require('path');
var cfenv = require('cfenv');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// var passport = require('passport');
var index = require('./api/index');
var authAPI = require('./api/auth_api');
// var users = require('./api/routes/users/users');
var config = require('./config/config');
var app = express();
var appEnv = cfenv.getAppEnv();
var port = appEnv.port,
publicDir = '../Client/dist';

// view engine setup
app.set('views', publicDir);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// // uncomment after placing your favicon in /public
// app.use(favicon(publicDir + '/images/favicon.ico'));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(publicDir));

// app.use(passport.initialize());

mongoose.connect(config.mongoDbUrl);

// require('./config/passport')(passport);

app.use('/', index);
app.use('/apmc/api', authAPI);
// app.use('/api/users', users);

// app.use(function(request,response) {
//   var data = '<h3>404 - Not Found</h3>';
//   response.writeHead(404,{'Content-Type' : 'text/html'});
//   response.end(data);
// });

var server = app.listen(port, function() {
  console.log('Server started on port : ' + server.address().port);
});


module.exports = app;
