import { describe, it, expect, vi, beforeEach } from "vitest";
import { signup } from "../../api/signup";
import { apiClient } from "@/shared/lib";

// Mock the shared api client
vi.mock("@/shared/lib", () => ({
    apiClient: {
        post: vi.fn(),
    },
}));

const userData = {
    username: "gariman",
    email: "test@example.com",
    password: "password123",
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe("signup API", () => {
    it("calls the correct endpoint with the correct data", async () => {
        apiClient.post.mockResolvedValue({
            data: {},
        });

        await signup(userData);

        expect(apiClient.post).toHaveBeenCalledTimes(1);

        expect(apiClient.post).toHaveBeenCalledWith(
            "/auth/signup",
            userData
        );
    });

    it("returns the response data", async () => {
        const mockResponse = {
            message: "User created successfully",
        };

        apiClient.post.mockResolvedValue({
            data: mockResponse,
        });

        const result = await signup(userData);

        expect(result).toEqual(mockResponse);
    });

    it("throws an error when the request fails", async () => {
        const error = new Error("Network Error");

        apiClient.post.mockRejectedValue(error);

        await expect(signup(userData)).rejects.toThrow("Network Error");
    });
});