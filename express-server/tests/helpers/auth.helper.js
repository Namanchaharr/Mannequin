import request from "supertest";
import app from "../../app.js";

export async function createTestUser() {
  const email = `test_${Date.now()}@test.com`;
  const password = "test123";

  await request(app).post("/auth/signup").send({
    email,
    password,
    username: "testuser"
  });

  const res = await request(app).post("/auth/login").send({
    email,
    password
  });

  return {
    token: res.body.token,
    email,
    password
  };
}