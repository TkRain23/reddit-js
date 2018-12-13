var Post = require("../models/post");
var Comment = require("../models/comment");
var User = require("../models/user");

module.exports = app => {
  // NEW REPLY
  app.get("/posts/:postId/comments/:commentId/replies/new", (req, res) => {
    let post;
    Post.findById(req.params.postId)
      .then(p => {
        post = p;
        return Comment.findById(req.params.commentId);
      })
      .then(comment => {
        var currentUser = req.user;
        console.log(currentUser)
        console.log(post)
        res.render("replies-new", { post, comment, currentUser });
      })
      .catch(err => {
        console.log(err.message);
      });
  });
}
