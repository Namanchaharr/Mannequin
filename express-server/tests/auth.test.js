import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

import request from "supertest";
import app from "../app.js";
import pool from "../config/database.js";

describe("Auth Flow", () => {
  const email = `auth_${Date.now()}@test.com`;
  const password = "test123";
  let token = "";

  beforeAll(async () => {
    await pool.query("TRUNCATE users RESTART IDENTITY CASCADE;");
  });

  afterAll(async () => {
    await pool.end();
  });

  // ---------------- SIGNUP ----------------
  describe("Signup", () => {
    it("should signup a user", async () => {
      const res = await request(app)
        .post("/auth/signup")
        .send({
          email,
          password,
          username: "testuser"
        });

      expect(res.statusCode).toBe(201);
    });

    it("should not allow duplicate email signup", async () => {
      const res = await request(app)
        .post("/auth/signup")
        .send({
          email,
          password,
          username: "testuser"
        });

      expect(res.statusCode).toBe(400); // or 409 depending on your API
    });

    it("should fail if email is missing", async () => {
      const res = await request(app)
        .post("/auth/signup")
        .send({
          password,
          username: "testuser"
        });

      expect(res.statusCode).toBe(400);
    });

    it("should fail if password is missing", async () => {
      const res = await request(app)
        .post("/auth/signup")
        .send({
          email,
          username: "testuser"
        });

      expect(res.statusCode).toBe(400);
    });
  });

  // ---------------- LOGIN ----------------
  describe("Login", () => {
    it("should login and return token", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({
          email,
          password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();

      token = res.body.token;
    });

    it("should fail with wrong password", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({
          email,
          password: "wrongpassword"
        });

      expect(res.statusCode).toBe(401);
    });

    it("should fail for non-existent user", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({
          email: "nouser@test.com",
          password: "test123"
        });

      expect(res.statusCode).toBe(401);
    });
  });

  // ---------------- PROTECTED ----------------
  describe("Protected Route", () => {
    it("should block access without token", async () => {
      const res = await request(app).get("/auth/protected");

      expect(res.statusCode).toBe(401);
    });

    it("should allow access with valid token", async () => {
      const res = await request(app)
        .get("/auth/protected")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
    });

    it("should reject invalid token", async () => {
      const res = await request(app)
        .get("/auth/protected")
        .set("Authorization", "Bearer invalidtoken");

      expect(res.statusCode).toBe(401);
    });
  });
});