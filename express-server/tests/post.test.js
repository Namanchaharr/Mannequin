import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

import request from "supertest";
import app from "../app.js";
import pool from "../config/database.js";
import { createTestUser } from "./helpers/auth.helper.js";

describe("Post Flow", () => {
  let token;
  let secondToken;
  let userId;
  let postId;

  beforeAll(async () => {
    await pool.query(
      "TRUNCATE users, posts, post_links RESTART IDENTITY CASCADE;"
    );

    const user = await createTestUser();
    token = user.token;

    const secondUser = await createTestUser(
      "other@test.com",
      "123",
      "otheruser"
    );

    secondToken = secondUser.token;
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
      postId = res.body.id;
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
  });

  // ---------------- GET POSTS BY USER ----------------

  describe("Get Posts By User", () => {
    it("should return posts by userId", async () => {
      const res = await request(app)
        .get(`/posts/user/${userId}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      const post = res.body[0];

      expect(post.user_id).toBe(userId);
      expect(post).toHaveProperty("links");
      expect(Array.isArray(post.links)).toBe(true);
    });

    it("should return empty array for user with no posts", async () => {
      const res = await request(app)
        .get("/posts/user/9999");

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  // ---------------- GET POST BY ID ----------------

  describe("Get Post By Id", () => {
    it("should return a single post", async () => {
      const res = await request(app)
        .get(`/posts/${postId}`);

      expect(res.statusCode).toBe(200);

      expect(res.body.id).toBe(postId);
      expect(res.body).toHaveProperty("image_url");
      expect(res.body).toHaveProperty("caption");
      expect(res.body).toHaveProperty("links");

      expect(Array.isArray(res.body.links)).toBe(true);
    });

    it("should return 404 if post does not exist", async () => {
      const res = await request(app)
        .get("/posts/9999");

      expect(res.statusCode).toBe(404);

      expect(res.body).toEqual({
        error: "Post not found",
      });
    });
  });

  // ---------------- UPDATE POST ----------------

  describe("Update Post", () => {
    it("should update caption", async () => {
      const res = await request(app)
        .patch(`/posts/${postId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          caption: "updated caption",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.caption).toBe("updated caption");
    });

    it("should update image", async () => {
      const res = await request(app)
        .patch(`/posts/${postId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          image_url: "https://picsum.photos/600",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.image_url).toBe(
        "https://picsum.photos/600"
      );
    });

    it("should replace links", async () => {
      const res = await request(app)
        .patch(`/posts/${postId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          links: [
            {
              text: "Updated",
              url: "https://updated.com",
            },
          ],
        });

      expect(res.statusCode).toBe(200);

      expect(res.body.links).toEqual([
        {
          text: "Updated",
          url: "https://updated.com",
        },
      ]);
    });

    it("should fail without token", async () => {
      const res = await request(app)
        .patch(`/posts/${postId}`)
        .send({
          caption: "hacked",
        });

      expect(res.statusCode).toBe(401);
    });

    it("should fail for non-owner", async () => {
      const res = await request(app)
        .patch(`/posts/${postId}`)
        .set(
          "Authorization",
          `Bearer ${secondToken}`
        )
        .send({
          caption: "hacked",
        });

      expect(res.statusCode).toBe(403);
    });

    it("should fail if post does not exist", async () => {
      const res = await request(app)
        .patch("/posts/9999")
        .set("Authorization", `Bearer ${token}`)
        .send({
          caption: "test",
        });

      expect(res.statusCode).toBe(404);
    });
  });
});