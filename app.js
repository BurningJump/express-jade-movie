var express = require('express');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var User = require('./models/user');
var _ = require('underscore');
var path = require('path');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost:27017/mymovie');

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.cookieParser());
app.use(express.session({
    secret: 'imooc'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');
app.listen(port);

console.log('express-jade start on port ' + port);

// index page
app.get('/', function(req, res) {
    console.log('user in session: ');
    console.log(req.session.user);
    Movie.fetch(function(err, movies) {
        if(err) {
            console.log(err);
        }

        res.render('index', {
            title: '首页',
            movies: movies,
        })    
    })
})

// signup
app.post('user/signup', function(req, res) {
    var _user = req.body.user;
    
    User.find({name: _user.name}, function(err, user) {
        if(err) {
            console.log(err);
        }
        
        if(user) {
            return res.redirect('/');
        } else {
            var user = new User(_user);
            user.save(function(err, user) {
                if(err) {
                    console.log(err);
                }
        
                res.redirect('/');
            })
        }
    })
})

// signin
app.post('user/signin', function(req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({name: name}, function(err, user) {
        if(err) {
            console.log(err);
        }

        if(!user) {
            return res.redirect('/');
        }

        user.comparePassword(password, function(err, isMatch) {
            if(err) {
                console.log(err);
            }

            if(isMatch) {
                req.session.user = user;
                return res.redirect('/'); 
            } else {
                console.log('Password is not matched');
            }
        })
    })
})

// userList page
app.get('/admin/userList', function (req, res) {
    User.fetch(function (err, users) {
        if (err) {
            console.log(err);
        }

        res.render('userList', {
            title: '用户列表',
            users: users,
        })
    })
})

// detail page
app.get('/movie/:id', function(req, res) {
    var id = req.params.id;

    Movie.findById(id, function(err, movie) {
        res.render('detail', {
            title: '详情页' + movie.title,
            movie: movie
        })    
    })
})

// admin page
app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: '后台录入页',
        movie: {
            title: '',
            director: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
})

// admin update movie
app.get('/admin/update/:id', function(req, res) {
    var id = req.params.id;

    if(id) {
        Moive.findById(id, function(err, movie) {
            res.render('admin', {
                title: '后台更新页',
                movie: movie
            })
        })
    }
})

// admin post movie
app.post('/admin/movie/new', function(req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if(id !== 'undefined') {
        Movie.findById(id, function(err, movie) {
            if(err) {
                console.log(err);
            }

            _movie = _.extend(movie, movieObj);
            _movie.save(function(err, movie) {
                if(err) {
                    console.log(err);
                }

                res.redirect('/movie/' + movie._id)
            })
        })
    } else {
        _movie = new Movie({
            director: movieObj.director,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash,
        })

        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }

            res.redirect('/movie/' + movie._id)
        })
    }
})

// list page
app.get('/admin/list', function(req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }

        res.render('list', {
            title: '列表页',
            movies: movies,
        })
    })    
})

// list delete movie
app.delete('/admin/list', function(req, res) {
    var id = req.query.id;

    if(id) {
        Movie.remove({_id: id}, function(err, movie) {
            if(err) {
                console.log(err);
            } else {
                res.json({success: 1});
            }
        })
    }
})

