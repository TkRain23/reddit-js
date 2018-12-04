const express = require('express')
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const expressValidator = require('express-validator')
const Post = require('./models/post')

require('dotenv').config()

require('./data/reddit-db')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // Add after body parser initialization!
app.use(cookieParser());



app.set('view engine', 'pug')

var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  next();
};

app.use(checkAuth);


require('./controllers/posts.js')(app);
require('./controllers/comments-controller.js')(app);
require('./controllers/auth.js')(app);

app.get('/', function (req, res) {
	var currentUser = req.user;

	Post.find({})
		.then(posts => {
			res.render("posts-index", {posts, currentUser});
		})
		.catch(err => {
			console.log(err.message);
		});
})

app.get('/posts/new', function (req,res) {
	var currentUser = req.user;
    res.render('posts-new', {currentUser});
})

// SUBREDDIT
app.get("/n/:subreddit", function(req, res) {
	var currentUser = req.user;
	Post.find({ subreddit: req.params.subreddit })
	.then(posts => {
		res.render("posts-index", { posts, currentUser });
	})
	.catch(err => {
		console.log(err);
	});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
