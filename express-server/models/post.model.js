import pool from "../config/database.js";


//query management for the post module
export const createPost = async ({
  userId,
  imageUrl,
  caption,
  links = []
}) => {
  const result = await pool.query(
    `INSERT INTO posts (user_id, image_url, caption)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, imageUrl, caption]
  );

  const post = result.rows[0];

  //adding specific links to the posts
  for (const link of links) {
    await pool.query(
      `INSERT INTO post_links (post_id, text, url)
       VALUES ($1, $2, $3)`,
      [post.id, link.text, link.url]
    );
  }

  return post;
};

//getting posts from the code it also using left join to connect values from post -> the links so all the links can be fetched
export const getAllPosts = async () => {
  // Get all posts with user info
  const postsResult = await pool.query(`
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
  `);

  // Get all links
  const linksResult = await pool.query(`
    SELECT
      post_id,
      text,
      url
    FROM post_links
  `);

  // Attach links to each post  and ideally
  const posts = postsResult.rows.map(post => ({
    ...post,
    links: linksResult.rows
      .filter(link => link.post_id === post.id)
      .map(({ text, url }) => ({
        text,
        url
      }))
  }));

  return posts;
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

  const linksResult = await pool.query(
    `
    SELECT
      post_id,
      text,
      url
    FROM post_links
    `
  );

  const posts = result.rows.map(post => ({
    ...post,
    links: linksResult.rows
      .filter(link => link.post_id === post.id)
      .map(({ text, url }) => ({
        text,
        url
      }))
  }));

  return posts;
};