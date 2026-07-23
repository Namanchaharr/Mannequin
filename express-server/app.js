import express from "express";
import authRoute from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import usersRoutes from "./routes/users.route.js";

const app = express();
app.use(express.json());

// base route
app.use("/auth", authRoute);
app.use("/posts", postRoutes);
app.use("/users", usersRoutes);

export default app;