import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SignupForm from "../../components/SignupForm";
import useSignup from "../../hooks/useSignup";

// Mock the custom hook
vi.mock("../../hooks/useSignup");

const mockSignupUser = vi.fn();

beforeEach(() => {
    vi.clearAllMocks();

    useSignup.mockReturnValue({
        signupUser: mockSignupUser,
        loading: false,
        error: "",
    });
});

describe("SignupForm", () => {
    describe("Rendering", () => {
        it("renders all form fields", () => {
            render(<SignupForm />);

            expect(
                screen.getByRole("textbox", { name: /username/i })
            ).toBeInTheDocument();

            expect(
                screen.getByRole("textbox", { name: /email/i })
            ).toBeInTheDocument();

            expect(
                screen.getByLabelText(/^password$/i)
            ).toBeInTheDocument();

            expect(
                screen.getByLabelText(/confirm password/i)
            ).toBeInTheDocument();

            expect(
                screen.getByRole("button", { name: /sign up/i })
            ).toBeInTheDocument();
        });
    });

    describe("Input", () => {
        it("updates username", async () => {
            const user = userEvent.setup();

            render(<SignupForm />);

            const username = screen.getByRole("textbox", {
                name: /username/i,
            });

            await user.type(username, "gariman");

            expect(username).toHaveValue("gariman");
        });

        it("updates email", async () => {
            const user = userEvent.setup();

            render(<SignupForm />);

            const email = screen.getByRole("textbox", {
                name: /email/i,
            });

            await user.type(email, "gariman@test.com");

            expect(email).toHaveValue("gariman@test.com");
        });

        it("updates password", async () => {
            const user = userEvent.setup();

            render(<SignupForm />);

            const password = screen.getByLabelText(/^password$/i);

            await user.type(password, "password123");

            expect(password).toHaveValue("password123");
        });

        it("updates confirm password", async () => {
            const user = userEvent.setup();

            render(<SignupForm />);

            const confirm = screen.getByLabelText(/confirm password/i);

            await user.type(confirm, "password123");

            expect(confirm).toHaveValue("password123");
        });
    });

    describe("Validation", () => {
        it("shows validation errors when submitting an empty form", async () => {
            const user = userEvent.setup();

            render(<SignupForm />);

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

            expect(
                screen.getByText(/password must be at least 8 characters/i)
            ).toBeInTheDocument();

            expect(mockSignupUser).not.toHaveBeenCalled();
        });

        it("shows invalid email error", async () => {
            const user = userEvent.setup();

            render(<SignupForm />);

            await user.type(
                screen.getByRole("textbox", { name: /username/i }),
                "gariman"
            );

            await user.type(
                screen.getByRole("textbox", { name: /email/i }),
                "abc"
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

            expect(
                screen.getByText(/please enter a valid email address/i)
            ).toBeInTheDocument();

            expect(mockSignupUser).not.toHaveBeenCalled();
        });

        it("shows password mismatch error", async () => {
            const user = userEvent.setup();

            render(<SignupForm />);

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
                "differentpassword"
            );

            await user.click(
                screen.getByRole("button", {
                    name: /sign up/i,
                })
            );

            expect(
                screen.getByText(/passwords do not match/i)
            ).toBeInTheDocument();

            expect(mockSignupUser).not.toHaveBeenCalled();
        });
    });

    describe("Submission", () => {
        it("calls signupUser with valid form data", async () => {
            const user = userEvent.setup();

            render(<SignupForm />);

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

            expect(mockSignupUser).toHaveBeenCalledTimes(1);

            expect(mockSignupUser).toHaveBeenCalledWith({
                username: "gariman",
                email: "gariman@test.com",
                password: "password123",
                confirmPassword: "password123",
            });
        });
    });

    describe("Loading State", () => {
        it("disables button while loading", () => {
            useSignup.mockReturnValue({
                signupUser: mockSignupUser,
                loading: true,
                error: "",
            });

            render(<SignupForm />);

            const button = screen.getByRole("button");

            expect(button).toBeDisabled();
            expect(button).toHaveTextContent("Signing Up...");
        });
    });

    describe("Backend Errors", () => {
        it("displays backend error message", () => {
            useSignup.mockReturnValue({
                signupUser: mockSignupUser,
                loading: false,
                error: "Email already exists",
            });

            render(<SignupForm />);

            expect(
                screen.getByText(/email already exists/i)
            ).toBeInTheDocument();
        });
    });
});