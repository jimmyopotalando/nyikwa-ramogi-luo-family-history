import Comment from "../models/Comment.js";


// Submit a new comment
export const submitComment = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const newComment = new Comment({ text: comment.trim() });
    const savedComment = await newComment.save();

    res.status(201).json({
      message: "Comment submitted successfully",
      comment: {
        id: savedComment._id,
        text: savedComment.text,
        created_at: savedComment.createdAt,
      },
    });
  } catch (err) {
    console.error("❌ Error submitting comment:", err.message);
    res.status(500).json({ message: "Failed to submit comment" });
  }
};

// Fetch all comments
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error("❌ Error fetching comments:", err.message);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};
