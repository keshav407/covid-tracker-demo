var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var routes = require('./routes');
var app = express();
var cors = require('cors');
var helmet = require('helmet');
var { port, env, logs, mongo} = require('./config/vars');

app.use(logger(logs));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(express.static(path.join(__dirname, "public")));


// define routes
app.use('/', routes);

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


mongoose.connect(
  mongo.uri,
  { keepAlive: 1, useNewUrlParser: true, useFindAndModify: false },
  err => {
    if (!err) console.log("Db connection successful!");
    if (err) console.log(err);
  }
);

// listen to requests
app.listen(port, () => console.log(`server started on port ${port} (${env})`));

/**
* Exports express
* @public
*/
module.exports = app;