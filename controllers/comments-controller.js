const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports = function(app) {
    // CREATE Comment
    app.post("/posts/:postId/comments", function(req, res) {
        // INSTANTIATE INSTANCE OF MODEL
        console.log(req.user);
        const comment = new Comment(req.body);

        // SAVE INSTANCE OF Comment MODEL TO DB
        comment
            .save()
            .then(comment => {
                return Post.findOne({
                    _id: req.params.postId
                });
            })
            .then(post => {
                post.comments.unshift(comment);
                return post.save();
            })
            .then(post => {
                res.redirect(`/`);
            })
            .catch(err => {
                console.log(err);
            });
    });

    app.post("/posts/:postId/comments/:commentId", function(req, res) {
        Comment
            .create(req.body)
            .then(newComment => {
                Comment.findOne({_id:req.params.commentId}).then(parentComment => {
                    parentComment.replies.push(newComment._id)
                    parentComment.save()
                    console.log(req.params.postId)
                    res.redirect(`/post/${req.params.postId}`)
                })
            })
    })
};
