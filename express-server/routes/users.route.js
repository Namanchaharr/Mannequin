import express from "express";
import {
  getUserByIdController,
} from "../controllers/user.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRoutes = express.Router();

// Create user (protected)

userRoutes.get("/:id", getUserByIdController);

export default userRoutes;