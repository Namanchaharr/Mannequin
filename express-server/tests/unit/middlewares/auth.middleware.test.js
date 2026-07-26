import { jest } from "@jest/globals";

// -------------------- Mock JWT --------------------

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: jest.fn(),
  },
}));

const { default: jwt } = await import("jsonwebtoken");

const { authMiddleware } = await import(
  "../../../middlewares/auth.middleware.js"
);

// -------------------- Helpers --------------------

const mockResponse = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("authMiddleware", () => {
  it("should return 401 when authorization header is missing", () => {
    const req = {
      headers: {},
    };

    const res = mockResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      error: "No token provided",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 when token format is invalid", () => {
    const req = {
      headers: {
        authorization: "invalidtoken",
      },
    };

    const res = mockResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid token format",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 when token is invalid", () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const req = {
      headers: {
        authorization: "Bearer bad-token",
      },
    };

    const res = mockResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      "bad-token",
      process.env.JWT_SECRET
    );

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired token",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should attach decoded user to req.user", () => {
    const decoded = {
      userId: 1,
      role: "user",
    };

    jwt.verify.mockReturnValue(decoded);

    const req = {
      headers: {
        authorization: "Bearer valid-token",
      },
    };

    const res = mockResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      "valid-token",
      process.env.JWT_SECRET
    );

    expect(req.user).toEqual(decoded);

    expect(next).toHaveBeenCalledTimes(1);

    expect(res.status).not.toHaveBeenCalled();
  });

  it("should call next() exactly once for a valid token", () => {
    jwt.verify.mockReturnValue({
      userId: 10,
    });

    const req = {
      headers: {
        authorization: "Bearer token",
      },
    };

    const res = mockResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});