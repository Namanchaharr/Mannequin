import express from "express";
import userRoute from "./routes/user.route.js";

const app = express();
app.use(express.json());

// base route
app.use("/users", userRoute);


export default app;