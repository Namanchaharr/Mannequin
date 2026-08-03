import { useState } from "react";

import { Input, Button } from "@/shared/ui";
import validateSignup from "@/features/auth/utils/validateSignup";
import useSignup from "../hooks/useSignup";

export default function SignupForm() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});

    // Get signup logic and UI state from the hook.
    const { signupUser, loading, error } = useSignup();

    // Basically taking the values from the form and updating state.
    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    }

    // Made async because signupUser returns a Promise.
    async function handleSubmit(event) {
        event.preventDefault();

        // Get validation errors.
        const validationErrors = validateSignup(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear validation errors.
        setErrors({});

        // Delegate signup to the custom hook.
        // The hook manages loading, backend errors and navigation.
        await signupUser(formData);
    }

    return (
        <form onSubmit={handleSubmit}>
            <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
            />

            <Input
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
            />

            <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
            />

            <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
            />

            {/* ===== CHANGED =====
                Display backend errors separately from validation errors.
                This can later be replaced by a shared toast component.
            */}
            {error && <p>{error}</p>}

            {/* ===== CHANGED =====
                Disable the button while the signup request is in progress.
            */}
            <Button
                type="submit"
                disabled={loading}
            >
                {loading ? "Signing Up..." : "Sign Up"}
            </Button>
        </form>
    );
}