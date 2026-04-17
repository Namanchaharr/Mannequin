import express from "express";
import { createUserController } from "../controllers/user.controller.js";

const userRoute = express.Router();

userRoute.post("/signup", createUserController);
userRoute.get("/", (req, res) => {
  res.send("Hello World");
});



export default userRoute;