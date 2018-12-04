const Post = require('../models/post');

module.exports = (app) => {

    // // CREATE
    // app.post('/posts/new', (req, res) => {
    //
    //     // INSTANTIATE INSTANCE OF POST MODEL
    //     const post = new Post(req.body);
    //     console.log(req.body)
    //     // SAVE INSTANCE OF POST MODEL TO DB
    //     post.save((err, post) => {
    //         // REDIRECT TO THE ROOT
    //         console.log(err)
    //         console.log(req.body)
    //         return res.redirect(`/`);
    //     })
    // });

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
                post, currentUser
            })
        }).catch((err) => {
            console.log(err.message)
        })
    });

};
