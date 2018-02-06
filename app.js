var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var app = express();
var fs = require('fs');
var dbUrl = 'mongodb://localhost:27017/mymovie';
mongoose.connect(dbUrl);

// models loading
var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs
        .readdirSync(path)
        .forEach(function(file) {
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);

            if(stat.isFile()) {
                if(/(.*)\.(js|coffee)/.test(file)) {
                    require(newPath);
                }
            } else if(stat.isDirectory()) {
                walk(newPath);
            }
        })
}
walk(models_path);

app.set('views', './app/views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.multipart());
app.use(session({
    secret: 'imooc',
    store: new MongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));

require('./config/routes')(app);

if('development' === app.get('env')) {
    app.set('showStackError', true);
    app.use(morgan(':method :url :status'));
    app.locals.pretty = true;
    mongoose.set('debug', true);
}


app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');
app.listen(port);

console.log('express-jade start on port ' + port);
