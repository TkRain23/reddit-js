const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const expressValidator = require('express-validator')
const Post = require('./models/post')

require('./data/reddit-db')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // Add after body parser initialization!

require('./controllers/posts.js')(app);

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
