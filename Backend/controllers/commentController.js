let comments = [];

const addComment = (req, res) => {

  const comment = req.body;
  comments.push(comment);

  res.json({
    message: "Comment added",
    comment
  });

};

const getComments = (req, res) => {
  res.json(comments);
};

module.exports = {
  addComment,
  getComments
};