import express from "express";
import authRoute from "./routes/auth.route.js";

const app = express();
app.use(express.json());

// base route
app.use("/auth", authRoute);


export default app;