const Post = require('../models/post');

module.exports = (app) => {

    // CREATE
    app.post('/posts/new', (req, res) => {
        // INSTANTIATE INSTANCE OF POST MODEL
        const post = new Post(req.body);
        console.log(req.body)
        // SAVE INSTANCE OF POST MODEL TO DB
        post.save((err, post) => {
            // REDIRECT TO THE ROOT
            console.log(err)
            console.log(req.body)
            return res.redirect(`/`);
        })
    });

    // GET
    app.get("/post/:id", function(req, res) {
        // LOOK UP THE POST
        Post.findById(req.params.id).populate('comments').then((post) => {
            res.render('post-show', {
                post
            })
        }).catch((err) => {
            console.log(err.message)
        })
    });

};
