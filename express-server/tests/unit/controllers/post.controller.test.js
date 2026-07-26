import { jest } from "@jest/globals";

jest.unstable_mockModule("../../../models/post.model.js", () => ({
  createPost: jest.fn(),
  getAllPosts: jest.fn(),
  getPostsByUser: jest.fn(),
  getPostById: jest.fn(),
  updatePost: jest.fn(),
  replacePostLinks: jest.fn(),
  deletePost: jest.fn(),
}));

const {
  createPost,
  getAllPosts,
  getPostsByUser,
  getPostById,
  updatePost,
  replacePostLinks,
  deletePost,
} = await import("../../../models/post.model.js");

const {
  createPostController,
  getAllPostsController,
  getPostsByUserIdController,
  getPostByIdController,
  updatePostController,
  deletePostController,
} = await import("../../../controllers/post.controller.js");

const mockResponse = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};

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
});

describe("createPostController", () => {
  it("should return 400 when image_url is missing", async () => {
    const req = {
      body: {},
      user: { userId: 1 },
    };

    const res = mockResponse();

    await createPostController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "image_url is required",
    });
  });

  it("should create a post", async () => {
    const post = {
      id: 1,
      caption: "hello",
    };

    createPost.mockResolvedValue(post);

    const req = {
      body: {
        image_url: "image.jpg",
        caption: "hello",
        links: [],
      },
      user: {
        userId: 5,
      },
    };

    const res = mockResponse();

    await createPostController(req, res);

    expect(createPost).toHaveBeenCalledWith({
      userId: 5,
      imageUrl: "image.jpg",
      caption: "hello",
      links: [],
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(post);
  });

  it("should return 500 when createPost throws", async () => {
    createPost.mockRejectedValue(new Error("DB"));

    const req = {
      body: {
        image_url: "image.jpg",
      },
      user: {
        userId: 1,
      },
    };

    const res = mockResponse();

    await createPostController(req, res);

    expect(console.error).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to create post",
    });
  });
});

describe("getAllPostsController", () => {
  it("should return all posts", async () => {
    const posts = [{ id: 1 }];

    getAllPosts.mockResolvedValue(posts);

    const req = {};
    const res = mockResponse();

    await getAllPostsController(req, res);

    expect(getAllPosts).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(posts);
  });

  it("should return 500 on database error", async () => {
    getAllPosts.mockRejectedValue(new Error());

    const req = {};
    const res = mockResponse();

    await getAllPostsController(req, res);

    expect(console.error).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("getPostsByUserIdController", () => {
  it("should return 400 for invalid userId", async () => {
    const req = {
      params: {
        userId: "abc",
      },
    };

    const res = mockResponse();

    await getPostsByUserIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return posts for a user", async () => {
    const posts = [{ id: 1 }];

    getPostsByUser.mockResolvedValue(posts);

    const req = {
      params: {
        userId: "7",
      },
    };

    const res = mockResponse();

    await getPostsByUserIdController(req, res);

    expect(getPostsByUser).toHaveBeenCalledWith(7);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(posts);
  });

  it("should return 500 when model throws", async () => {
    getPostsByUser.mockRejectedValue(new Error());

    const req = {
      params: {
        userId: "1",
      },
    };

    const res = mockResponse();

    await getPostsByUserIdController(req, res);

    expect(console.error).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("getPostByIdController", () => {
  it("should return post", async () => {
    const post = {
      id: 1,
    };

    getPostById.mockResolvedValue(post);

    const req = {
      params: {
        id: "1",
      },
    };

    const res = mockResponse();

    await getPostByIdController(req, res);

    expect(getPostById).toHaveBeenCalledWith("1");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(post);
  });

  it("should return 404 when post does not exist", async () => {
    getPostById.mockResolvedValue(null);

    const req = {
      params: {
        id: "1",
      },
    };

    const res = mockResponse();

    await getPostByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return 500 on database error", async () => {
    getPostById.mockRejectedValue(new Error());

    const req = {
      params: {
        id: "1",
      },
    };

    const res = mockResponse();

    await getPostByIdController(req, res);

    expect(console.error).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500)
  });
});

describe("updatePostController", () => {
  it("should update a post without links", async () => {
    const updated = {
      id: 1,
      caption: "updated",
    };

    updatePost.mockResolvedValue();
    getPostById.mockResolvedValue(updated);

    const req = {
      params: {
        id: "1",
      },
      body: {
        caption: "updated",
      },
    };

    const res = mockResponse();

    await updatePostController(req, res);

    expect(updatePost).toHaveBeenCalled();

    expect(replacePostLinks).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it("should replace links when provided", async () => {
    updatePost.mockResolvedValue();

    replacePostLinks.mockResolvedValue();

    getPostById.mockResolvedValue({
      id: 1,
    });

    const req = {
      params: {
        id: "1",
      },
      body: {
        links: [
          {
            text: "GitHub",
            url: "https://github.com",
          },
        ],
      },
    };

    const res = mockResponse();

    await updatePostController(req, res);

    expect(replacePostLinks).toHaveBeenCalledWith(
      "1",
      req.body.links
    );
  });

  it("should return 500 when update fails", async () => {
    updatePost.mockRejectedValue(new Error());

    const req = {
      params: {
        id: "1",
      },
      body: {},
    };

    const res = mockResponse();

    await updatePostController(req, res);

    expect(console.error).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("deletePostController", () => {
  it("should delete a post", async () => {
    deletePost.mockResolvedValue({
      id: 1,
    });

    const req = {
      params: {
        id: "1",
      },
    };

    const res = mockResponse();

    await deletePostController(req, res);

    expect(deletePost).toHaveBeenCalledWith("1");

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      message: "Post deleted successfully",
    });
  });

  it("should return 404 when post does not exist", async () => {
    deletePost.mockResolvedValue(undefined);

    const req = {
      params: {
        id: "1",
      },
    };

    const res = mockResponse();

    await deletePostController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("should return 500 on database error", async () => {
    deletePost.mockRejectedValue(new Error());

    const req = {
      params: {
        id: "1",
      },
    };

    const res = mockResponse();

    await deletePostController(req, res);

    expect(console.error).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);
  });
});