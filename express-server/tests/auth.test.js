import request from "supertest";
import app from "../app.js";

describe("Auth Flow", () => {
  let token = "";
  const email = `test_${Date.now()}@test.com`; // avoid duplicates

  it("should signup a user", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({
        email,
        password: "123",
        username: "gari"
      });

    expect(res.statusCode).toBe(201);
  });

  it("should login and return token", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email,
        password: "123"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

  it("should block protected route without token", async () => {
    const res = await request(app).get("/users/protected");

    expect(res.statusCode).toBe(401);
  });

  it("should allow protected route with token", async () => {
    const res = await request(app)
      .get("/users/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});