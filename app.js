var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Zips REST API resource end-point
 * @endpoint /zips
 * @name apiZips
 * @version v1
 * @since v1
 * @description Zips REST API resource end-point
 */
app.use('/v1/zips', require('./routes/zips'));

module.exports = app;
