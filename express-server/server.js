import app from "./app.js";
import pool from "./config/database.js";

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    
    const res = await pool.query("SELECT NOW()");
    console.log(res.rows);    
    console.log("DB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

start();