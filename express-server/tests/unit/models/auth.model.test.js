import { jest } from "@jest/globals";

// Mock database before importing the model
jest.unstable_mockModule("../../../config/database.js", () => ({
  default: {
    query: jest.fn(),
  },
}));

const { default: pool } = await import("../../../config/database.js");

const {
  createUser,
  findUserByEmail,
  findUserById,
} = await import("../../../models/auth.model.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Auth Model", () => {
  describe("createUser", () => {
    it("should create a new user", async () => {
      const mockUser = {
        id: 1,
        email: "test@test.com",
        username: "gari",
      };

      pool.query.mockResolvedValue({
        rows: [mockUser],
      });

      const result = await createUser({
        email: "test@test.com",
        hashedpassword: "hashedpassword123",
        username: "gari",
      });

      expect(pool.query).toHaveBeenCalledTimes(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO users"),
        ["test@test.com", "hashedpassword123", "gari"]
      );

      expect(result).toEqual(mockUser);
    });

    it("should throw when the database query fails", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      await expect(
        createUser({
          email: "test@test.com",
          hashedpassword: "hashedpassword123",
          username: "gari",
        })
      ).rejects.toThrow("Database error");
    });
  });

  describe("findUserByEmail", () => {
    it("should return a user when the email exists", async () => {
      const mockUser = {
        id: 1,
        email: "test@test.com",
        username: "gari",
        password: "hashedpassword",
      };

      pool.query.mockResolvedValue({
        rows: [mockUser],
      });

      const result = await findUserByEmail("test@test.com");

      expect(pool.query).toHaveBeenCalledTimes(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM users"),
        ["test@test.com"]
      );

      expect(result).toEqual(mockUser);
    });

    it("should return undefined when no user exists", async () => {
      pool.query.mockResolvedValue({
        rows: [],
      });

      const result = await findUserByEmail("missing@test.com");

      expect(result).toBeUndefined();
    });

    it("should throw when the database query fails", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      await expect(
        findUserByEmail("test@test.com")
      ).rejects.toThrow("Database error");
    });
  });

  describe("findUserById", () => {
    it("should return a user when the id exists", async () => {
      const mockUser = {
        id: 1,
        email: "test@test.com",
        username: "gari",
        profile_pic: null,
      };

      pool.query.mockResolvedValue({
        rows: [mockUser],
      });

      const result = await findUserById(1);

      expect(pool.query).toHaveBeenCalledTimes(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE id = $1"),
        [1]
      );

      expect(result).toEqual(mockUser);
    });

    it("should return undefined when no user exists", async () => {
      pool.query.mockResolvedValue({
        rows: [],
      });

      const result = await findUserById(999);

      expect(result).toBeUndefined();
    });

    it("should throw when the database query fails", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      await expect(findUserById(1)).rejects.toThrow("Database error");
    });
  });
});