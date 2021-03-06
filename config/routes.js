var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function(app) {
    //pre handle user
    app.use(function (req, res, next) {
        var _user = req.session.user;
        app.locals.user = _user;
    
        next();
    });

    // Index page
    app.get('/', Index.index);

    // user
    app.post('/user/signup', User.signup);
    app.post('/user/signin', User.signin);
    app.get('/logout', User.logout);
    app.get('/signin', User.showSignin);
    app.get('/signup', User.showSignup);
    app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);

    // Movie
    app.get('/movie/:id', Movie.detail);
    app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
    app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
    app.post('/admin/movie', multipartMiddleware, User.signinRequired, User.adminRequired, Movie.savePoster, Movie.save);
    app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
    app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del);

    //comment
    app.post('/user/comment', User.signinRequired, Comment.save);
    
    // category
    app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
    app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
    app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);

    // results
    app.get('/results', Index.search);
}
