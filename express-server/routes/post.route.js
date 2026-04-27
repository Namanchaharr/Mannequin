import express from "express";
import { createPostController } from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const postRoutes = express.Router();

// Create post (protected)
postRoutes.post("/", authMiddleware, createPostController);

// Test route (optional)
postRoutes.get("/", (req, res) => {
  res.send("Posts route working");
});

export default postRoutes;