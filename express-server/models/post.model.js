import pool from "../config/database.js";

export const createPost = async ({ userId, imageUrl, caption }) => {
  const result = await pool.query(
    `INSERT INTO posts (user_id, image_url, caption)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, imageUrl, caption]
  );

  return result.rows[0];
};