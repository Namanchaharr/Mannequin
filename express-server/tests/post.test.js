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
    await pool.query("TRUNCATE users, posts RESTART IDENTITY CASCADE;");
    
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
          caption: "test post"
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.image_url).toBeDefined();
      expect(res.body.user_id).toBeDefined();

      userId = res.body.user_id;
    });

    it("should fail without token", async () => {
      const res = await request(app)
        .post("/posts")
        .send({
          image_url: "https://picsum.photos/500"
        });

      expect(res.statusCode).toBe(401);
    });

    it("should fail if image_url is missing", async () => {
      const res = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          caption: "no image"
        });

      expect(res.statusCode).toBe(400);
    });
  });

  // ---------------- GET POSTS ----------------
  describe("Get Posts", () => {
    it("should return all posts", async () => {
      const res = await request(app).get("/posts");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("should return posts by userId", async () => {
      const res = await request(app).get(`/posts/${userId}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].user_id).toBe(userId);
    });

    it("should return empty array for user with no posts", async () => {
      const res = await request(app).get("/posts/9999");

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  });
});