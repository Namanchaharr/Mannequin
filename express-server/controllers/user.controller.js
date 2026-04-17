import { createUser } from "../models/user.model.js";

export async function createUserController(req, res) {
  try {
    const { email, password, username } = req.body;

    // basic validation (keep it simple for now)
    if (!email || !password || !username) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const user = await createUser({ email, password, username });

    res.status(201).json(user);

  } catch (err) {
    console.error(err.message);

    // handle duplicate email
    if (err.code === "23505") {
      return res.status(400).json({ error: "Email already exists" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
}