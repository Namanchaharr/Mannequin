CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  google_id TEXT UNIQUE,
  username TEXT NOT NULL,
  profile_pic TEXT,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin')) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email); 

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE post_tags (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag TEXT NOT NULL
);



CREATE INDEX idx_posts_user_id ON posts(user_id);