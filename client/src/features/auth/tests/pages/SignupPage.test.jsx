import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import SignupPage from "../../pages/SignupPage";
import { apiClient } from "@/shared/lib";

// Mock ONLY the api client
vi.mock("@/shared/lib", () => ({
    apiClient: {
        post: vi.fn(),
    },
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe("SignupPage Integration", () => {
    it("submits a valid signup form", async () => {
        const user = userEvent.setup();

        apiClient.post.mockResolvedValue({
            data: {
                message: "User created",
            },
        });

        render(
            <MemoryRouter>
                <SignupPage />
            </MemoryRouter>
        );

        await user.type(
            screen.getByRole("textbox", { name: /username/i }),
            "gariman"
        );

        await user.type(
            screen.getByRole("textbox", { name: /email/i }),
            "gariman@test.com"
        );

        await user.type(
            screen.getByLabelText(/^password$/i),
            "password123"
        );

        await user.type(
            screen.getByLabelText(/confirm password/i),
            "password123"
        );

        await user.click(
            screen.getByRole("button", {
                name: /sign up/i,
            })
        );

        expect(apiClient.post).toHaveBeenCalledTimes(1);

        expect(apiClient.post).toHaveBeenCalledWith(
            "/auth/signup",
            {
                username: "gariman",
                email: "gariman@test.com",
                password: "password123",
                confirmPassword: "password123",
            }
        );
    });

    it("does not call the API when validation fails", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <SignupPage />
            </MemoryRouter>
        );

        await user.click(
            screen.getByRole("button", {
                name: /sign up/i,
            })
        );

        expect(
            screen.getByText(/username is required/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/email is required/i)
        ).toBeInTheDocument();

        expect(apiClient.post).not.toHaveBeenCalled();
    });
});