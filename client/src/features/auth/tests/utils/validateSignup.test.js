import { describe, it, expect } from "vitest";
import validateSignup from "../../utils/validateSignup";

const validForm = {
    username: "gariman",
    email: "test@example.com",
    password: "password123",
    confirmPassword: "password123",
};

describe("validateSignup", () => {
    describe("Username", () => {
        it.each(["", "   "])("rejects username '%s'", (username) => {
            expect(
                validateSignup({ ...validForm, username }).username
            ).toBe("Username is required");
        });

        it("accepts a valid username", () => {
            expect(validateSignup(validForm).username).toBeUndefined();
        });
    });

    describe("Email", () => {
        it.each(["", "   "])("rejects empty email '%s'", (email) => {
            expect(
                validateSignup({ ...validForm, email }).email
            ).toBe("Email is required");
        });

        it.each(["abc", "abc@", "abc.com"])(
            "rejects invalid email '%s'",
            (email) => {
                expect(
                    validateSignup({ ...validForm, email }).email
                ).toBe("Please enter a valid email address");
            }
        );

        it("accepts a valid email", () => {
            expect(validateSignup(validForm).email).toBeUndefined();
        });
    });

    describe("Password", () => {
        it("rejects passwords shorter than 8 characters", () => {
            expect(
                validateSignup({
                    ...validForm,
                    password: "short",
                    confirmPassword: "short",
                }).password
            ).toBe("Password must be at least 8 characters");
        });

        it.each(["12345678", "password123"])(
            "accepts password '%s'",
            (password) => {
                expect(
                    validateSignup({
                        ...validForm,
                        password,
                        confirmPassword: password,
                    }).password
                ).toBeUndefined();
            }
        );
    });

    describe("Confirm Password", () => {
        it("rejects mismatched passwords", () => {
            expect(
                validateSignup({
                    ...validForm,
                    confirmPassword: "different123",
                }).confirmPassword
            ).toBe("Passwords do not match");
        });

        it("accepts matching passwords", () => {
            expect(validateSignup(validForm).confirmPassword).toBeUndefined();
        });

        it("allows both passwords to be empty", () => {
            const errors = validateSignup({
                ...validForm,
                password: "",
                confirmPassword: "",
            });

            expect(errors.confirmPassword).toBeUndefined();
            expect(errors.password).toBe(
                "Password must be at least 8 characters"
            );
        });
    });

    describe("Combined", () => {
        it("returns multiple errors", () => {
            expect(
                validateSignup({
                    username: "",
                    email: "invalid-email",
                    password: "short",
                    confirmPassword: "different",
                })
            ).toEqual({
                username: "Username is required",
                email: "Please enter a valid email address",
                password: "Password must be at least 8 characters",
                confirmPassword: "Passwords do not match",
            });
        });

        it("returns an empty object for a valid form", () => {
            expect(validateSignup(validForm)).toEqual({});
        });
    });
});