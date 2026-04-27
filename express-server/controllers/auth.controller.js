import { createUser, findUserByEmail } from "../models/auth.model.js";
import jwt from "jsonwebtoken";


//need to add backend limits like is username and password are valid 
//also need to add hashing to save password
export async function createUserController(req, res) {
  try {
    const { email, password, username } = req.body;

    // basic validation 
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


// LOGIN
//after adding hashing this code should not break
export async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    // validation
    if (!email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // isMatch should have hashing ideally
    const isMatch = password === user.password;

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    //adding JWT token for the having a session 
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}