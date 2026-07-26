// ===== CHANGED =====
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function validateSignup(formData) {
    const errors = {};

    if (!formData.username.trim()) {
        errors.username = "Username is required";
    }

    // ===== CHANGED =====
    if (!formData.email.trim()) {
        errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address";
    }

    if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
}