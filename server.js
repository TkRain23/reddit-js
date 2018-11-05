const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const expressValidator = require('express-validator')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // Add after body parser initialization!

require('./controllers/posts.js')(app);
require('./data/reddit-db')



//server.js
var mongoose = require('mongoose');
// Mongoose Connection
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/reddit-clone";
mongoose.connect(
	mongoUri, { useNewUrlParser: true }
);
mongoose.set('debug', true);


app.set('view engine', 'pug')

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

app.get('/posts/new', function (req,res) {
    res.render('posts-new')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
