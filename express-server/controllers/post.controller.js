import {
  createPost,
  getAllPosts,
  getPostsByUser,
  getPostById,
  updatePost,
  replacePostLinks,
  deletePost,
} from "../models/post.model.js";

export async function createPostController(req, res) {
  try {
    const { image_url, caption, links = [] } = req.body;

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
      links,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
}

export async function getAllPostsController(req, res) {
  try {
    const posts = await getAllPosts();
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
}

export async function getPostsByUserIdController(req, res) {
  try {
    const userId = parseInt(req.params.userId, 10);

    // basic validation
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const posts = await getPostsByUser(userId);

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
}


export async function getPostByIdController(req, res) {
  try {
    const postId = req.params.id;

    const post = await getPostById(postId);

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    return res.status(200).json(post);

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to fetch post",
    });
  }
}


export async function updatePostController(req, res) {
  try {
    const postId = req.params.id;

    const {
      image_url,
      caption,
      links,
    } = req.body;

    await updatePost(postId, {
      imageUrl: image_url,
      caption,
    });

    if (links !== undefined) {
      await replacePostLinks(postId, links);
    }

    const updatedPost = await getPostById(postId);

    return res.status(200).json(updatedPost);

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to update post",
    });
  }
}

export async function deletePostController(req, res) {
  try {
    const postId = req.params.id;

    const deleted = await deletePost(postId);

    if (!deleted) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.status(200).json({
      message: "Post deleted successfully",
      post: deleted,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete post" });
  }
}