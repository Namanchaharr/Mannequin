import express from "express";
import {
  createPostController,
  getPostsByUserIdController,
  getAllPostsController,
  getPostByIdController,
  updatePostController,
} from "../controllers/post.controller.js";

import { authMiddleware} from "../middlewares/auth.middleware.js";
import { validatePostOwnership} from "../middlewares/validatePostOwnership.js";

const postRoutes = express.Router();

postRoutes.post("/", authMiddleware, createPostController);

postRoutes.get("/", getAllPostsController);

postRoutes.get("/user/:userId", getPostsByUserIdController);

postRoutes.get("/:id", getPostByIdController);

postRoutes.patch("/:id", authMiddleware, validatePostOwnership, updatePostController);

export default postRoutes;