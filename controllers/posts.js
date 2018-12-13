const Post = require('../models/post');

module.exports = (app) => {

    // CREATE
    app.post("/posts", (req, res) => {
        if (req.user) {
            var post = new Post(req.body);
            post.author = req.user._id;

            post.save().then(post => {
                    return User.findById(req.user._id);
                })
                .then(user => {
                    user.posts.unshift(post);
                    user.save();
                    // REDIRECT TO THE NEW POST
                    res.redirect("/posts/" + post._id);
                })
                .catch(err => {
                    console.log(err.message);
                })

            post.save(function(err, post) {
                return res.redirect(`/`);
            });

        } else {
            return res.status(401); // UNAUTHORIZED
        }
    });

    // GET
    app.get("/post/:id", function(req, res) {
        console.log(req.user);
        var currentUser = req.user;
        // LOOK UP THE POST
        Post.findById(req.params.id).populate('comments').populate('author').then((post) => {
            res.render('post-show', {
                post,
                currentUser
            })
        }).catch((err) => {
            console.log(err.message)
        })
    });

    app.put("/posts/:id/vote-up", function(req, res) {
        Post.findById(req.params.id).exec(function(err, post) {
            post.upVotes.push(req.user._id);
            post.voteScore = post.voteTotal + 1;
            post.save();

            res.status(200);
        });
    });

    app.put("/posts/:id/vote-down", function(req, res) {
        Post.findById(req.params.id).exec(function(err, post) {
            post.downVotes.push(req.user._id);
            post.voteScore = post.voteTotal - 1;
            post.save();

            res.status(200);
        });
    });

};
