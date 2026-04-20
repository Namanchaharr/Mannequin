import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

import request from "supertest";
import app from "../app.js";
import { pool } from "../config/database.js";

describe("Auth Flow", () => {
  let token = "";
  const email = `test_${Date.now()}@test.com`;

  // Clean DB before tests
  beforeAll(async () => {
    await pool.query("TRUNCATE users RESTART IDENTITY CASCADE;");
  });

  afterAll(async () => {
    await pool.end();
  });

  it("should signup a user", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({
        email,
        password: "test123",
        username: "test"
      });

    expect(res.statusCode).toBe(201);
  });

  it("should login and return token", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email,
        password: "test123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

  it("should block protected route without token", async () => {
    const res = await request(app).get("/auth/protected");

    expect(res.statusCode).toBe(401);
  });

  it("should allow protected route with token", async () => {
    const res = await request(app)
      .get("/auth/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});