import pool from "../config/database.js"; 

//query management for the auth module
export const createUser = async ({ email, password, username }) => {
  const result = await pool.query(
    `INSERT INTO users (email, password, username)
     VALUES ($1, $2, $3)
     RETURNING id, email, username`,
    [email, password, username]
  );

  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0];
};

export const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, email, username, profile_pic FROM users WHERE id = $1",
    [id]
  );

  return result.rows[0];
}; 