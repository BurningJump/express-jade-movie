var express = require('express');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(express);
var path = require('path');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var app = express();
var dbUrl = 'mongodb://localhost:27017/mymovie';
mongoose.connect(dbUrl);

app.set('views', './app/views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.cookieParser());
app.use(express.session({
    secret: 'imooc',
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));

if('development' === app.get('env')) {
    app.set('showStackError', true);
    app.use(express.logger(':mehtod :url :status'));
    app.locals.pretty = true;
    mongoose.set('debug', true);
}

require('./config/routes')(app);

app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');
app.listen(port);

console.log('express-jade start on port ' + port);
