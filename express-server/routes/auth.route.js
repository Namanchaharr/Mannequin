import express from "express";
import { createUserController, loginController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const authRoute = express.Router();

authRoute.post("/signup", createUserController);
authRoute.post("/login", loginController);
authRoute.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});


authRoute.get("/", (req, res) => {
  res.send("Hello auth is working");
});



export default authRoute;