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

require('./controllers/posts.js')(app);
require('./controllers/comments-controller.js')(app);
require('./controllers/auth.js')(app);

app.set('view engine', 'pug')

app.get('/', function (req, res) {
	Post.find({})
		.then(posts => {
			res.render("posts-index", {posts});
		})
		.catch(err => {
			console.log(err.message);
		});
})

app.get('/posts/new', function (req,res) {
    res.render('posts-new')
})

// SUBREDDIT
app.get("/n/:subreddit", function(req, res) {
	Post.find({ subreddit: req.params.subreddit })
	.then(posts => {
		res.render("posts-index", { posts });
	})
	.catch(err => {
		console.log(err);
	});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
