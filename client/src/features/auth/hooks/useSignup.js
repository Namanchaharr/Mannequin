import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/signup";

export default function useSignup() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    // ===== CHANGED =====
    // Renamed from serverError for consistency with future hooks.
    const [error, setError] = useState("");

    async function signupUser(userData) {
        try {
            setLoading(true);

            // ===== CHANGED =====
            // Clear any previous backend error.
            setError("");

            const data = await signup(userData);

            navigate("/login");

            return data;
        } catch (err) {
            // ===== CHANGED =====
            // Store the backend error so the UI can display it.
            setError(
                err.response?.data?.error ||
                "Something went wrong. Please try again."
            );

            // ===== CHANGED =====
            // Do not rethrow. The hook owns backend error handling.
        } finally {
            setLoading(false);
        }
    }

    return {
        signupUser,
        loading,

        // ===== CHANGED =====
        error,
    };
}