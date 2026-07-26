import { jest } from "@jest/globals";

// -------------------- Mock Dependencies --------------------

jest.unstable_mockModule("../../../models/auth.model.js", () => ({
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
}));

jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hashSync: jest.fn(),
    compareSync: jest.fn(),
  },
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: jest.fn(),
  },
}));

// -------------------- Import Mocks --------------------

const { createUser, findUserByEmail } = await import(
  "../../../models/auth.model.js"
);

const { default: bcrypt } = await import("bcrypt");
const { default: jwt } = await import("jsonwebtoken");

const {
  createUserController,
  loginController,
} = await import("../../../controllers/auth.controller.js");

// -------------------- Helpers --------------------

const mockResponse = () => {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
};

// -------------------- Setup --------------------

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

// ==========================================================
// CREATE USER
// ==========================================================

describe("createUserController", () => {
  it("should return 400 if email is missing", async () => {
    const req = {
      body: {
        password: "password",
        username: "gari",
      },
    };

    const res = mockResponse();

    await createUserController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Missing fields",
    });
  });

  it("should return 400 if password is missing", async () => {
    const req = {
      body: {
        email: "test@test.com",
        username: "gari",
      },
    };

    const res = mockResponse();

    await createUserController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if username is missing", async () => {
    const req = {
      body: {
        email: "test@test.com",
        password: "password",
      },
    };

    const res = mockResponse();

    await createUserController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should create a user and return 201", async () => {
    bcrypt.hashSync.mockReturnValue("hashed-password");

    const user = {
      id: 1,
      email: "test@test.com",
      username: "gari",
    };

    createUser.mockResolvedValue(user);

    const req = {
      body: {
        email: "test@test.com",
        password: "password123",
        username: "gari",
      },
    };

    const res = mockResponse();

    await createUserController(req, res);

    expect(bcrypt.hashSync).toHaveBeenCalledWith(
      "password123",
      10
    );

    expect(createUser).toHaveBeenCalledWith({
      email: "test@test.com",
      hashedpassword: "hashed-password",
      username: "gari",
    });

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith(user);
  });

  it("should return 400 if email already exists", async () => {
    bcrypt.hashSync.mockReturnValue("hashed");

    createUser.mockRejectedValue({
      code: "23505",
    });

    const req = {
      body: {
        email: "test@test.com",
        password: "password",
        username: "gari",
      },
    };

    const res = mockResponse();

    await createUserController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      error: "Email already exists",
    });
  });

  it("should return 500 on unexpected error", async () => {
    bcrypt.hashSync.mockReturnValue("hashed");

    createUser.mockRejectedValue(
      new Error("Database exploded")
    );

    const req = {
      body: {
        email: "test@test.com",
        password: "password",
        username: "gari",
      },
    };

    const res = mockResponse();

    await createUserController(req, res);

    expect(console.error).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      error: "Internal server error",
    });
  });
});

// ==========================================================
// LOGIN
// ==========================================================

describe("loginController", () => {
  it("should return 400 if email is missing", async () => {
    const req = {
      body: {
        password: "password",
      },
    };

    const res = mockResponse();

    await loginController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 400 if password is missing", async () => {
    const req = {
      body: {
        email: "test@test.com",
      },
    };

    const res = mockResponse();

    await loginController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should return 401 if user does not exist", async () => {
    findUserByEmail.mockResolvedValue(undefined);

    const req = {
      body: {
        email: "test@test.com",
        password: "password",
      },
    };

    const res = mockResponse();

    await loginController(req, res);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid credentials",
    });
  });

  it("should return 401 if password is incorrect", async () => {
    findUserByEmail.mockResolvedValue({
      id: 1,
      password: "hashed",
    });

    bcrypt.compareSync.mockReturnValue(false);

    const req = {
      body: {
        email: "test@test.com",
        password: "wrong-password",
      },
    };

    const res = mockResponse();

    await loginController(req, res);

    expect(bcrypt.compareSync).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should login successfully", async () => {
    findUserByEmail.mockResolvedValue({
      id: 1,
      email: "test@test.com",
      username: "gari",
      password: "hashed",
      role: "user",
    });

    bcrypt.compareSync.mockReturnValue(true);

    jwt.sign.mockReturnValue("jwt-token");

    process.env.JWT_SECRET = "secret";
    process.env.JWT_EXPIRES_IN = "1h";

    const req = {
      body: {
        email: "test@test.com",
        password: "password",
      },
    };

    const res = mockResponse();

    await loginController(req, res);

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userId: 1,
        role: "user",
      },
      "secret",
      {
        expiresIn: "1h",
      }
    );

    expect(res.json).toHaveBeenCalledWith({
      token: "jwt-token",
      user: {
        id: 1,
        email: "test@test.com",
        username: "gari",
      },
    });
  });

  it("should return 500 if database throws", async () => {
    findUserByEmail.mockRejectedValue(
      new Error("Database error")
    );

    const req = {
      body: {
        email: "test@test.com",
        password: "password",
      },
    };

    const res = mockResponse();

    await loginController(req, res);

    expect(console.error).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      error: "Internal server error",
    });
  });
});