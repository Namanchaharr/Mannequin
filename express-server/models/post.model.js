import pool from "../config/database.js";


//query management for the post module
export const createPost = async ({ userId, imageUrl, caption }) => {
  const result = await pool.query(
    `INSERT INTO posts (user_id, image_url, caption)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, imageUrl, caption]
  );

  return result.rows[0];
};


//getting posts from the code
export const getAllPosts = async () => {
  const result = await pool.query(
`
   SELECT 
      p.id,
      p.image_url,
      p.caption,
      p.created_at,
      u.id AS user_id,
      u.username,
      u.profile_pic
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `
  );

  return result.rows;
};


export const getPostsByUser = async (userId) => {
  const result = await pool.query(
  `
    SELECT 
      p.id,
      p.image_url,
      p.caption,
      p.created_at,
      u.id AS user_id,
      u.username,
      u.profile_pic
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.user_id = $1
    ORDER BY p.created_at DESC
    `,
    [userId]
  );

  return result.rows;
};