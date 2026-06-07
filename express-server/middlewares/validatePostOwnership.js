import { getPostById } from "../models/post.model.js";

export async function validatePostOwnership(req, res, next) {
  try {
    const postId = req.params.id;

    const post = await getPostById(postId);

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    if (post.user_id !== req.user.userId) {
      return res.status(403).json({
        error: "Not authorized to edit this post",
      });
    }

    next();
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to validate post",
    });
  }
}