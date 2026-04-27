import { createPost } from "../models/post.model.js";

export async function createPostController(req, res) {
  try {
    const { image_url, caption } = req.body;

    // validation
    if (!image_url) {
      return res.status(400).json({ error: "image_url is required" });
    }

    // from JWT middleware
    const userId = req.user.userId;

    // call model
    const post = await createPost({
      userId,
      imageUrl: image_url,
      caption,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
}