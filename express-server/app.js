import express from "express";
import authRoute from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
// base route
app.use("/auth", authRoute);
app.use("/posts", postRoutes);


export default app;