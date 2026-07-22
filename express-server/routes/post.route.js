import express from "express";
import {
  createPostController,
  getPostsByUserIdController,
  getAllPostsController,
  getPostByIdController,
  updatePostController,
  deletePostController,
} from "../controllers/post.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validatePostOwnership } from "../middlewares/validatePostOwnership.js";

const postRoutes = express.Router();

// Create post (protected)
postRoutes.post("/", authMiddleware, createPostController);

postRoutes.get("/", getAllPostsController);

postRoutes.get("/user/:userId", getPostsByUserIdController);

postRoutes.get("/:id", getPostByIdController);

postRoutes.patch("/:id", authMiddleware, validatePostOwnership, updatePostController);

postRoutes.delete("/:id", authMiddleware, validatePostOwnership, deletePostController);

export default postRoutes;