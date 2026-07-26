import { jest } from "@jest/globals";

jest.unstable_mockModule("../../../config/database.js", () => ({
  default: {
    query: jest.fn(),
  },
}));

const { default: pool } = await import("../../../config/database.js");

const {
  createPost,
  getAllPosts,
  getPostsByUser,
  getPostById,
  updatePost,
  replacePostLinks,
  deletePost,
} = await import("../../../models/post.model.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Post Model", () => {
  describe("createPost", () => {
    it("should create a post without links", async () => {
      const post = {
        id: 1,
        user_id: 10,
        image_url: "image.jpg",
        caption: "hello",
      };

      pool.query.mockResolvedValueOnce({
        rows: [post],
      });

      const result = await createPost({
        userId: 10,
        imageUrl: "image.jpg",
        caption: "hello",
        links: [],
      });

      expect(pool.query).toHaveBeenCalledTimes(1);

      expect(result).toEqual(post);
    });

    it("should create a post with links", async () => {
      const post = {
        id: 1,
        user_id: 10,
      };

      pool.query
        .mockResolvedValueOnce({
          rows: [post],
        })
        .mockResolvedValue({ rows: [] });

      await createPost({
        userId: 10,
        imageUrl: "image.jpg",
        caption: "caption",
        links: [
          {
            text: "GitHub",
            url: "https://github.com",
          },
          {
            text: "Portfolio",
            url: "https://portfolio.com",
          },
        ],
      });

      expect(pool.query).toHaveBeenCalledTimes(3);
    });

    it("should throw when database fails", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      await expect(
        createPost({
          userId: 1,
          imageUrl: "",
          caption: "",
        })
      ).rejects.toThrow("Database error");
    });
  });

  describe("getAllPosts", () => {
    it("should return posts with links attached", async () => {
      pool.query
        .mockResolvedValueOnce({
          rows: [
            {
              id: 1,
              caption: "hello",
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            {
              post_id: 1,
              text: "GitHub",
              url: "https://github.com",
            },
          ],
        });

      const result = await getAllPosts();

      expect(result).toEqual([
        {
          id: 1,
          caption: "hello",
          links: [
            {
              text: "GitHub",
              url: "https://github.com",
            },
          ],
        },
      ]);
    });

    it("should return empty array", async () => {
      pool.query
        .mockResolvedValueOnce({
          rows: [],
        })
        .mockResolvedValueOnce({
          rows: [],
        });

      expect(await getAllPosts()).toEqual([]);
    });

    it("should throw database errors", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      await expect(getAllPosts()).rejects.toThrow("Database error");
    });
  });

  describe("getPostsByUser", () => {
    it("should return posts for a user", async () => {
      pool.query
        .mockResolvedValueOnce({
          rows: [
            {
              id: 5,
              user_id: 2,
              caption: "post",
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [],
        });

      const result = await getPostsByUser(2);

      expect(result[0].user_id).toBe(2);
    });

    it("should return empty array", async () => {
      pool.query
        .mockResolvedValueOnce({
          rows: [],
        })
        .mockResolvedValueOnce({
          rows: [],
        });

      expect(await getPostsByUser(5)).toEqual([]);
    });

    it("should throw database errors", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      await expect(getPostsByUser(1)).rejects.toThrow("Database error");
    });
  });

  describe("getPostById", () => {
    it("should return post with links", async () => {
      pool.query
        .mockResolvedValueOnce({
          rows: [
            {
              id: 1,
              caption: "caption",
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            {
              text: "GitHub",
              url: "https://github.com",
            },
          ],
        });

      const result = await getPostById(1);

      expect(result.links).toHaveLength(1);
    });

    it("should return null when post does not exist", async () => {
      pool.query.mockResolvedValueOnce({
        rows: [],
      });

      expect(await getPostById(99)).toBeNull();
    });

    it("should throw database errors", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      await expect(getPostById(1)).rejects.toThrow("Database error");
    });
  });

  describe("updatePost", () => {
    it("should update a post", async () => {
      const updated = {
        id: 1,
        caption: "updated",
      };

      pool.query.mockResolvedValue({
        rows: [updated],
      });

      const result = await updatePost(1, {
        imageUrl: null,
        caption: "updated",
      });

      expect(result).toEqual(updated);
    });

    it("should return undefined when post does not exist", async () => {
      pool.query.mockResolvedValue({
        rows: [],
      });

      expect(
        await updatePost(50, {
          caption: "new",
        })
      ).toBeUndefined();
    });
  });

  describe("replacePostLinks", () => {
    it("should replace links", async () => {
      pool.query.mockResolvedValue({
        rows: [],
      });

      await replacePostLinks(1, [
        {
          text: "GitHub",
          url: "https://github.com",
        },
      ]);

      expect(pool.query).toHaveBeenCalledTimes(2);
    });

    it("should replace with empty links", async () => {
      pool.query.mockResolvedValue({
        rows: [],
      });

      await replacePostLinks(1, []);

      expect(pool.query).toHaveBeenCalledTimes(1);
    });
  });

  describe("deletePost", () => {
    it("should delete a post", async () => {
      const deleted = {
        id: 1,
      };

      pool.query.mockResolvedValue({
        rows: [deleted],
      });

      const result = await deletePost(1);

      expect(result).toEqual(deleted);
    });

    it("should return undefined when post does not exist", async () => {
      pool.query.mockResolvedValue({
        rows: [],
      });

      expect(await deletePost(100)).toBeUndefined();
    });

    it("should throw database errors", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      await expect(deletePost(1)).rejects.toThrow("Database error");
    });
  });
});