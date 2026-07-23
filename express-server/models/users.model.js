import pool from "../config/database.js";

export const getusersById = async (id) => {
  const userResult = await pool.query(
    `
    SELECT 
    id, 
    email, 
    username, 
    profile_pic,
    role,
    created_at 
    FROM users 
    WHERE id = $1 
    `,
    [id]
  )
  
  return userResult.rows[0];
};
