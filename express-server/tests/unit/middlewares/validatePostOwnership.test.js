import { jest } from "@jest/globals";

// -------------------- Mock Model --------------------

jest.unstable_mockModule("../../../models/post.model.js", () => ({
  getPostById: jest.fn(),
}));

const { getPostById } = await import(
  "../../../models/post.model.js"
);

const { validatePostOwnership } = await import(
  "../../../middlewares/validatePostOwnership.js"
);

// -------------------- Helpers --------------------

const mockResponse = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};

// -------------------- Console Spy --------------------

let consoleErrorSpy;

beforeAll(() => {
  consoleErrorSpy = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});
});

afterAll(() => {
  consoleErrorSpy.mockRestore();
});

beforeEach(() => {
  jest.clearAllMocks();
  consoleErrorSpy.mockClear();
});

describe("validatePostOwnership", () => {
  it("should return 404 when post does not exist", async () => {
    getPostById.mockResolvedValue(null);

    const req = {
      params: {
        id: "1",
      },
      user: {
        userId: 10,
      },
    };

    const res = mockResponse();
    const next = jest.fn();

    await validatePostOwnership(req, res, next);

    expect(getPostById).toHaveBeenCalledWith("1");

    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.json).toHaveBeenCalledWith({
      error: "Post not found",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should return 403 when user is not the owner", async () => {
    getPostById.mockResolvedValue({
      id: 1,
      user_id: 20,
    });

    const req = {
      params: {
        id: "1",
      },
      user: {
        userId: 10,
      },
    };

    const res = mockResponse();
    const next = jest.fn();

    await validatePostOwnership(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);

    expect(res.json).toHaveBeenCalledWith({
      error: "Not authorized to edit this post",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() when user owns the post", async () => {
    getPostById.mockResolvedValue({
      id: 1,
      user_id: 10,
    });

    const req = {
      params: {
        id: "1",
      },
      user: {
        userId: 10,
      },
    };

    const res = mockResponse();
    const next = jest.fn();

    await validatePostOwnership(req, res, next);

    expect(getPostById).toHaveBeenCalledWith("1");

    expect(next).toHaveBeenCalledTimes(1);

    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 500 when database throws an error", async () => {
    getPostById.mockRejectedValue(
      new Error("Database error")
    );

    const req = {
      params: {
        id: "1",
      },
      user: {
        userId: 10,
      },
    };

    const res = mockResponse();
    const next = jest.fn();

    await validatePostOwnership(req, res, next);

    expect(console.error).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to validate post",
    });

    expect(next).not.toHaveBeenCalled();
  });
});