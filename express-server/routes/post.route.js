import express from "express";
import { createPostController, getPostsByUserIdController, getAllPostsController } from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const postRoutes = express.Router();

// Create post (protected)
postRoutes.post("/", authMiddleware, createPostController);
postRoutes.get("/", getAllPostsController);
postRoutes.get("/:userId", getPostsByUserIdController);
//need to create a delete post using the code in getPostsByUserIdController


export default postRoutes;