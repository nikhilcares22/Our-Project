let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let morgan = require('morgan');
let middleware = require('./middleware');
let mongoose = require('mongoose')
require('./db/connect').configure(mongoose);
require('dotenv').config();
let constants = require('./constants/constants');
global.constants = constants;
global.ObjectId = mongoose.Types.ObjectId;

let apiRoutes = require('./routes/index');
const { string } = require('joi');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan(function (tokens, req, res) {
  let pattern = new RegExp('^/css', 'i')
  let result = pattern.test(tokens.url(req, res))
  if (!result) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
    ].join(' ');
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(middleware.success)
app.use(middleware.error)

app.use('/api', apiRoutes);

app.use(function (err, req, res, next) {//Validation error
  if (typeof err == 'string' && /^Validation Error/.test(err)) {
    return res.error(err, 422)
  }
  next(err);
})
app.use(function (err, req, res, next) {//other errors
  if (err.error) return res.error(err.error, err.statusCode)
  next();
})
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.messagfe;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
