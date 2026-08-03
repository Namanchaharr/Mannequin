import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import useSignup from "../../hooks/useSignup";
import { signup } from "../../api/signup";

// --------------------
// Mocks
// --------------------

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock("../../api/signup", () => ({
    signup: vi.fn(),
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe("useSignup", () => {
    const userData = {
        username: "gariman",
        email: "test@example.com",
        password: "password123",
    };

    it("starts with default state", () => {
        const { result } = renderHook(() => useSignup());

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe("");
    });

    it("calls signup API", async () => {
        signup.mockResolvedValue({
            message: "User created",
        });

        const { result } = renderHook(() => useSignup());

        await act(async () => {
            await result.current.signupUser(userData);
        });

        expect(signup).toHaveBeenCalledTimes(1);
        expect(signup).toHaveBeenCalledWith(userData);
    });

    it("navigates to login after successful signup", async () => {
        signup.mockResolvedValue({
            message: "User created",
        });

        const { result } = renderHook(() => useSignup());

        await act(async () => {
            await result.current.signupUser(userData);
        });

        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    it("returns API response", async () => {
        const response = {
            message: "User created",
        };

        signup.mockResolvedValue(response);

        const { result } = renderHook(() => useSignup());

        let data;

        await act(async () => {
            data = await result.current.signupUser(userData);
        });

        expect(data).toEqual(response);
    });

    it("stores backend error", async () => {
        signup.mockRejectedValue({
            response: {
                data: {
                    error: "Email already exists",
                },
            },
        });

        const { result } = renderHook(() => useSignup());

        await act(async () => {
            await result.current.signupUser(userData);
        });

        expect(result.current.error).toBe("Email already exists");
    });

    it("stores generic error when backend message is missing", async () => {
        signup.mockRejectedValue(new Error("Network Error"));

        const { result } = renderHook(() => useSignup());

        await act(async () => {
            await result.current.signupUser(userData);
        });

        expect(result.current.error).toBe(
            "Something went wrong. Please try again."
        );
    });

    it("clears previous errors on successful signup", async () => {
        signup.mockRejectedValueOnce({
            response: {
                data: {
                    error: "Email already exists",
                },
            },
        });

        const { result } = renderHook(() => useSignup());

        await act(async () => {
            await result.current.signupUser(userData);
        });

        expect(result.current.error).toBe("Email already exists");

        signup.mockResolvedValueOnce({
            message: "User created",
        });

        await act(async () => {
            await result.current.signupUser(userData);
        });

        expect(result.current.error).toBe("");
    });

    it("loading is false after request completes", async () => {
        signup.mockResolvedValue({
            message: "User created",
        });

        const { result } = renderHook(() => useSignup());

        await act(async () => {
            await result.current.signupUser(userData);
        });

        expect(result.current.loading).toBe(false);
    });
});