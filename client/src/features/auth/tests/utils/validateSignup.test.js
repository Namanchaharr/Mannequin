import { describe, it, expect } from "vitest";
import validateSignup from "../../utils/validateSignup";

describe("validateSignup", () => {
    describe("Username validation", () => {
        it("returns an error when username is empty", () => {
            const errors = validateSignup({
                username: "",
                email: "test@example.com",
                password: "password123",
                confirmPassword: "password123",
            });

            expect(errors.username).toBe("Username is required");
        });

        it("returns an error when username contains only spaces", () => {
            const errors = validateSignup({
                username: "   ",
                email: "test@example.com",
                password: "password123",
                confirmPassword: "password123",
            });

            expect(errors.username).toBe("Username is required");
        });

        it("accepts a valid username", () => {
            const errors = validateSignup({
                username: "gariman",
                email: "test@example.com",
                password: "password123",
                confirmPassword: "password123",
            });

            expect(errors.username).toBeUndefined();
        });
    });

    describe("Email validation", () => {
        it("returns an error when email is empty", () => {
            const errors = validateSignup({
                username: "gariman",
                email: "",
                password: "password123",
                confirmPassword: "password123",
            });

            expect(errors.email).toBe("Email is required");
        });

        it("returns an error when email contains only spaces", () => {
            const errors = validateSignup({
                username: "gariman",
                email: "   ",
                password: "password123",
                confirmPassword: "password123",
            });

            expect(errors.email).toBe("Email is required");
        });

        it("returns an error for an invalid email (abc)", () => {
            const errors = validateSignup({
                username: "gariman",
                email: "abc",
                password: "password123",
                confirmPassword: "password123",
            });

            expect(errors.email).toBe("Please enter a valid email address");
        });

        it("returns an error for an invalid email (abc@)", () => {
            const errors = validateSignup({
                username: "gariman",
                email: "abc@",
                password: "password123",
                confirmPassword: "password123",
            });

            expect(errors.email).toBe("Please enter a valid email address");
        });

        it("returns an error for an invalid email (abc.com)", () => {
            const errors = validateSignup({
                username: "gariman",
                email: "abc.com",
                password: "password123",
                confirmPassword: "password123",
            });

            expect(errors.email).toBe("Please enter a valid email address");
        });

        it("accepts a valid email", () => {
            const errors = validateSignup({
                username: "gariman",
                email: "test@example.com",
                password: "password123",
                confirmPassword: "password123",
            });

            expect(errors.email).toBeUndefined();
        });
    });

    describe("Password validation", () => {
        it("returns an error when password is shorter than 8 characters", () => {
            const errors = validateSignup({
                username: "gariman",
                email: "test@example.com",
                password: "pass",
                confirmPassword: "pass",
            });

            expect(errors.password).toBe(
                "Password must be at least 8 characters"
            );
        });

        it("accepts a password with exactly 8 characters", () => {
            const errors = validateSignup({
                username: "gariman",
                email: "test@example.com",
                password: "12345678",
                confirmPassword: "12345678",
            });

            expect(errors.password).toBeUndefined();
        });

        it("accepts a password longer than 8 characters", () => {
            const errors = validateSignup({
                username: "gariman",
                email: "test@example.com",
                password: "password123",
                confirmPassword: "password123",
            });

            expect(errors.password).toBeUndefined();
        });
    });

    describe("Confirm password validation", () => {
        it("returns an error when passwords do not match", () => {
            const errors = validateSignup({
                username: "gariman",
                email: "test@example.com",
                password: "password123",
                confirmPassword: "different123",
            });

            expect(errors.confirmPassword).toBe("Passwords do not match");
        });

        it("accepts matching passwords", () => {
            const errors = validateSignup({
                username: "gariman",
                email: "test@example.com",
                password: "password123",
                confirmPassword: "password123",
            });

            expect(errors.confirmPassword).toBeUndefined();
        });

        it("returns an error when confirm password is empty", () => {
            const errors = validateSignup({
                username: "gariman",
                email: "test@example.com",
                password: "password123",
                confirmPassword: "",
            });

            expect(errors.confirmPassword).toBe("Passwords do not match");
        });

        it("does not return a confirm password error when both passwords are empty", () => {
            const errors = validateSignup({
                username: "gariman",
                email: "test@example.com",
                password: "",
                confirmPassword: "",
            });

            expect(errors.confirmPassword).toBeUndefined();
            expect(errors.password).toBe(
                "Password must be at least 8 characters"
            );
        });
    });

    describe("Combined validation", () => {
        it("returns all validation errors for a completely invalid form", () => {
            const errors = validateSignup({
                username: "",
                email: "",
                password: "",
                confirmPassword: "abc",
            });

            expect(errors).toEqual({
                username: "Username is required",
                email: "Email is required",
                password: "Password must be at least 8 characters",
                confirmPassword: "Passwords do not match",
            });
        });

        it("returns only the email error", () => {
            const errors = validateSignup({
                username: "gariman",
                email: "invalid-email",
                password: "password123",
                confirmPassword: "password123",
            });

            expect(errors).toEqual({
                email: "Please enter a valid email address",
            });
        });

        it("returns only the password error", () => {
            const errors = validateSignup({
                username: "gariman",
                email: "test@example.com",
                password: "short",
                confirmPassword: "short",
            });

            expect(errors).toEqual({
                password: "Password must be at least 8 characters",
            });
        });

        it("returns only the confirm password error", () => {
            const errors = validateSignup({
                username: "gariman",
                email: "test@example.com",
                password: "password123",
                confirmPassword: "password456",
            });

            expect(errors).toEqual({
                confirmPassword: "Passwords do not match",
            });
        });

        it("returns multiple errors together", () => {
            const errors = validateSignup({
                username: "",
                email: "invalid-email",
                password: "short",
                confirmPassword: "different",
            });

            expect(errors).toEqual({
                username: "Username is required",
                email: "Please enter a valid email address",
                password: "Password must be at least 8 characters",
                confirmPassword: "Passwords do not match",
            });
        });

        it("returns an empty object for a valid form", () => {
            const errors = validateSignup({
                username: "gariman",
                email: "test@example.com",
                password: "password123",
                confirmPassword: "password123",
            });

            expect(errors).toEqual({});
        });
    });
});