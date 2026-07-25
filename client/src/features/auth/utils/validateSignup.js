export function validateSignup({ email, password, username }) {
  if (!username.trim()) {
    return "Username is required";
  }

  if (!email.trim()) {
    return "Email is required";
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Invalid email";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  return null;
}