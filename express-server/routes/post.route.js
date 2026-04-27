import express from "express";
import { createPostController, getPostsByUserIdController, getAllPostsController } from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const postRoutes = express.Router();

// Create post (protected)
postRoutes.post("/", authMiddleware, createPostController);
postRoutes.get("/", getAllPostsController);
postRoutes.get("/:userId", getPostsByUserIdController);

export default postRoutes;