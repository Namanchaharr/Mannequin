import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

import request from "supertest";
import app from "../app.js";
import pool from "../config/database.js";
import { createTestUser } from "./helpers/auth.helper.js";

describe("Post Flow", () => {
  let token;
  let userId;

  beforeAll(async () => {
    await pool.query(
      "TRUNCATE users, posts, post_links RESTART IDENTITY CASCADE;"
    );

    const user = await createTestUser();
    token = user.token;
  });

  afterAll(async () => {
    await pool.end();
  });

  // ---------------- CREATE POST ----------------

  describe("Create Post", () => {
    it("should create a post with valid token", async () => {
      const res = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          image_url: "https://picsum.photos/500",
          caption: "test post",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.image_url).toBeDefined();
      expect(res.body.user_id).toBeDefined();

      userId = res.body.user_id;
    });

    it("should create a post with links", async () => {
      const res = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          image_url: "https://picsum.photos/500",
          caption: "post with links",
          links: [
            {
              text: "@john",
              url: "/users/john",
            },
            {
              text: "GitHub",
              url: "https://github.com/test",
            },
          ],
        });

      expect(res.statusCode).toBe(201);

      const links = await pool.query(
        "SELECT * FROM post_links WHERE post_id = $1",
        [res.body.id]
      );

      expect(links.rows.length).toBe(2);
    });

    it("should fail without token", async () => {
      const res = await request(app)
        .post("/posts")
        .send({
          image_url: "https://picsum.photos/500",
        });

      expect(res.statusCode).toBe(401);
    });

    it("should fail if image_url is missing", async () => {
      const res = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          caption: "no image",
        });

      expect(res.statusCode).toBe(400);
    });
  });

  // ---------------- GET POSTS ----------------

  describe("Get Posts", () => {
    it("should return all posts with correct structure", async () => {
      const res = await request(app).get("/posts");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);

      const post = res.body[0];

      expect(post).toHaveProperty("id");
      expect(post).toHaveProperty("image_url");
      expect(post).toHaveProperty("caption");
      expect(post).toHaveProperty("created_at");
      expect(post).toHaveProperty("user_id");
      expect(post).toHaveProperty("username");
      expect(post).toHaveProperty("profile_pic");

      expect(post).toHaveProperty("links");
      expect(Array.isArray(post.links)).toBe(true);
    });

    it("should return links in nested format", async () => {
      const res = await request(app).get("/posts");

      expect(res.statusCode).toBe(200);

      const postWithLinks = res.body.find(
        post => post.caption === "post with links"
      );

      expect(postWithLinks).toBeDefined();

      expect(postWithLinks.links).toEqual([
        {
          text: "@john",
          url: "/users/john",
        },
        {
          text: "GitHub",
          url: "https://github.com/test",
        },
      ]);
    });

    it("should return posts by userId", async () => {
      const res = await request(app).get(`/posts/${userId}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      const post = res.body[0];

      expect(post.user_id).toBe(userId);
      expect(post).toHaveProperty("links");
      expect(Array.isArray(post.links)).toBe(true);
    });

    it("should return empty array for user with no posts", async () => {
      const res = await request(app).get("/posts/9999");

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  });
});