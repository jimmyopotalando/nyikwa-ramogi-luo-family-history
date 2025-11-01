// backend/controllers/commentController.js
const Comment = require('../models/Comment');

exports.submitComment = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }

    const newComment = await Comment.create({ text: comment.trim() });

    res.status(201).json({
      message: 'Comment submitted successfully',
      comment: newComment
    });
  } catch (err) {
    console.error('Error submitting comment:', err.message);
    res.status(500).json({ message: 'Failed to submit comment' });
  }
};

